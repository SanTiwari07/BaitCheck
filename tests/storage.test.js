'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  PNG_MAGIC,
  isPngBuffer,
  uploadVerdictBadge
} = require('../src/storage');

function buildSamplePng(size = 128) {
  const buf = Buffer.alloc(Math.max(size, 16), 0x41);
  PNG_MAGIC.copy(buf, 0);
  return buf;
}

test('storage.isPngBuffer validates PNG magic header strictly', () => {
  assert.equal(isPngBuffer(buildSamplePng()), true);
  assert.equal(isPngBuffer(Buffer.from('GIF89a123456')), false);
  assert.equal(isPngBuffer(Buffer.alloc(4)), false);
  assert.equal(isPngBuffer(null), false);
});

test('uploadVerdictBadge returns unconfigured fallback when STORAGE_URL or STORAGE_TOKEN is missing', async () => {
  const prevUrl = process.env.STORAGE_URL;
  const prevTok = process.env.STORAGE_TOKEN;
  delete process.env.STORAGE_URL;
  delete process.env.STORAGE_TOKEN;

  try {
    const res = await uploadVerdictBadge({
      filename: 'verdict-ticket.png',
      pngBuffer: buildSamplePng()
    });
    assert.equal(res.uploaded, false);
    assert.equal(res.configured, false);
    assert.match(res.message, /STORAGE_URL not configured/i);
  } finally {
    if (prevUrl !== undefined) process.env.STORAGE_URL = prevUrl;
    if (prevTok !== undefined) process.env.STORAGE_TOKEN = prevTok;
  }
});

test('uploadVerdictBadge rejects invalid filenames and oversized/non-PNG buffers', async () => {
  await assert.rejects(
    () => uploadVerdictBadge({ filename: '../evil.png', pngBuffer: buildSamplePng() }),
    (err) => err.status === 400
  );
  await assert.rejects(
    () => uploadVerdictBadge({ filename: 'valid-name.png', pngBuffer: Buffer.from('not-a-png') }),
    (err) => err.status === 400
  );
  await assert.rejects(
    () => uploadVerdictBadge({ filename: 'valid-name.png', pngBuffer: buildSamplePng(2 * 1024 * 1024 + 10) }),
    (err) => err.status === 400
  );
});

test('uploadVerdictBadge performs authenticated PUT and avoids leaking STORAGE_TOKEN on failure', async () => {
  const prevUrl = process.env.STORAGE_URL;
  const prevTok = process.env.STORAGE_TOKEN;
  const prevApp = process.env.APP_NAME;
  const origFetch = global.fetch;

  process.env.STORAGE_URL = 'https://storage.example.test/';
  process.env.STORAGE_TOKEN = 'secret_tok_98765';
  process.env.APP_NAME = 'baitcheck';

  try {
    global.fetch = async (url, init) => {
      assert.equal(url, 'https://storage.example.test/apps/baitcheck/files/badge-ok.png');
      assert.equal(init.method, 'PUT');
      assert.equal(init.headers.Authorization, 'Bearer secret_tok_98765');
      assert.equal(init.headers['Content-Type'], 'image/png');
      return new Response(JSON.stringify({ url: 'https://cdn.example.test/badge-ok.png' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    const ok = await uploadVerdictBadge({
      filename: 'badge-ok.png',
      pngBuffer: buildSamplePng()
    });
    assert.equal(ok.uploaded, true);
    assert.equal(ok.configured, true);
    assert.equal(ok.url, 'https://cdn.example.test/badge-ok.png');

    global.fetch = async () => new Response('upstream error secret_tok_98765', { status: 503 });
    await assert.rejects(
      () => uploadVerdictBadge({ filename: 'badge-fail.png', pngBuffer: buildSamplePng() }),
      (err) => err.status === 502 && !err.message.includes('secret_tok_98765')
    );
  } finally {
    global.fetch = origFetch;
    if (prevUrl === undefined) delete process.env.STORAGE_URL; else process.env.STORAGE_URL = prevUrl;
    if (prevTok === undefined) delete process.env.STORAGE_TOKEN; else process.env.STORAGE_TOKEN = prevTok;
    if (prevApp === undefined) delete process.env.APP_NAME; else process.env.APP_NAME = prevApp;
  }
});
