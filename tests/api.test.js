'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { initDb } = require('../src/db');
const { createApp } = require('../server');

function openRawSqlite(dbPath) {
  try {
    const { DatabaseSync } = require('node:sqlite');
    if (typeof DatabaseSync === 'function') {
      return new DatabaseSync(dbPath);
    }
  } catch {
    // Fallback for runtimes without built-in node:sqlite.
  }
  const BetterSqlite3 = require('better-sqlite3');
  return new BetterSqlite3(dbPath);
}

describe('SQLite Persistence & Litestream Safety', () => {
  let tmpDir;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baitcheck-db-'));
  });

  after(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('persists challenges, drill results, and forensic scans across close() and reopen', () => {
    const dbPath = path.join(tmpDir, 'persist.db');
    const db1 = initDb(dbPath);

    const created = db1.createChallenge({
      id: 'mom-persist1',
      creatorName: 'Aarav',
      targetLabel: 'Mom',
      lang: 'hi'
    });
    assert.equal(created.id, 'mom-persist1');
    assert.equal(created.lang, 'hi');

    db1.recordDrillResult({
      challengeId: 'mom-persist1',
      scenarioId: 'drill-1-call',
      passed: true,
      reactionMs: 3200,
      missedFlag: null
    });
    db1.recordForensicScan({
      riskScore: 60,
      rulesHit: [{ ruleId: 'punycode_homoglyph', points: 35 }]
    });
    db1.refreshDailyStats();
    db1.close();

    const db2 = initDb(dbPath);
    try {
      const fetched = db2.getChallenge('mom-persist1');
      assert.ok(fetched, 'Expected challenge to persist across reopen');
      assert.equal(fetched.challenge.creator_name, 'Aarav');
      assert.equal(fetched.challenge.target_label, 'Mom');
      assert.equal(fetched.results.length, 1);
      assert.equal(fetched.results[0].scenario_id, 'drill-1-call');
      assert.equal(fetched.results[0].passed, 1);
      assert.equal(fetched.results[0].reaction_ms, 3200);

      const stats = db2.getCohortStats();
      assert.equal(stats.totalDrills, 143);
      assert.equal(stats.totalScans, 1);
    } finally {
      db2.close();
    }
  });

  it('preserves pre-existing _litestream_seq and _litestream_lock tables and rows', () => {
    const dbPath = path.join(tmpDir, 'litestream.db');
    const raw1 = openRawSqlite(dbPath);
    try {
      raw1.exec(`
        CREATE TABLE _litestream_seq (id INTEGER PRIMARY KEY, seq INTEGER NOT NULL);
        INSERT INTO _litestream_seq (id, seq) VALUES (1, 42);
        CREATE TABLE _litestream_lock (id INTEGER PRIMARY KEY);
        INSERT INTO _litestream_lock (id) VALUES (1);
      `);
    } finally {
      raw1.close();
    }

    const db = initDb(dbPath);
    db.createChallenge({
      id: 'litestream-chk',
      creatorName: 'Tester',
      targetLabel: 'Dad',
      lang: 'en'
    });
    db.close();

    const raw2 = openRawSqlite(dbPath);
    try {
      const seqRows = raw2.prepare('SELECT id, seq FROM _litestream_seq ORDER BY id ASC').all();
      const lockRows = raw2.prepare('SELECT id FROM _litestream_lock ORDER BY id ASC').all();
      assert.equal(seqRows.length, 1);
      assert.equal(Number(seqRows[0].id), 1);
      assert.equal(Number(seqRows[0].seq), 42);
      assert.equal(lockRows.length, 1);
      assert.equal(Number(lockRows[0].id), 1);
    } finally {
      raw2.close();
    }
  });
});

