'use strict';

const express = require('express');
const { DRILLS, GOLDEN_HOUR_PLAYBOOK, XRAY_PRESETS } = require('../drills');

/**
 * Creates system health, drills catalog, cohort stats, and daily cron routes.
 * @param {{ db: ReturnType<import('../db').initDb> }} deps
 * @returns {import('express').Router}
 */
function createSystemRouter({ db }) {
  const router = express.Router();

  router.get('/health', (_req, res) => {
    res.status(200).json({
      ok: true,
      memoryMb: Number((process.memoryUsage().rss / 1024 / 1024).toFixed(2)),
      uptime: Math.round(process.uptime())
    });
  });

  router.get('/api/drills', (_req, res) => {
    res.status(200).json({
      drills: DRILLS,
      playbook: GOLDEN_HOUR_PLAYBOOK,
      presets: XRAY_PRESETS
    });
  });

  router.get('/api/stats', (_req, res) => {
    res.status(200).json(db.getCohortStats());
  });

  router.get('/tasks/daily-stats', (req, res) => {
    const cronSecret = process.env.CRON_SECRET || '';
    if (cronSecret && req.get('authorization') !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const stats = db.refreshDailyStats();
    return res.status(200).json({ ok: true, stats });
  });

  return router;
}

module.exports = { createSystemRouter };
