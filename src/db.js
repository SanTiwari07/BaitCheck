const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const BASELINE_TOTAL_DRILLS = 142;
const BASELINE_PASS_RATE_PCT = 61.5;
const BASELINE_PASSED_DRILLS = (BASELINE_TOTAL_DRILLS * BASELINE_PASS_RATE_PCT) / 100;
const BASELINE_TOP_MISSED = 'drill-2-apk';
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS family_challenges (
  id TEXT PRIMARY KEY,
  creator_name TEXT NOT NULL,
  target_label TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drill_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  challenge_id TEXT NOT NULL,
  scenario_id TEXT NOT NULL,
  passed INTEGER NOT NULL,
  reaction_ms INTEGER NOT NULL,
  missed_flag TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (challenge_id) REFERENCES family_challenges(id)
);

CREATE TABLE IF NOT EXISTS forensic_scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  risk_score INTEGER NOT NULL,
  rules_hit_json TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_stats (
  stat_date TEXT PRIMARY KEY,
  total_drills INTEGER NOT NULL,
  pass_rate_pct REAL NOT NULL,
  top_missed_scenario TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`;

/**
 * Returns the YYYY-MM-DD calendar date in Asia/Kolkata (IST, UTC+05:30).
 * @param {Date} [date]
 * @returns {string}
 */
function getIstDateString(date = new Date()) {
  return new Date(date.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/**
 * Resolves the SQLite database file path using customPath, DATA_DIR, or ../data/baitcheck.db.
 * @param {string} [customPath]
 * @returns {string}
 */
function resolveDbPath(customPath) {
  if (typeof customPath === 'string' && customPath.trim().length > 0) {
    return customPath.trim();
  }
  const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
  return path.join(dataDir, 'baitcheck.db');
}

/**
 * Ensures the parent directory exists for file-backed SQLite paths.
 * @param {string} dbPath
 */
function ensureParentDir(dbPath) {
  if (dbPath === ':memory:' || dbPath.startsWith('file::memory:')) {
    return;
  }
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

/**
 * Loads node:sqlite DatabaseSync on Node 22.5+/26+, falling back to better-sqlite3 on Node 20.
 * @returns {{ name: string, Constructor: Function }}
 */
function loadSqliteDriver() {
  try {
    const { DatabaseSync } = require('node:sqlite');
    if (typeof DatabaseSync === 'function') {
      return { name: 'node:sqlite', Constructor: DatabaseSync };
    }
  } catch {
    // Fallback below for runtimes without built-in node:sqlite.
  }

  const BetterSqlite3 = require('better-sqlite3');
  return { name: 'better-sqlite3', Constructor: BetterSqlite3 };
}

/**
 * Normalizes SQLite row objects (node:sqlite returns null-prototype objects).
 * @param {Record<string, unknown> | undefined} row
 * @returns {Record<string, unknown> | undefined}
 */
function toPlainRow(row) {
  return row ? { ...row } : undefined;
}

/**
 * Opens a unified synchronous SQLite wrapper compatible across node:sqlite and better-sqlite3.
 * @param {string} dbPath
 */
function openConnection(dbPath) {
  const { name, Constructor } = loadSqliteDriver();
  const rawDb = new Constructor(dbPath);
  let closed = false;

  return {
    driver: name,
    exec(sql) {
      rawDb.exec(sql);
    },
    prepare(sql) {
      const stmt = rawDb.prepare(sql);
      return {
        get(...params) {
          return toPlainRow(stmt.get(...params));
        },
        all(...params) {
          return stmt.all(...params).map((row) => ({ ...row }));
        },
        run(...params) {
          const result = stmt.run(...params);
          return {
            changes: Number(result.changes ?? 0),
            lastInsertRowid: Number(result.lastInsertRowid ?? 0)
          };
        }
      };
    },
    close() {
      if (!closed) {
        closed = true;
        rawDb.close();
      }
    }
  };
}

/**
 * Initializes the BaitCheck SQLite database, applies idempotent schema, seeds daily_stats,
 * and returns persistence methods that preserve Embarko Litestream tables.
 * @param {string} [customPath]
 */
function initDb(customPath) {
  const dbPath = resolveDbPath(customPath);
  ensureParentDir(dbPath);

  const conn = openConnection(dbPath);

  // Best effort WAL mode; :memory: databases reject WAL journal mode.
  try {
    conn.exec('PRAGMA journal_mode = WAL;');
  } catch {
    // Ignore when WAL is unsupported (e.g., in-memory DB).
  }
  conn.exec('PRAGMA foreign_keys = ON;');
  conn.exec(SCHEMA_SQL);

  const statsCountRow = conn.prepare('SELECT COUNT(*) AS cnt FROM daily_stats').get();
  if (Number(statsCountRow?.cnt || 0) === 0) {
    conn
      .prepare(
        `INSERT INTO daily_stats (stat_date, total_drills, pass_rate_pct, top_missed_scenario)
         VALUES (?, ?, ?, ?)`
      )
      .run(getIstDateString(), BASELINE_TOTAL_DRILLS, BASELINE_PASS_RATE_PCT, BASELINE_TOP_MISSED);
  }

  function computeCohortAggregate() {
    const todayIst = getIstDateString();
    const latestDaily = conn
      .prepare(
        `SELECT stat_date, total_drills, pass_rate_pct, top_missed_scenario, updated_at
         FROM daily_stats
         ORDER BY stat_date DESC
         LIMIT 1`
      )
      .get();

    const liveAgg = conn
      .prepare(
        `SELECT COUNT(*) AS total,
                COALESCE(SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END), 0) AS passed
         FROM drill_results`
      )
      .get();

    const topMissedLive = conn
      .prepare(
        `SELECT scenario_id, COUNT(*) AS misses
         FROM drill_results
         WHERE passed = 0
         GROUP BY scenario_id
         ORDER BY misses DESC, scenario_id ASC
         LIMIT 1`
      )
      .get();

    const scanAgg = conn.prepare('SELECT COUNT(*) AS total_scans FROM forensic_scans').get();

    const liveTotal = Number(liveAgg?.total || 0);
    const livePassed = Number(liveAgg?.passed || 0);
    const totalScans = Number(scanAgg?.total_scans || 0);

    if (liveTotal === 0) {
      return {
        totalDrills: Number(latestDaily?.total_drills ?? BASELINE_TOTAL_DRILLS),
        passRatePct: Number(latestDaily?.pass_rate_pct ?? BASELINE_PASS_RATE_PCT),
        topMissedScenario: latestDaily?.top_missed_scenario || BASELINE_TOP_MISSED,
        totalScans,
        statDate: latestDaily?.stat_date || todayIst,
        updatedAt: latestDaily?.updated_at || null
      };
    }

    const totalDrills = BASELINE_TOTAL_DRILLS + liveTotal;
    const passRatePct = Number((((BASELINE_PASSED_DRILLS + livePassed) / totalDrills) * 100).toFixed(1));
    const hasSignificantLiveMisses = liveTotal >= 5 || Number(topMissedLive?.misses || 0) >= 3;
    const topMissedScenario =
      hasSignificantLiveMisses && topMissedLive?.scenario_id
        ? topMissedLive.scenario_id
        : latestDaily?.top_missed_scenario || BASELINE_TOP_MISSED;

    return {
      totalDrills,
      passRatePct,
      topMissedScenario,
      totalScans,
      statDate: latestDaily?.stat_date || todayIst,
      updatedAt: latestDaily?.updated_at || null
    };
  }

  function createChallenge({ id, creatorName, targetLabel, parentLabel, lang }) {
    const slug =
      typeof id === 'string' && id.trim().length > 0
        ? id.trim()
        : crypto.randomBytes(4).toString('hex');
    const safeCreator = String(creatorName || '').trim();
    const safeTarget = String(targetLabel ?? parentLabel ?? '').trim();
    const safeLang = typeof lang === 'string' && lang.trim().length > 0 ? lang.trim() : 'en';

    if (!safeCreator || !safeTarget) {
      throw new Error('creatorName and targetLabel are required');
    }

    conn
      .prepare(
        `INSERT INTO family_challenges (id, creator_name, target_label, lang)
         VALUES (?, ?, ?, ?)`
      )
      .run(slug, safeCreator, safeTarget, safeLang);

    const row = conn
      .prepare(
        `SELECT id, creator_name, target_label, lang, created_at
         FROM family_challenges
         WHERE id = ?`
      )
      .get(slug);

    return {
      ...row,
      parent_label: row.target_label
    };
  }

  function getChallenge(id) {
    if (typeof id !== 'string' || id.trim().length === 0) {
      return null;
    }
    const challengeRow = conn
      .prepare(
        `SELECT id, creator_name, target_label, lang, created_at
         FROM family_challenges
         WHERE id = ?`
      )
      .get(id.trim());

    if (!challengeRow) {
      return null;
    }

    const results = conn
      .prepare(
        `SELECT id, challenge_id, scenario_id, passed, reaction_ms, missed_flag, created_at
         FROM drill_results
         WHERE challenge_id = ?
         ORDER BY id ASC`
      )
      .all(challengeRow.id);

    return {
      challenge: {
        ...challengeRow,
        parent_label: challengeRow.target_label
      },
      results
    };
  }

  function recordDrillResult({ challengeId, scenarioId, passed, reactionMs, missedFlag }) {
    if (typeof challengeId !== 'string' || challengeId.trim().length === 0) {
      return null;
    }
    const cleanChallengeId = challengeId.trim();
    const existing = conn
      .prepare('SELECT id FROM family_challenges WHERE id = ?')
      .get(cleanChallengeId);
    if (!existing) {
      return null;
    }

    const safeScenarioId = String(scenarioId || '').trim();
    if (!safeScenarioId) {
      throw new Error('scenarioId is required');
    }

    const passedInt = passed ? 1 : 0;
    const safeReactionMs = Math.max(0, Math.round(Number(reactionMs) || 0));
    const safeMissedFlag = missedFlag == null ? null : String(missedFlag);

    const info = conn
      .prepare(
        `INSERT INTO drill_results (challenge_id, scenario_id, passed, reaction_ms, missed_flag)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(cleanChallengeId, safeScenarioId, passedInt, safeReactionMs, safeMissedFlag);

    return conn
      .prepare(
        `SELECT id, challenge_id, scenario_id, passed, reaction_ms, missed_flag, created_at
         FROM drill_results
         WHERE id = ?`
      )
      .get(info.lastInsertRowid);
  }

  function recordForensicScan({ riskScore, rulesHit }) {
    // Store zero PII: only numeric risk_score and rule IDs/summaries JSON.
    const safeScore = Math.max(0, Math.min(100, Math.round(Number(riskScore) || 0)));
    const safeRulesJson = JSON.stringify(Array.isArray(rulesHit) ? rulesHit : []);

    const info = conn
      .prepare(
        `INSERT INTO forensic_scans (risk_score, rules_hit_json)
         VALUES (?, ?)`
      )
      .run(safeScore, safeRulesJson);

    return conn
      .prepare(
        `SELECT id, risk_score, rules_hit_json, created_at
         FROM forensic_scans
         WHERE id = ?`
      )
      .get(info.lastInsertRowid);
  }

  function getCohortStats() {
    return computeCohortAggregate();
  }

  function refreshDailyStats() {
    const todayIst = getIstDateString();
    const agg = computeCohortAggregate();

    conn
      .prepare(
        `INSERT INTO daily_stats (stat_date, total_drills, pass_rate_pct, top_missed_scenario, updated_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(stat_date) DO UPDATE SET
           total_drills = excluded.total_drills,
           pass_rate_pct = excluded.pass_rate_pct,
           top_missed_scenario = excluded.top_missed_scenario,
           updated_at = CURRENT_TIMESTAMP`
      )
      .run(todayIst, agg.totalDrills, agg.passRatePct, agg.topMissedScenario);

    return conn
      .prepare(
        `SELECT stat_date, total_drills, pass_rate_pct, top_missed_scenario, updated_at
         FROM daily_stats
         WHERE stat_date = ?`
      )
      .get(todayIst);
  }

  return {
    dbPath,
    close: () => conn.close(),
    createChallenge,
    getChallenge,
    recordDrillResult,
    recordForensicScan,
    getCohortStats,
    refreshDailyStats
  };
}

module.exports = {
  initDb,
  resolveDbPath,
  getIstDateString
};
