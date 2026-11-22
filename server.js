const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { initDb } = require('./src/db');
const { analyzeInput } = require('./src/forensicEngine');
const { DRILLS, GOLDEN_HOUR_PLAYBOOK, XRAY_PRESETS, getDrillById } = require('./src/drills');
const { uploadVerdictBadge, PNG_FILENAME_RE, isPngBuffer } = require('./src/storage');

const PUBLIC_DIR = path.join(__dirname, 'public');
const INDEX_HTML_PATH = path.join(PUBLIC_DIR, 'index.html');
const CHALLENGE_ID_RE = /^[a-z0-9-]{2,40}$/;
const PNG_DATA_URL_PREFIX = 'data:image/png;base64,';
const BASE64_BODY_RE = /^[A-Za-z0-9+/]+={0,2}$/;

const PLACEHOLDER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BaitCheck — Scam Survival Drill (Simulated)</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #161616; color: #F2EFE7; }
    .ribbon { background: #FEC917; color: #0D0D0D; font-weight: 800; padding: 10px 16px; font-size: 13px; letter-spacing: 0.04em; text-align: center; }
    main { max-width: 560px; margin: 32px auto; padding: 0 16px; }
    .card { border: 2px solid #F2EFE7; padding: 20px; background: #0D0D0D; }
  </style>
</head>
<body>
  <div class="ribbon">SIMULATION • EDUCATIONAL SCAM DRILL — NO REAL DATA, OTPs, OR DOWNLOADS</div>
  <main>
    <div class="card">
      <h1>BaitCheck</h1>
      <p>Frontend shell pending initialization in <code>public/index.html</code>.</p>
    </div>
  </main>
</body>
</html>`;

/**
 * Serves public/index.html when present, otherwise returns a safe SIMULATION placeholder page.
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 */
function serveAppShell(_req, res) {
  if (fs.existsSync(INDEX_HTML_PATH)) {
    return res.sendFile(INDEX_HTML_PATH);
  }
  return res.status(200).type('html').send(PLACEHOLDER_HTML);
}

/**
 * Generates N random lowercase base36 characters using crypto.randomBytes.
 * @param {number} length
 * @returns {string}
 */
function randomBase36(length) {
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += (bytes[i] % 36).toString(36);
  }
  return out;
}

/**
 * Generates a unique URL-safe challenge slug (e.g. mom-7x2a) retrying on collision.
 * @param {string} targetLabel
 * @param {ReturnType<typeof initDb>} db
 * @returns {string}
 */
function generateChallengeSlug(targetLabel, db) {
  const prefix =
    targetLabel
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 12)
      .replace(/-+$/g, '') || 'family';

  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate = `${prefix}-${randomBase36(4)}`;
    if (!db.getChallenge(candidate)) {
      return candidate;
    }
  }
  return `${prefix}-${randomBase36(6)}`;
}

/**
 * Computes weighted immunity score and reaction metrics from latest result per scenario.
 * @param {Array<{ scenario_id: string, passed: number, reaction_ms: number }>} results
 */
function computeChallengeSummary(results) {
  const latestByScenario = new Map();
  if (Array.isArray(results)) {
    for (const row of results) {
      if (row && typeof row.scenario_id === 'string') {
        latestByScenario.set(row.scenario_id, row);
      }
    }
  }

  let immunityScore = 0;
  let completedCount = 0;
  let reactionSum = 0;

  for (const drill of DRILLS) {
    const latest = latestByScenario.get(drill.id);
    if (!latest) continue;
    completedCount += 1;
    reactionSum += Number(latest.reaction_ms) || 0;
    if (Boolean(latest.passed)) {
      immunityScore += Number(drill.weight) || 0;
    }
  }

  return {
    immunityScore: Math.max(0, Math.min(100, immunityScore)),
    completedCount,
    totalScenarios: DRILLS.length,
    averageReactionMs: completedCount > 0 ? Math.round(reactionSum / completedCount) : null
  };
}

/**
 * Validates and decodes a base64 PNG data URL (`data:image/png;base64,...`).
 * Returns null if format, base64 encoding, PNG magic bytes, or size is invalid.
 * @param {unknown} dataUrl
 * @returns {Buffer | null}
 */
function parsePngDataUrl(dataUrl) {
  if (typeof dataUrl !== 'string') {
    return null;
  }
  const trimmed = dataUrl.trim();
  if (!trimmed.toLowerCase().startsWith(PNG_DATA_URL_PREFIX)) {
    return null;
  }
  const base64Body = trimmed.slice(PNG_DATA_URL_PREFIX.length).replace(/\s+/g, '');
  if (!base64Body || base64Body.length % 4 !== 0 || !BASE64_BODY_RE.test(base64Body)) {
    return null;
  }
  const decoded = Buffer.from(base64Body, 'base64');
  if (!isPngBuffer(decoded)) {
    return null;
  }
  return decoded;
}

/**
 * Strips process.env.STORAGE_TOKEN from any error string before sending to clients.
 * @param {string} message
 * @returns {string}
 */
function redactStorageToken(message) {
  const token = typeof process.env.STORAGE_TOKEN === 'string' ? process.env.STORAGE_TOKEN.trim() : '';
  if (!token || typeof message !== 'string') {
    return message;
  }
  return message.split(token).join('[REDACTED]');
}

/**
 * Builds and configures the Express application without binding a network port.
 * @param {{ dbPath?: string, uploader?: (params: { filename: string, pngBuffer: Buffer }) => Promise<object> }} [options]
 * @returns {import('express').Express}
 */
function createApp(options = {}) {
  const app = express();
  const db = initDb(options.dbPath);
  const uploader = typeof options.uploader === 'function' ? options.uploader : uploadVerdictBadge;
  const defaultJsonParser = express.json({ limit: '32kb' });
  const badgeJsonParser = express.json({ limit: '2mb' });

  app.locals.db = db;
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    if (req.path === '/api/badge') {
      return badgeJsonParser(req, res, next);
    }
    return defaultJsonParser(req, res, next);
  });
  app.use(express.static(PUBLIC_DIR));

  app.get('/health', (_req, res) => {
    res.status(200).json({
      ok: true,
      memoryMb: Number((process.memoryUsage().rss / 1024 / 1024).toFixed(2)),
      uptime: Math.round(process.uptime())
    });
  });

  app.get('/api/drills', (_req, res) => {
    res.status(200).json({
      drills: DRILLS,
      playbook: GOLDEN_HOUR_PLAYBOOK,
      presets: XRAY_PRESETS
    });
  });

  app.get('/api/stats', (_req, res) => {
    res.status(200).json(db.getCohortStats());
  });

  app.post('/api/scan', (req, res) => {
    const text =
      typeof req.body?.text === 'string'
        ? req.body.text
        : typeof req.body?.input === 'string'
          ? req.body.input
          : '';

    try {
      const result = analyzeInput(text);
      db.recordForensicScan({
        riskScore: result.riskScore,
        rulesHit: result.findings.map((f) => ({ ruleId: f.ruleId, points: f.points }))
      });
      return res.status(200).json(result);
    } catch (err) {
      if (err && err.status === 400) {
        return res.status(400).json({ error: err.message, code: err.code });
      }
      return res.status(500).json({ error: 'Failed to analyze input' });
    }
  });

  app.post('/api/challenge', (req, res) => {
    const creatorName = (req.body?.creatorName ?? req.body?.creator_name ?? '').toString().trim();
    const targetLabel = (
      req.body?.targetLabel ??
      req.body?.target_label ??
      req.body?.parentLabel ??
      req.body?.parent_label ??
      ''
    )
      .toString()
      .trim();
    const lang = req.body?.lang === 'hi' ? 'hi' : 'en';

    if (!creatorName || creatorName.length > 40) {
      return res.status(400).json({ error: 'creatorName must be between 1 and 40 characters' });
    }
    if (!targetLabel || targetLabel.length > 40) {
      return res.status(400).json({ error: 'targetLabel must be between 1 and 40 characters' });
    }

    const id = generateChallengeSlug(targetLabel, db);
    const created = db.createChallenge({ id, creatorName, targetLabel, lang });
    return res.status(201).json({
      ...created,
      challengeUrl: `/c/${created.id}`,
      reportUrl: `/c/${created.id}/report`
    });
  });

  app.get('/api/challenge/:id', (req, res) => {
    const { id } = req.params;
    if (!CHALLENGE_ID_RE.test(id)) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const data = db.getChallenge(id);
    if (!data) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    return res.status(200).json({
      ...data,
      summary: computeChallengeSummary(data.results)
    });
  });

  app.post('/api/challenge/:id/result', (req, res) => {
    const { id } = req.params;
    if (!CHALLENGE_ID_RE.test(id)) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const scenarioId = (req.body?.scenarioId ?? req.body?.scenario_id ?? '').toString().trim();
    if (!scenarioId || !getDrillById(scenarioId)) {
      return res.status(400).json({ error: 'Invalid scenarioId' });
    }

    const passed = Boolean(req.body?.passed);
    const rawReaction = req.body?.reactionMs ?? req.body?.reaction_ms;
    const parsedReaction =
      rawReaction === undefined || rawReaction === null || rawReaction === ''
        ? 15000
        : Number(rawReaction);
    const reactionMs = Number.isFinite(parsedReaction)
      ? Math.max(0, Math.min(60000, Math.round(parsedReaction)))
      : 15000;

    const rawMissed = req.body?.missedFlag ?? req.body?.missed_flag;
    let missedFlag = null;
    if (typeof rawMissed === 'string') {
      const trimmedMissed = rawMissed.trim();
      if (trimmedMissed.length > 64) {
        return res.status(400).json({ error: 'missedFlag must be 64 characters or fewer' });
      }
      missedFlag = trimmedMissed.length > 0 ? trimmedMissed : null;
    } else if (rawMissed !== undefined && rawMissed !== null) {
      return res.status(400).json({ error: 'missedFlag must be a string or null' });
    }

    const result = db.recordDrillResult({
      challengeId: id,
      scenarioId,
      passed,
      reactionMs,
      missedFlag
    });
    if (!result) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const updated = db.getChallenge(id);
    return res.status(201).json({
      result,
      summary: computeChallengeSummary(updated?.results)
    });
  });

  app.post('/api/badge', async (req, res) => {
    const filename = typeof req.body?.filename === 'string' ? req.body.filename.trim() : '';
    if (!PNG_FILENAME_RE.test(filename)) {
      return res.status(400).json({
        error: 'Invalid filename: must match ^[a-zA-Z0-9_-]{3,48}\\.png$',
        code: 'INVALID_FILENAME'
      });
    }

    const pngBuffer = parsePngDataUrl(req.body?.dataUrl);
    if (!pngBuffer) {
      return res.status(400).json({
        error: 'Invalid PNG payload: expected base64 data:image/png;base64,...',
        code: 'INVALID_PNG'
      });
    }

    try {
      const result = await uploader({ filename, pngBuffer });
      return res.status(200).json({
        uploaded: Boolean(result?.uploaded),
        configured: Boolean(result?.configured),
        url: typeof result?.url === 'string' ? redactStorageToken(result.url) : null,
        message: typeof result?.message === 'string' ? redactStorageToken(result.message) : ''
      });
    } catch (err) {
      if (err && err.status === 400) {
        return res.status(400).json({
          error: redactStorageToken(err.message || 'Invalid PNG payload'),
          code: err.code || 'INVALID_PNG'
        });
      }
      return res.status(502).json({
        error: redactStorageToken(
          err && err.status === 502 && err.message ? err.message : 'Badge storage upload failed'
        ),
        code: (err && err.code) || 'STORAGE_UPSTREAM_ERROR'
      });
    }
  });

  app.get('/tasks/daily-stats', (req, res) => {
    const cronSecret = process.env.CRON_SECRET || '';
    if (cronSecret && req.get('authorization') !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const stats = db.refreshDailyStats();
    return res.status(200).json({ ok: true, stats });
  });

  app.get('/c/:id', serveAppShell);
  app.get('/c/:id/report', serveAppShell);
  app.get('/', serveAppShell);

  app.use((err, _req, res, next) => {
    if (err && err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    if (err && err.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Payload too large' });
    }
    return next(err);
  });

  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  const app = createApp();
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`BaitCheck server listening on 0.0.0.0:${port}`);
  });

  let shuttingDown = false;
  function shutdown() {
    if (shuttingDown) return;
    shuttingDown = true;
    server.close(() => {
      try {
        app.locals.db.close();
      } catch {
        // Ignore close errors on shutdown.
      }
      process.exit(0);
    });
    setTimeout(() => {
      try {
        app.locals.db.close();
      } catch {
        // Ignore close errors on shutdown.
      }
      process.exit(0);
    }, 5000).unref();
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

module.exports = { createApp };
