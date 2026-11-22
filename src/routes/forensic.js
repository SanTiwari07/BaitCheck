'use strict';

const express = require('express');
const { analyzeInput } = require('../forensicEngine');
const { PNG_FILENAME_RE, isPngBuffer } = require('../storage');

const PNG_DATA_URL_PREFIX = 'data:image/png;base64,';
const BASE64_BODY_RE = /^[A-Za-z0-9+/]+={0,2}$/;

/**
 * Validates and decodes a base64 PNG data URL (`data:image/png;base64,...`).
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
 * Creates forensic link/UPI scan and Verdict Ticket badge upload routes.
 * @param {{ db: ReturnType<import('../db').initDb>, uploader: Function }} deps
 * @returns {import('express').Router}
 */
function createForensicRouter({ db, uploader }) {
  const router = express.Router();

  router.post('/api/scan', (req, res) => {
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

  router.post('/api/badge', async (req, res) => {
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

  return router;
}

module.exports = { createForensicRouter };