describe('Full HTTP API Lifecycle & Zero-PII Integration', () => {
  let tmpDir;
  let dbPath;
  let app;
  let server;
  let baseUrl;
  let originalCronSecret;

  before(async () => {
    originalCronSecret = process.env.CRON_SECRET;
    delete process.env.CRON_SECRET;

    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baitcheck-http-'));
    dbPath = path.join(tmpDir, 'http-api.db');
    app = createApp({ dbPath });
    server = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    const addr = server.address();
    baseUrl = `http://127.0.0.1:${addr.port}`;
  });

  after(async () => {
    if (originalCronSecret === undefined) {
      delete process.env.CRON_SECRET;
    } else {
      process.env.CRON_SECRET = originalCronSecret;
    }
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    if (app && app.locals && app.locals.db) {
      app.locals.db.close();
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('GET /health returns 200 with ok: true and memoryMb < 75', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ok, true);
    assert.equal(typeof body.memoryMb, 'number');
    assert.ok(body.memoryMb < 75, `Expected memoryMb < 75, got ${body.memoryMb}`);
    assert.equal(typeof body.uptime, 'number');
  });

  it('GET /api/drills returns 3 drills, 3 playbook steps, and 4 presets', async () => {
    const res = await fetch(`${baseUrl}/api/drills`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.drills.length, 3);
    assert.equal(body.playbook.steps.length, 3);
    assert.equal(body.presets.length, 4);
  });

  it('GET /api/stats returns seeded cohort baseline (totalDrills >= 142)', async () => {
    const res = await fetch(`${baseUrl}/api/stats`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.totalDrills >= 142);
    assert.equal(body.passRatePct, 61.5);
    assert.equal(body.topMissedScenario, 'drill-2-apk');
  });

  it('POST /api/scan scores all 4 presets accurately and rejects invalid payloads with 400', async () => {
    const drillsRes = await fetch(`${baseUrl}/api/drills`);
    const { presets } = await drillsRes.json();

    const expectedVerdicts = {
      'preset-punycode-kyc': 'high',
      'preset-pdf-apk': 'high',
      'preset-upi-collect': 'high',
      'preset-safe-link': 'low'
    };

    for (const preset of presets) {
      const res = await fetch(`${baseUrl}/api/scan`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: preset.text })
      });
      assert.equal(res.status, 200, `Expected 200 for preset ${preset.id}`);
      const body = await res.json();
      assert.equal(body.verdictLevel, expectedVerdicts[preset.id], `Preset ${preset.id} verdictLevel`);
      assert.equal(
        body.highlightedSegments.map((s) => s.text).join(''),
        preset.text,
        `Lossless segments failed for ${preset.id}`
      );
    }

    // Empty input -> 400
    const emptyRes = await fetch(`${baseUrl}/api/scan`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: '   ' })
    });
    assert.equal(emptyRes.status, 400);
    const emptyBody = await emptyRes.json();
    assert.equal(emptyBody.code, 'EMPTY_INPUT');

    // >2000 chars -> 400
    const longRes = await fetch(`${baseUrl}/api/scan`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: 'a'.repeat(2001) })
    });
    assert.equal(longRes.status, 400);
    const longBody = await longRes.json();
    assert.equal(longBody.code, 'INPUT_TOO_LONG');

    // Malformed JSON -> 400
    const badJsonRes = await fetch(`${baseUrl}/api/scan`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"text": "unterminated'
    });
    assert.equal(badJsonRes.status, 400);
    const badJsonBody = await badJsonRes.json();
    assert.equal(badJsonBody.error, 'Invalid JSON payload');
  });

  it('Zero-PII check: POST /api/scan never stores raw sensitive URL/text in forensic_scans', async () => {
    const secretMarker = 'SensitiveCitizenName9911';
    const secretUrl = 'https://xn--metrobank-kyc-9x2a.example/private-token-778899?phone=9876543210';
    const sensitiveInput = `URGENT for ${secretMarker}: verify immediately at ${secretUrl}`;

    const scanRes = await fetch(`${baseUrl}/api/scan`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: sensitiveInput })
    });
    assert.equal(scanRes.status, 200);
    const scanBody = await scanRes.json();
    assert.equal(scanBody.verdictLevel, 'high');

    const rawDb = openRawSqlite(dbPath);
    try {
      const rows = rawDb.prepare('SELECT id, risk_score, rules_hit_json FROM forensic_scans').all();
      assert.ok(rows.length >= 1);
      const serialized = JSON.stringify(rows);
      assert.equal(serialized.includes(secretMarker), false, 'Raw name leaked into forensic_scans');
      assert.equal(serialized.includes('private-token-778899'), false, 'Raw URL path leaked into forensic_scans');
      assert.equal(serialized.includes('9876543210'), false, 'Raw phone query leaked into forensic_scans');
      assert.equal(serialized.includes('xn--metrobank-kyc-9x2a.example'), false, 'Raw domain leaked into forensic_scans');

      const latest = rows[rows.length - 1];
      assert.equal(Number(latest.risk_score), scanBody.riskScore);
      const parsedRules = JSON.parse(latest.rules_hit_json);
      assert.ok(Array.isArray(parsedRules));
      assert.ok(parsedRules.some((r) => r.ruleId === 'punycode_homoglyph'));
    } finally {
      rawDb.close();
    }
  });

  it('POST /api/challenge validates inputs, creates slug, and handles non-ASCII "माँ" fallback', async () => {
    // Missing creatorName -> 400
    const missingCreator = await fetch(`${baseUrl}/api/challenge`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ targetLabel: 'Mom' })
    });
    assert.equal(missingCreator.status, 400);

    // Missing targetLabel -> 400
    const missingTarget = await fetch(`${baseUrl}/api/challenge`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ creatorName: 'Aarav' })
    });
    assert.equal(missingTarget.status, 400);

    // Oversized creatorName (>40) -> 400
    const bigCreator = await fetch(`${baseUrl}/api/challenge`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ creatorName: 'c'.repeat(41), targetLabel: 'Mom' })
    });
    assert.equal(bigCreator.status, 400);

    // Oversized targetLabel (>40) -> 400
    const bigTarget = await fetch(`${baseUrl}/api/challenge`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ creatorName: 'Aarav', targetLabel: 't'.repeat(41) })
    });
    assert.equal(bigTarget.status, 400);

    // Valid English challenge -> 201
    const validRes = await fetch(`${baseUrl}/api/challenge`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ creatorName: 'Aarav', targetLabel: 'Mom', lang: 'en' })
    });
    assert.equal(validRes.status, 201);
    const validBody = await validRes.json();
    assert.match(validBody.id, /^mom-[a-z0-9]{4}$/);
    assert.equal(validBody.creator_name, 'Aarav');
    assert.equal(validBody.target_label, 'Mom');
    assert.equal(validBody.challengeUrl, `/c/${validBody.id}`);
    assert.equal(validBody.reportUrl, `/c/${validBody.id}/report`);

    // Non-ASCII 'माँ' fallback -> 'family-xxxx' slug
    const hindiRes = await fetch(`${baseUrl}/api/challenge`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ creatorName: 'आरव', targetLabel: 'माँ', lang: 'hi' })
    });
    assert.equal(hindiRes.status, 201);
    const hindiBody = await hindiRes.json();
    assert.match(hindiBody.id, /^family-[a-z0-9]{4}$/);
    assert.equal(hindiBody.target_label, 'माँ');
    assert.equal(hindiBody.lang, 'hi');
  });

  it('GET /api/challenge/:id returns 404 on unknown/invalid IDs and 200 on created ID', async () => {
    const unknownRes = await fetch(`${baseUrl}/api/challenge/unknown-9999`);
    assert.equal(unknownRes.status, 404);

    for (const invalidId of ['x', 'bad!slug', 'A'.repeat(41)]) {
      const invalidRes = await fetch(`${baseUrl}/api/challenge/${encodeURIComponent(invalidId)}`);
      assert.equal(invalidRes.status, 404, `Expected 404 for invalid id: ${invalidId}`);
    }

    const createRes = await fetch(`${baseUrl}/api/challenge`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ creatorName: 'Diya', targetLabel: 'Nana', lang: 'en' })
    });
    const created = await createRes.json();

    const getRes = await fetch(`${baseUrl}/api/challenge/${created.id}`);
    assert.equal(getRes.status, 200);
    const body = await getRes.json();
    assert.equal(body.challenge.id, created.id);
    assert.deepEqual(body.results, []);
    assert.equal(body.summary.immunityScore, 0);
    assert.equal(body.summary.completedCount, 0);
    assert.equal(body.summary.totalScenarios, 3);
    assert.equal(body.summary.averageReactionMs, null);
  });

  it('POST /api/challenge/:id/result validates scenarioId/challenge and computes immunityScore 100, 65, 0', async () => {
    async function createChallenge(targetLabel) {
      const r = await fetch(`${baseUrl}/api/challenge`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ creatorName: 'Rohan', targetLabel, lang: 'en' })
      });
      assert.equal(r.status, 201);
      return r.json();
    }

    const c1 = await createChallenge('Score100');

    // Invalid scenarioId -> 400
    const badScenario = await fetch(`${baseUrl}/api/challenge/${c1.id}/result`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ scenarioId: 'drill-fake-99', passed: true, reactionMs: 2500 })
    });
    assert.equal(badScenario.status, 400);

    // Non-boolean passed values ("yes", "FALSE") -> 400 { error: 'passed must be a boolean' }
    for (const badPassed of ['yes', 'FALSE']) {
      const badPassedRes = await fetch(`${baseUrl}/api/challenge/${c1.id}/result`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ scenarioId: 'drill-1-call', passed: badPassed, reactionMs: 2500 })
      });
      assert.equal(badPassedRes.status, 400, `Expected 400 for passed=${badPassed}`);
      assert.deepEqual(await badPassedRes.json(), { error: 'passed must be a boolean' });
    }

    // Unknown challenge -> 404
    const unknownChallenge = await fetch(`${baseUrl}/api/challenge/unknown-1234/result`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ scenarioId: 'drill-1-call', passed: true, reactionMs: 2500 })
    });
    assert.equal(unknownChallenge.status, 404);

    // Case 1: All 3 pass -> immunityScore 100, averageReactionMs 4000
    const passAll = [
      { scenarioId: 'drill-1-call', passed: true, reactionMs: 3000, missedFlag: null },
      { scenarioId: 'drill-2-apk', passed: true, reactionMs: 4000, missedFlag: null },
      { scenarioId: 'drill-3-upi', passed: true, reactionMs: 5000, missedFlag: null }
    ];
    let lastBody100;
    for (const item of passAll) {
      const r = await fetch(`${baseUrl}/api/challenge/${c1.id}/result`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(item)
      });
      assert.equal(r.status, 201);
      lastBody100 = await r.json();
    }
    assert.equal(lastBody100.summary.immunityScore, 100);
    assert.equal(lastBody100.summary.completedCount, 3);
    assert.equal(lastBody100.summary.averageReactionMs, 4000);

    // Case 2: Pass drill-1 (35) + fail drill-2 (0) + pass drill-3 (30) -> immunityScore 65
    const c2 = await createChallenge('Score65');
    const partial = [
      { scenarioId: 'drill-1-call', passed: true, reactionMs: 2000, missedFlag: null },
      { scenarioId: 'drill-2-apk', passed: false, reactionMs: 3000, missedFlag: 'apk-disguised-extension' },
      { scenarioId: 'drill-3-upi', passed: true, reactionMs: 4000, missedFlag: null }
    ];
    let lastBody65;
    for (const item of partial) {
      const r = await fetch(`${baseUrl}/api/challenge/${c2.id}/result`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(item)
      });
      assert.equal(r.status, 201);
      lastBody65 = await r.json();
    }
    assert.equal(lastBody65.summary.immunityScore, 65);
    assert.equal(lastBody65.summary.completedCount, 3);
    assert.equal(lastBody65.summary.averageReactionMs, 3000);

    // Case 3: Fail all 3 -> immunityScore 0, averageReactionMs 9000
    const c3 = await createChallenge('Score0');
    const failAll = [
      { scenarioId: 'drill-1-call', passed: false, reactionMs: 6000, missedFlag: 'digital-arrest-compliance' },
      { scenarioId: 'drill-2-apk', passed: false, reactionMs: 9000, missedFlag: 'apk-disguised-extension' },
      { scenarioId: 'drill-3-upi', passed: false, reactionMs: 12000, missedFlag: 'upi-pin-collect-trap' }
    ];
    let lastBody0;
    for (const item of failAll) {
      const r = await fetch(`${baseUrl}/api/challenge/${c3.id}/result`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(item)
      });
      assert.equal(r.status, 201);
      lastBody0 = await r.json();
    }
    assert.equal(lastBody0.summary.immunityScore, 0);
    assert.equal(lastBody0.summary.completedCount, 3);
    assert.equal(lastBody0.summary.averageReactionMs, 9000);

    // Verify GET /api/challenge/:id matches summary
    const getC2 = await fetch(`${baseUrl}/api/challenge/${c2.id}`);
    assert.equal(getC2.status, 200);
    const getC2Body = await getC2.json();
    assert.equal(getC2Body.results.length, 3);
    assert.equal(getC2Body.summary.immunityScore, 65);
    assert.equal(getC2Body.summary.averageReactionMs, 3000);
  });

  it('GET /tasks/daily-stats enforces CRON_SECRET and does not double-count cohort stats', async () => {
    process.env.CRON_SECRET = 'super-secret-cron-token';
    try {
      // Missing header -> 401
      const noAuth = await fetch(`${baseUrl}/tasks/daily-stats`);
      assert.equal(noAuth.status, 401);

      // Wrong Bearer token -> 401
      const wrongAuth = await fetch(`${baseUrl}/tasks/daily-stats`, {
        headers: { authorization: 'Bearer wrong-token' }
      });
      assert.equal(wrongAuth.status, 401);

      const statsBefore = await (await fetch(`${baseUrl}/api/stats`)).json();

      // Correct Bearer token -> 200
      const ok1 = await fetch(`${baseUrl}/tasks/daily-stats`, {
        headers: { authorization: 'Bearer super-secret-cron-token' }
      });
      assert.equal(ok1.status, 200);
      const ok1Body = await ok1.json();
      assert.equal(ok1Body.ok, true);
      assert.equal(ok1Body.stats.total_drills, statsBefore.totalDrills);

      // Second refresh must also not double-count
      const ok2 = await fetch(`${baseUrl}/tasks/daily-stats`, {
        headers: { authorization: 'Bearer super-secret-cron-token' }
      });
      assert.equal(ok2.status, 200);

      const statsAfter = await (await fetch(`${baseUrl}/api/stats`)).json();
      assert.equal(statsAfter.totalDrills, statsBefore.totalDrills);
      assert.equal(statsAfter.passRatePct, statsBefore.passRatePct);
      assert.equal(statsAfter.totalScans, statsBefore.totalScans);
    } finally {
      delete process.env.CRON_SECRET;
    }
  });

  it('GET /api/nonexistent returns 404 JSON and GET /nonexistent-page returns 404 HTML with SIMULATION ribbon', async () => {
    const apiNotFound = await fetch(`${baseUrl}/api/nonexistent`);
    assert.equal(apiNotFound.status, 404);
    assert.deepEqual(await apiNotFound.json(), { error: 'Not found' });

    const pageNotFound = await fetch(`${baseUrl}/nonexistent-page`);
    assert.equal(pageNotFound.status, 404);
    assert.match(pageNotFound.headers.get('content-type') || '', /text\/html/i);
    const html = await pageNotFound.text();
    assert.match(html, /SIMULATION/);
    assert.match(html, /404/);
  });
});

