'use strict';

const crypto = require('crypto');
const express = require('express');
const { DRILLS, getDrillById } = require('../drills');

const CHALLENGE_ID_RE = /^[a-z0-9-]{2,40}$/;

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
 * @param {ReturnType<import('../db').initDb>} db
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
 * Strictly parses a boolean from true, false, 1, 0, 'true', or 'false'.
 * Returns null for any other value.
 * @param {unknown} value
 * @returns {boolean | null}
 */
function parseStrictBoolean(value) {
  if (value === true || value === 1 || value === 'true') {
    return true;
  }
  if (value === false || value === 0 || value === 'false') {
    return false;
  }
  return null;
}

/**
 * Creates family/friend challenge creation, lookup, and drill result routes.
 * @param {{ db: ReturnType<import('../db').initDb> }} deps
 * @returns {import('express').Router}
 */
function createChallengesRouter({ db }) {
  const router = express.Router();

  router.post('/api/challenge', (req, res) => {
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

  router.get('/api/challenge/:id', (req, res) => {
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

  router.post('/api/challenge/:id/result', (req, res) => {
    const { id } = req.params;
    if (!CHALLENGE_ID_RE.test(id)) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const scenarioId = (req.body?.scenarioId ?? req.body?.scenario_id ?? '').toString().trim();
    if (!scenarioId || !getDrillById(scenarioId)) {
      return res.status(400).json({ error: 'Invalid scenarioId' });
    }

    const passed = parseStrictBoolean(req.body?.passed);
    if (passed === null) {
      return res.status(400).json({ error: 'passed must be a boolean' });
    }
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

  return router;
}

module.exports = { createChallengesRouter };
