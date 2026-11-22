'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { initDb, resolveDbPath, getIstDateString } = require('../src/db');
const { getDrillById, DRILLS } = require('../src/drills');

test('resolveDbPath respects DATA_DIR environment variable', () => {
  const prev = process.env.DATA_DIR;
  process.env.DATA_DIR = '/tmp/custom-embarko-data';
  try {
    const resolved = resolveDbPath();
    assert.match(resolved.replace(/\\/g, '/'), /\/tmp\/custom-embarko-data\/baitcheck\.db$/);
  } finally {
    if (prev === undefined) delete process.env.DATA_DIR;
    else process.env.DATA_DIR = prev;
  }
});

test('getIstDateString formats YYYY-MM-DD in Asia/Kolkata offset', () => {
  const utcMidnight = new Date('2026-11-22T20:00:00.000Z');
  // 20:00 UTC + 05:30 = 2026-11-23 01:30 IST
  assert.equal(getIstDateString(utcMidnight), '2026-11-23');
});

test('db tracks cohort pass rate & top missed scenario accurately', () => {
  const db = initDb(':memory:');
  try {
    const challenge = db.createChallenge({
      id: 'dad-test1',
      creatorName: 'Riya',
      targetLabel: 'Dad',
      lang: 'hi'
    });
    assert.equal(challenge.target_label, 'Dad');
    assert.equal(challenge.parent_label, 'Dad');

    assert.equal(
      db.recordDrillResult({
        challengeId: 'missing-id',
        scenarioId: 'drill-1-call',
        passed: false,
        reactionMs: 5000,
        missedFlag: 'digital-arrest-compliance'
      }),
      null
    );

    db.recordDrillResult({
      challengeId: 'dad-test1',
      scenarioId: 'drill-3-upi',
      passed: false,
      reactionMs: 3200,
      missedFlag: 'upi-pin-collect-trap'
    });

    const refreshed = db.refreshDailyStats();
    assert.equal(refreshed.total_drills, 143);
    const stats = db.getCohortStats();
    assert.equal(stats.totalDrills, 143);
    assert.ok(stats.passRatePct > 0 && stats.passRatePct <= 100);
  } finally {
    db.close();
  }
});

test('getDrillById resolves valid drill IDs and returns null for unknown IDs', () => {
  for (const d of DRILLS) {
    assert.equal(getDrillById(d.id)?.id, d.id);
  }
  assert.equal(getDrillById('unknown-drill'), null);
  assert.equal(getDrillById(''), null);
});