describe('POST /api/badge Storage Upload & Fallback Guardrails', () => {
  const VALID_PNG_BYTES = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
    0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
    0x42, 0x60, 0x82
  ]);
  const VALID_PNG_DATA_URL = `data:image/png;base64,${VALID_PNG_BYTES.toString('base64')}`;

  async function withTestApp(options, fn) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baitcheck-badge-'));
    const dbPath = path.join(tmpDir, 'badge.db');
    const app = createApp({ dbPath, ...options });
    const server = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    const addr = server.address();
    const baseUrl = `http://127.0.0.1:${addr.port}`;
    try {
      await fn(baseUrl);
    } finally {
      await new Promise((resolve) => server.close(resolve));
      app.locals.db.close();
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }

  it('returns 200 unconfigured fallback when STORAGE_URL/STORAGE_TOKEN are absent', async () => {
    const origUrl = process.env.STORAGE_URL;
    const origToken = process.env.STORAGE_TOKEN;
    delete process.env.STORAGE_URL;
    delete process.env.STORAGE_TOKEN;

    try {
      await withTestApp({}, async (baseUrl) => {
        const res = await fetch(`${baseUrl}/api/badge`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            filename: 'verdict-ticket-1.png',
            dataUrl: VALID_PNG_DATA_URL
          })
        });
        assert.equal(res.status, 200);
        const body = await res.json();
        assert.equal(body.uploaded, false);
        assert.equal(body.configured, false);
        assert.equal(body.url, null);
        assert.match(body.message, /STORAGE_URL not configured/);
      });
    } finally {
      if (origUrl === undefined) delete process.env.STORAGE_URL;
      else process.env.STORAGE_URL = origUrl;
      if (origToken === undefined) delete process.env.STORAGE_TOKEN;
      else process.env.STORAGE_TOKEN = origToken;
    }
  });

  it('rejects invalid filename and invalid PNG payloads with 400', async () => {
    await withTestApp({}, async (baseUrl) => {
      for (const badName of ['../evil.png', 'ab.png', 'bad name.png', 'ticket.jpg', '']) {
        const res = await fetch(`${baseUrl}/api/badge`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ filename: badName, dataUrl: VALID_PNG_DATA_URL })
        });
        assert.equal(res.status, 400, `Expected 400 for filename "${badName}"`);
        const body = await res.json();
        assert.equal(body.code, 'INVALID_FILENAME');
      }

      const badPayloads = [
        'data:image/jpeg;base64,/9j/4AAQ',
        'data:image/png;base64,not!valid!base64',
        `data:image/png;base64,${Buffer.from('NOT_A_PNG_HEADER_1234').toString('base64')}`,
        null
      ];
      for (const dataUrl of badPayloads) {
        const res = await fetch(`${baseUrl}/api/badge`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ filename: 'valid-ticket.png', dataUrl })
        });
        assert.equal(res.status, 400, `Expected 400 for invalid dataUrl: ${String(dataUrl)}`);
        const body = await res.json();
        assert.equal(body.code, 'INVALID_PNG');
      }
    });
  });

  it('returns 200 with uploaded URL when mock uploader succeeds', async () => {
    let seenFilename = null;
    let seenByteLength = 0;

    await withTestApp(
      {
        uploader: async ({ filename, pngBuffer }) => {
          seenFilename = filename;
          seenByteLength = pngBuffer.length;
          return {
            uploaded: true,
            configured: true,
            url: `https://storage.example/apps/baitcheck/files/${filename}`,
            message: 'Verdict badge uploaded.'
          };
        }
      },
      async (baseUrl) => {
        const res = await fetch(`${baseUrl}/api/badge`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            filename: 'mom-7x2a-verdict.png',
            dataUrl: VALID_PNG_DATA_URL
          })
        });
        assert.equal(res.status, 200);
        const body = await res.json();
        assert.equal(body.uploaded, true);
        assert.equal(body.configured, true);
        assert.equal(body.url, 'https://storage.example/apps/baitcheck/files/mom-7x2a-verdict.png');
        assert.equal(body.message, 'Verdict badge uploaded.');
        assert.equal(seenFilename, 'mom-7x2a-verdict.png');
        assert.equal(seenByteLength, VALID_PNG_BYTES.length);
      }
    );
  });

  it('returns 502 on upstream failure and redacts STORAGE_TOKEN from error responses', async () => {
    const origToken = process.env.STORAGE_TOKEN;
    const secretToken = 'embarko-super-secret-storage-token-9988';
    process.env.STORAGE_TOKEN = secretToken;

    try {
      await withTestApp(
        {
          uploader: async () => {
            const err = new Error(`Upstream rejected Bearer ${secretToken} with HTTP 500`);
            err.status = 502;
            err.code = 'STORAGE_UPSTREAM_REJECTED';
            throw err;
          }
        },
        async (baseUrl) => {
          const res = await fetch(`${baseUrl}/api/badge`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              filename: 'verdict-fail-test.png',
              dataUrl: VALID_PNG_DATA_URL
            })
          });
          assert.equal(res.status, 502);
          const rawText = await res.text();
          assert.equal(rawText.includes(secretToken), false, 'STORAGE_TOKEN leaked in 502 response');
          const body = JSON.parse(rawText);
          assert.equal(body.code, 'STORAGE_UPSTREAM_REJECTED');
          assert.match(body.error, /\[REDACTED\]/);
        }
      );
    } finally {
      if (origToken === undefined) delete process.env.STORAGE_TOKEN;
      else process.env.STORAGE_TOKEN = origToken;
    }
  });
});
