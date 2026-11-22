'use strict';

const PNG_FILENAME_RE = /^[a-zA-Z0-9_-]{3,48}\.png$/;
const MAX_PNG_BYTES = 2 * 1024 * 1024;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const UPLOAD_TIMEOUT_MS = 8000;

/**
 * Creates an Error annotated with an HTTP status and machine-readable code.
 * @param {number} status
 * @param {string} message
 * @param {string} code
 * @returns {Error & { status: number, code: string }}
 */
function createHttpError(status, message, code) {
  const err = new Error(message);
  err.status = status;
  err.code = code;
  return err;
}

/**
 * Checks that the provided value is a Buffer/Uint8Array starting with PNG magic bytes
 * and within the maximum allowed byte size.
 * @param {unknown} value
 * @returns {boolean}
 */
function isPngBuffer(value) {
  if (!Buffer.isBuffer(value) && !(value instanceof Uint8Array)) {
    return false;
  }
  const buf = Buffer.isBuffer(value)
    ? value
    : Buffer.from(value.buffer, value.byteOffset, value.byteLength);
  if (buf.length < PNG_MAGIC.length || buf.length > MAX_PNG_BYTES) {
    return false;
  }
  return buf.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC);
}

/**
 * Uploads a generated Verdict Ticket PNG to Embarko object storage when configured.
 * Returns { uploaded: false, configured: false, message } when STORAGE_URL / STORAGE_TOKEN are absent.
 *
 * @param {{ filename: string, pngBuffer: Buffer | Uint8Array }} params
 * @returns {Promise<{ uploaded: boolean, configured: boolean, url?: string, message: string }>}
 */
async function uploadVerdictBadge(params = {}) {
  const { filename, pngBuffer } = params;

  if (typeof filename !== 'string' || !PNG_FILENAME_RE.test(filename)) {
    throw createHttpError(
      400,
      'Invalid filename: must match ^[a-zA-Z0-9_-]{3,48}\\.png$',
      'INVALID_FILENAME'
    );
  }

  if (!Buffer.isBuffer(pngBuffer) && !(pngBuffer instanceof Uint8Array)) {
    throw createHttpError(400, 'Invalid pngBuffer: expected binary Buffer', 'INVALID_PNG');
  }

  const buf = Buffer.isBuffer(pngBuffer)
    ? pngBuffer
    : Buffer.from(pngBuffer.buffer, pngBuffer.byteOffset, pngBuffer.byteLength);

  if (buf.length > MAX_PNG_BYTES) {
    throw createHttpError(400, 'PNG exceeds 2 MB maximum size', 'PNG_TOO_LARGE');
  }

  if (buf.length < PNG_MAGIC.length || !buf.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
    throw createHttpError(400, 'Invalid PNG magic bytes', 'INVALID_PNG');
  }

  const storageUrl =
    typeof process.env.STORAGE_URL === 'string' ? process.env.STORAGE_URL.trim() : '';
  const storageToken =
    typeof process.env.STORAGE_TOKEN === 'string' ? process.env.STORAGE_TOKEN.trim() : '';
  const appName =
    (typeof process.env.APP_NAME === 'string' ? process.env.APP_NAME.trim() : '') || 'baitcheck';

  if (!storageUrl || !storageToken) {
    return {
      uploaded: false,
      configured: false,
      message: 'STORAGE_URL not configured; local PNG download remains active.'
    };
  }

  const targetUrl = `${storageUrl.replace(/\/+$/, '')}/apps/${encodeURIComponent(appName)}/files/${encodeURIComponent(filename)}`;

  let response;
  try {
    response = await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${storageToken}`,
        'Content-Type': 'image/png'
      },
      body: buf,
      signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS)
    });
  } catch (err) {
    const isTimeout = err && (err.name === 'TimeoutError' || err.name === 'AbortError');
    throw createHttpError(
      502,
      isTimeout ? 'Badge storage upload timed out' : 'Badge storage upstream request failed',
      'STORAGE_UPSTREAM_ERROR'
    );
  }

  if (!response || !response.ok) {
    try {
      await response?.body?.cancel?.();
    } catch {
      // Ignore stream cancellation failures.
    }
    const statusCode = response && typeof response.status === 'number' ? response.status : 'unknown';
    throw createHttpError(
      502,
      `Badge storage upstream rejected upload (HTTP ${statusCode})`,
      'STORAGE_UPSTREAM_REJECTED'
    );
  }

  let resolvedUrl = targetUrl;
  try {
    const contentType =
      typeof response.headers?.get === 'function' ? response.headers.get('content-type') || '' : '';
    if (contentType.toLowerCase().includes('application/json')) {
      const payload = await response.json();
      if (payload && typeof payload.url === 'string' && /^https?:\/\//i.test(payload.url)) {
        resolvedUrl = payload.url;
      }
    } else {
      await response.body?.cancel?.();
    }
  } catch {
    // Ignore optional JSON response parsing failures after a 2xx upload.
  }

  return {
    uploaded: true,
    configured: true,
    url: resolvedUrl,
    message: 'Verdict badge uploaded.'
  };
}

module.exports = {
  PNG_FILENAME_RE,
  MAX_PNG_BYTES,
  PNG_MAGIC,
  isPngBuffer,
  uploadVerdictBadge
};
