'use strict';

const MAX_INPUT_LENGTH = 2000;

const SHORTENER_HOSTS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'rb.gy',
  'cutt.ly',
  'is.gd',
  'goo.gl'
]);

const HIGH_RISK_TLDS = new Set([
  'xyz', 'top', 'click', 'tk', 'shop', 'buzz', 'cfd', 'rest'
]);

const SUSPICIOUS_URL_KEYWORDS = [
  'kyc', 'verify', 'login', 'refund', 'bank',
  'parcel', 'bill', 'update', 'claim', 'pay'
];

const DOUBLE_EXT_DOC = new Set(['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx']);
const EXECUTABLE_EXT = new Set(['apk', 'exe', 'bat', 'scr', 'msi']);

const APK_LURE_KEYWORDS = [
  'install', 'download', 'pay', 'fee', 'bill', 'electricity', 'power',
  'cutoff', 'disconnect', 'disconnection', 'delivery', 'parcel', 'mod',
  'free', 'reward', 'update', 'verify', 'verification', 'urgent', 'clear',
  'इंस्टॉल', 'डाउनलोड', 'शुल्क', 'बिजली', 'बिल', 'तुरंत'
];

const SHORTENER_URGENCY_KEYWORDS = [
  'urgent', 'immediately', 'now', 'tonight', 'today', 'verify', 'verification',
  'click', 'claim', 'suspend', 'suspended', 'blocked', 'expire', 'expired',
  'kyc', 'pay', 'update', 'disconnect', 'disconnection', 'arrest', 'warrant',
  'तुरंत', 'अभी', 'जरूरी', 'वेरिफिकेशन', 'बिजली', 'गिरफ्तारी'
];

const UPI_RECEIVE_MISMATCH_KEYWORDS = [
  'receive', 'cashback', 'prize', 'refund', 'claim', 'reward', 'won', 'win',
  'credit', 'pin', 'कैशबैक', 'पिन', 'रिफंड', 'इनाम', 'पाने'
];

const PRESSURE_RULES = [
  { id: 'digital arrest', label: 'digital arrest', regex: /\bdigital\s+arrest\b/gi },
  { id: 'arrest warrant', label: 'arrest warrant', regex: /\barrest\s+warrant\b/gi },
  { id: 'warrant', label: 'warrant', regex: /\bwarrant\b/gi },
  { id: 'seized parcel', label: 'seized parcel', regex: /\bseized\s+parcel\b/gi },
  { id: 'stay on call', label: 'stay on call', regex: /\bstay\s+(?:alone\s+)?on\s+(?:this\s+)?(?:video\s+)?call\b/gi },
  { id: 'stay alone', label: 'stay alone', regex: /\bstay\s+alone\b/gi },
  { id: 'do not tell', label: 'do not tell', regex: /\b(?:do\s+not|don't)\s+tell\b/gi },
  { id: 'kyc suspended', label: 'kyc suspended', regex: /\bkyc\s+(?:suspended|expired|blocked|pending)\b/gi },
  { id: 'update kyc', label: 'update kyc', regex: /\b(?:update|complete)\s+kyc\b/gi },
  { id: 'account blocked', label: 'account blocked', regex: /\b(?:account|sim|card)\s+(?:blocked|suspended|frozen|deactivated)\b/gi },
  { id: 'disconnection tonight', label: 'disconnection tonight', regex: /\b(?:power\s+)?disconnection\s+tonight\b/gi },
  { id: 'electricity cut', label: 'electricity cut', regex: /\b(?:electricity|power)\s+cut\b/gi },
  { id: 'enter pin to receive', label: 'enter pin to receive', regex: /\b(?:enter|approve)(?:\s+your)?\s+pin\s+to\s+receive\b/gi },
  { id: 'security deposit', label: 'security deposit', regex: /\b(?:refundable\s+)?security\s+deposit\b/gi },
  { id: 'digital verification', label: 'digital verification', regex: /\bdigital\s+verification\b/gi },
  { id: 'verification fee', label: 'verification fee', regex: /\bverification\s+fee\b/gi },
  { id: 'urgent', label: 'urgent', regex: /\burgent(?:ly)?\b/gi },
  { id: 'immediately', label: 'immediately', regex: /\bimmediately\b/gi },
  { id: 'cashback refund', label: 'cashback refund', regex: /\bcashback\s+refund\b/gi },
  { id: 'claim', label: 'claim', regex: /\bclaim\b/gi },
  // Hindi (Devanagari) pressure phrases - matched explicitly via indexOf (ReDoS-free)
  { id: 'hi-bijli-cut', literal: 'बिजली कट' },
  { id: 'hi-giraftari', literal: 'गिरफ्तारी' },
  { id: 'hi-akele-rahen', literal: 'अकेले रहें' },
  { id: 'hi-verification', literal: 'वेरिफिकेशन' },
  { id: 'hi-pin-dalen', literal: 'पिन डालें' },
  { id: 'hi-cashback', literal: 'कैशबैक' },
  { id: 'hi-zabt-parcel', literal: 'ज़ब्त पार्सल' },
  { id: 'hi-turant', literal: 'तुरंत' },
  { id: 'hi-jaroori-soochana', literal: 'जरूरी सूचना' }
];

const CYRILLIC_CHAR_RE = /[\u0400-\u04FF]/;
const GREEK_CHAR_RE = /[\u0370-\u03FF]/;
const LATIN_CHAR_RE = /[A-Za-z]/;

/**
 * Creates a structured 400 validation error.
 * @param {string} message
 * @param {'EMPTY_INPUT' | 'INPUT_TOO_LONG'} code
 * @returns {Error & { code: string, status: number }}
 */
function createValidationError(message, code) {
  const err = new Error(message);
  err.code = code;
  err.status = 400;
  return err;
}

/**
 * Checks if a dot-separated IPv4 string has 4 valid octets (0-255).
 * @param {string} host
 * @returns {boolean}
 */
function isValidIpv4Host(host) {
  const parts = host.split('.');
  if (parts.length !== 4) return false;
  for (let i = 0; i < 4; i++) {
    const p = parts[i];
    if (!/^\d{1,3}$/.test(p)) return false;
    const n = Number(p);
    if (n < 0 || n > 255) return false;
  }
  return true;
}

/**
 * Extracts the TLD (final dot-separated label) from a domain host, or null if invalid/IPv4.
 * @param {string} host
 * @returns {string | null}
 */
function extractDomainTld(host) {
  if (!host || isValidIpv4Host(host)) return null;
  const labels = host.toLowerCase().split('.');
  if (labels.length < 2) return null;
  for (let i = 0; i < labels.length; i++) {
    if (!labels[i]) return null;
  }
  return labels[labels.length - 1];
}

/**
 * Checks whether a token or domain mixes Latin with Cyrillic or Greek characters.
 * Devanagari (\u0900-\u097F) is intentionally excluded so Hindi text never false-positives.
 * @param {string} token
 * @returns {boolean}
 */
function hasMixedHomoglyphScript(token) {
  const hasLatin = LATIN_CHAR_RE.test(token);
  if (!hasLatin) return false;
  return CYRILLIC_CHAR_RE.test(token) || GREEK_CHAR_RE.test(token);
}

/**
 * Tokenizes non-whitespace chunks with exact character offsets in O(n).
 * @param {string} text
 * @returns {Array<{ raw: string, start: number, end: number }>}
 */
function scanWhitespaceTokens(text) {
  const tokens = [];
  let i = 0;
  const len = text.length;
  while (i < len) {
    while (i < len && /\s/.test(text[i])) i++;
    if (i >= len) break;
    const start = i;
    while (i < len && !/\s/.test(text[i])) i++;
    tokens.push({ raw: text.slice(start, i), start, end: i });
  }
  return tokens;
}

/**
 * Strips leading/trailing sentence punctuation from a token while adjusting offsets.
 * @param {{ raw: string, start: number, end: number }} tok
 * @returns {{ value: string, start: number, end: number }}
 */
function trimTokenPunctuation(tok) {
  let s = tok.start;
  let e = tok.end;
  let v = tok.raw;
  const leadRe = /^[("'\[<{«]+/;
  const trailRe = /[)"'\]>}».,;!?]+$/;
  const lm = leadRe.exec(v);
  if (lm) {
    s += lm[0].length;
    v = v.slice(lm[0].length);
  }
  const tm = trailRe.exec(v);
  if (tm) {
    e -= tm[0].length;
    v = v.slice(0, v.length - tm[0].length);
  }
  return { value: v, start: s, end: e };
}

/**
 * Extracts host candidate and its exact character span from an HTTP/HTTPS URL token.
 * @param {string} token
 * @param {number} baseStart
 * @returns {{ scheme: string, authority: string, authStart: number, authEnd: number, hasUserinfo: boolean, host: string, hostStart: number, hostEnd: number } | null}
 */
function parseHttpUrlToken(token, baseStart) {
  const lower = token.toLowerCase();
  let schemeLen = 0;
  if (lower.startsWith('https://')) schemeLen = 8;
  else if (lower.startsWith('http://')) schemeLen = 7;
  else if (lower.startsWith('hxxps://')) schemeLen = 8;
  else if (lower.startsWith('hxxp://')) schemeLen = 7;
  else return null;

  const afterScheme = token.slice(schemeLen);
  let authEndRel = afterScheme.length;
  for (let i = 0; i < afterScheme.length; i++) {
    const ch = afterScheme[i];
    if (ch === '/' || ch === '?' || ch === '#') {
      authEndRel = i;
      break;
    }
  }
  const authority = afterScheme.slice(0, authEndRel);
  if (!authority) return null;

  const authStart = baseStart + schemeLen;
  const authEnd = authStart + authority.length;
  const atIdx = authority.lastIndexOf('@');
  const hasUserinfo = atIdx > 0;
  const hostPort = atIdx >= 0 ? authority.slice(atIdx + 1) : authority;
  const hostPortStart = atIdx >= 0 ? authStart + atIdx + 1 : authStart;

  const colonIdx = hostPort.lastIndexOf(':');
  const host = colonIdx > 0 && /^\d+$/.test(hostPort.slice(colonIdx + 1))
    ? hostPort.slice(0, colonIdx)
    : hostPort;

  return {
    scheme: lower.slice(0, schemeLen),
    authority,
    authStart,
    authEnd,
    hasUserinfo,
    host,
    hostStart: hostPortStart,
    hostEnd: hostPortStart + host.length
  };
}

/**
 * Parses upi://pay?... parameters safely using URL / URLSearchParams.
 * @param {string} upiUri
 * @returns {{ pa: string|null, pn: string|null, am: string|null, cu: string|null, tn: string|null, mode: string|null, tr: string|null }}
 */
function parseUpiParams(upiUri) {
  let params = null;
  try {
    const parsed = new URL(upiUri);
    params = parsed.searchParams;
  } catch {
    const qIdx = upiUri.indexOf('?');
    params = new URLSearchParams(qIdx >= 0 ? upiUri.slice(qIdx + 1) : '');
  }
  const getVal = (key) => {
    const v = params.get(key);
    return v !== null && v.trim() !== '' ? v.trim() : null;
  };
  return {
    pa: getVal('pa'),
    pn: getVal('pn'),
    am: getVal('am'),
    cu: getVal('cu'),
    tn: getVal('tn'),
    mode: getVal('mode'),
    tr: getVal('tr')
  };
}

/**
 * Checks whether any keyword from list appears in lowerText.
 * @param {string} lowerText
 * @param {string[]} keywords
 * @returns {boolean}
 */
function containsAnyKeyword(lowerText, keywords) {
  for (let i = 0; i < keywords.length; i++) {
    if (lowerText.includes(keywords[i])) return true;
  }
  return false;
}

/**
 * Builds non-overlapping, lossless highlighted segments covering the full input text.
 * @param {string} text
 * @param {Array<{ start: number, end: number, severity: 'danger' | 'warn', ruleId: string }>} spans
 * @returns {Array<{ text: string, highlight: 'danger' | 'warn' | null, ruleId?: string }>}
 */
function buildHighlightedSegments(text, spans) {
  const n = text.length;
  if (n === 0) return [];

  const sev = new Array(n).fill(null);
  const rids = new Array(n).fill(null);

  for (let i = 0; i < spans.length; i++) {
    const sp = spans[i];
    const start = Math.max(0, sp.start);
    const end = Math.min(n, sp.end);
    for (let j = start; j < end; j++) {
      if (sev[j] === 'danger') continue;
      if (sev[j] === 'warn' && sp.severity !== 'danger') continue;
      sev[j] = sp.severity;
      rids[j] = sp.ruleId;
    }
  }

  const segments = [];
  let segStart = 0;
  for (let i = 1; i <= n; i++) {
    const same = i < n && sev[i] === sev[segStart] && rids[i] === rids[segStart];
    if (!same) {
      const seg = {
        text: text.slice(segStart, i),
        highlight: sev[segStart]
      };
      if (rids[segStart]) {
        seg.ruleId = rids[segStart];
      }
      segments.push(seg);
      segStart = i;
    }
  }

  return segments;
}

/**
 * Deterministically analyzes suspicious SMS, chat forwards, URLs, or UPI links.
 * Executes locally in <10 ms with zero external API calls.
 * @param {string} text
 */
function analyzeInput(text) {
  const startNs = process.hrtime.bigint();

  if (typeof text !== 'string') {
    throw createValidationError('Input must be a string.', 'EMPTY_INPUT');
  }
  if (text.length > MAX_INPUT_LENGTH) {
    throw createValidationError(
      `Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters.`,
      'INPUT_TOO_LONG'
    );
  }
  if (text.trim().length === 0) {
    throw createValidationError('Input text cannot be empty.', 'EMPTY_INPUT');
  }

  const lowerText = text.toLowerCase();
  const tokens = scanWhitespaceTokens(text);
  const findings = [];
  const highlightSpans = [];

  // ---------------------------------------------------------------------------
  // Rule 1: Punycode & IDN Homoglyph Check (+35 risk)
  // ---------------------------------------------------------------------------
  const rule1Tokens = new Set();
  for (let i = 0; i < tokens.length; i++) {
    const trimmed = trimTokenPunctuation(tokens[i]);
    if (!trimmed.value) continue;

    const httpParsed = parseHttpUrlToken(trimmed.value, trimmed.start);
    let hostCandidate = null;
    let hostStart = trimmed.start;
    let hostEnd = trimmed.end;

    if (httpParsed) {
      hostCandidate = httpParsed.host;
      hostStart = httpParsed.hostStart;
      hostEnd = httpParsed.hostEnd;
    } else if (!trimmed.value.toLowerCase().startsWith('upi://') && trimmed.value.includes('.')) {
      // Standalone domain-like token (strip optional path/query after '/')
      const slashIdx = trimmed.value.indexOf('/');
      const rawHost = slashIdx >= 0 ? trimmed.value.slice(0, slashIdx) : trimmed.value;
      const atIdx = rawHost.lastIndexOf('@');
      const cleanHost = atIdx >= 0 ? rawHost.slice(atIdx + 1) : rawHost;
      if (cleanHost.includes('.') && !/^\d+(?:\.\d+)+$/.test(cleanHost)) {
        hostCandidate = cleanHost;
        hostStart = atIdx >= 0 ? trimmed.start + atIdx + 1 : trimmed.start;
        hostEnd = hostStart + cleanHost.length;
      }
    }

    let flagged = false;
    if (hostCandidate) {
      const labels = hostCandidate.split('.');
      const hasPunycode = labels.some((lbl) => lbl.toLowerCase().startsWith('xn--'));
      const hasLabelMixed = labels.some((lbl) => hasMixedHomoglyphScript(lbl));
      const hasHostMixed = hasMixedHomoglyphScript(hostCandidate);

      if (hasPunycode || hasLabelMixed || hasHostMixed) {
        flagged = true;
        rule1Tokens.add(hostCandidate);
        highlightSpans.push({
          start: hostStart,
          end: hostEnd,
          severity: 'danger',
          ruleId: 'punycode_homoglyph'
        });
      }
    }

    // Also catch mixed-script homoglyph spoofing in non-domain brand/label tokens
    if (!flagged && !trimmed.value.toLowerCase().startsWith('upi://') && hasMixedHomoglyphScript(trimmed.value)) {
      rule1Tokens.add(trimmed.value);
      highlightSpans.push({
        start: trimmed.start,
        end: trimmed.end,
        severity: 'danger',
        ruleId: 'punycode_homoglyph'
      });
    }
  }

  if (rule1Tokens.size > 0) {
    findings.push({
      ruleId: 'punycode_homoglyph',
      severity: 'danger',
      points: 35,
      title: 'Punycode / Lookalike Homoglyph Domain',
      detail: 'Detected an internationalized Punycode (xn--) domain or mixed Cyrillic/Greek lookalike characters used to impersonate trusted sites.',
      matchedTokens: Array.from(rule1Tokens)
    });
  }

  // ---------------------------------------------------------------------------
  // Rule 2: Double-Extension & Executable Lure Check (+35 to +40 risk)
  // ---------------------------------------------------------------------------
  const rule2Tokens = new Set();
  let rule2Points = 0;
  const hasApkLureContext = containsAnyKeyword(lowerText, APK_LURE_KEYWORDS);

  for (let i = 0; i < tokens.length; i++) {
    const trimmed = trimTokenPunctuation(tokens[i]);
    if (!trimmed.value) continue;

    // Extract filename segment if token is a URL/path
    const val = trimmed.value;
    if (val.toLowerCase().startsWith('upi://')) continue;

    const queryStrip = val.split(/[?#]/)[0];
    const lastSlash = Math.max(queryStrip.lastIndexOf('/'), queryStrip.lastIndexOf('\\'));
    const fileName = lastSlash >= 0 ? queryStrip.slice(lastSlash + 1) : queryStrip;
    const fileStart = lastSlash >= 0 ? trimmed.start + lastSlash + 1 : trimmed.start;
    const fileEnd = fileStart + fileName.length;

    const parts = fileName.toLowerCase().split('.');
    if (parts.length >= 3) {
      const ext1 = parts[parts.length - 2];
      const ext2 = parts[parts.length - 1];
      if (DOUBLE_EXT_DOC.has(ext1) && EXECUTABLE_EXT.has(ext2)) {
        rule2Tokens.add(fileName);
        rule2Points = Math.max(rule2Points, 40);
        highlightSpans.push({
          start: fileStart,
          end: fileEnd,
          severity: 'danger',
          ruleId: 'double_extension_apk'
        });
        continue;
      }
    }

    if (parts.length >= 2 && parts[0].length > 0) {
      const ext = parts[parts.length - 1];
      if (EXECUTABLE_EXT.has(ext)) {
        const pts = ext === 'apk'
          ? (hasApkLureContext ? 40 : 35)
          : (hasApkLureContext ? 40 : 30);
        rule2Tokens.add(fileName);
        rule2Points = Math.max(rule2Points, pts);
        highlightSpans.push({
          start: fileStart,
          end: fileEnd,
          severity: 'danger',
          ruleId: 'double_extension_apk'
        });
      }
    }
  }

  if (rule2Tokens.size > 0) {
    findings.push({
      ruleId: 'double_extension_apk',
      severity: 'danger',
      points: rule2Points,
      title: 'Disguised Double-Extension / Executable Lure',
      detail: 'Found an executable (.apk/.exe/.bat) or double-extension file disguised as a document. Installing unknown APKs can steal SMS OTPs and device control.',
      matchedTokens: Array.from(rule2Tokens)
    });
  }

  // ---------------------------------------------------------------------------
  // Rule 3: URL Deception & Masking Check (+20 to +30 risk)
  // ---------------------------------------------------------------------------
  const rule3Tokens = new Set();
  let rule3Points = 0;
  let rule3Severity = 'warn';
  const hasShortenerUrgency = containsAnyKeyword(lowerText, SHORTENER_URGENCY_KEYWORDS);

  for (let i = 0; i < tokens.length; i++) {
    const trimmed = trimTokenPunctuation(tokens[i]);
    if (!trimmed.value) continue;

    const parsed = parseHttpUrlToken(trimmed.value, trimmed.start);
    if (parsed) {
      if (parsed.hasUserinfo) {
        rule3Tokens.add(trimmed.value);
        rule3Points = Math.max(rule3Points, 30);
        rule3Severity = 'danger';
        highlightSpans.push({
          start: parsed.authStart,
          end: parsed.authEnd,
          severity: 'danger',
          ruleId: 'url_deception'
        });
      }

      if (isValidIpv4Host(parsed.host)) {
        rule3Tokens.add(trimmed.value);
        rule3Points = Math.max(rule3Points, 30);
        rule3Severity = 'danger';
        highlightSpans.push({
          start: parsed.hostStart,
          end: parsed.hostEnd,
          severity: 'danger',
          ruleId: 'url_deception'
        });
      }

      const lowerHost = parsed.host.toLowerCase();
      if (SHORTENER_HOSTS.has(lowerHost)) {
        rule3Tokens.add(trimmed.value);
        const pts = hasShortenerUrgency ? 30 : 20;
        rule3Points = Math.max(rule3Points, pts);
        highlightSpans.push({
          start: trimmed.start,
          end: trimmed.end,
          severity: 'warn',
          ruleId: 'url_deception'
        });
      }

      const tld = extractDomainTld(parsed.host);
      if (
        tld &&
        HIGH_RISK_TLDS.has(tld) &&
        containsAnyKeyword(trimmed.value.toLowerCase(), SUSPICIOUS_URL_KEYWORDS)
      ) {
        rule3Tokens.add(trimmed.value);
        rule3Points = Math.max(rule3Points, 25);
        highlightSpans.push({
          start: trimmed.start,
          end: trimmed.end,
          severity: 'warn',
          ruleId: 'url_deception'
        });
      }
    } else if (!trimmed.value.toLowerCase().startsWith('upi://')) {
      // Catch bare shortener links or high-risk TLD lure domains without scheme (e.g. bit.ly/abc, metrobank-kyc.xyz/login)
      const slashIdx = trimmed.value.indexOf('/');
      const hostPart = (slashIdx >= 0 ? trimmed.value.slice(0, slashIdx) : trimmed.value).toLowerCase();
      if (SHORTENER_HOSTS.has(hostPart) && slashIdx > 0 && trimmed.value.length > slashIdx + 1) {
        rule3Tokens.add(trimmed.value);
        const pts = hasShortenerUrgency ? 30 : 20;
        rule3Points = Math.max(rule3Points, pts);
        highlightSpans.push({
          start: trimmed.start,
          end: trimmed.end,
          severity: 'warn',
          ruleId: 'url_deception'
        });
      } else {
        const delimIdx = trimmed.value.search(/[/?#]/);
        const rawAuth = delimIdx >= 0 ? trimmed.value.slice(0, delimIdx) : trimmed.value;
        if (!rawAuth.includes('@')) {
          const colonIdx = rawAuth.lastIndexOf(':');
          const bareHost =
            colonIdx > 0 && /^\d+$/.test(rawAuth.slice(colonIdx + 1))
              ? rawAuth.slice(0, colonIdx)
              : rawAuth;
          const tld = extractDomainTld(bareHost);
          if (
            tld &&
            HIGH_RISK_TLDS.has(tld) &&
            containsAnyKeyword(trimmed.value.toLowerCase(), SUSPICIOUS_URL_KEYWORDS)
          ) {
            rule3Tokens.add(trimmed.value);
            rule3Points = Math.max(rule3Points, 25);
            highlightSpans.push({
              start: trimmed.start,
              end: trimmed.end,
              severity: 'warn',
              ruleId: 'url_deception'
            });
          }
        }
      }
    }
  }

  if (rule3Tokens.size > 0) {
    findings.push({
      ruleId: 'url_deception',
      severity: rule3Severity,
      points: rule3Points,
      title: 'Deceptive or Masked URL Pattern',
      detail: 'Detected URL credential masking (@), a raw IPv4 host, a shortened link, or a high-risk disposable TLD paired with sensitive lure keywords.',
      matchedTokens: Array.from(rule3Tokens)
    });
  }

  // ---------------------------------------------------------------------------
  // Rule 4: UPI Deep-Link & Collect-Trap Dissector (+30 risk)
  // ---------------------------------------------------------------------------
  let upiDecoded = null;
  const rule4Tokens = new Set();
  let rule4Triggered = false;

  for (let i = 0; i < tokens.length; i++) {
    const trimmed = trimTokenPunctuation(tokens[i]);
    if (!trimmed.value) continue;
    if (trimmed.value.toLowerCase().startsWith('upi://pay')) {
      const parsed = parseUpiParams(trimmed.value);
      const numericAm = parsed.am ? Number(parsed.am) : NaN;
      const hasPositiveAm = Number.isFinite(numericAm) && numericAm > 0;
      const noteText = `${parsed.tn || ''} ${parsed.pn || ''}`.toLowerCase();
      const hasReceiveLanguage = containsAnyKeyword(lowerText, UPI_RECEIVE_MISMATCH_KEYWORDS) ||
        containsAnyKeyword(noteText, UPI_RECEIVE_MISMATCH_KEYWORDS);

      let warning = 'Golden Rule: Entering a UPI PIN ALWAYS sends money OUT of your account and NEVER receives money.';
      if (hasPositiveAm && hasReceiveLanguage) {
        warning = `Collect-Trap Alert: This link attempts to debit ₹${parsed.am} while claiming a cashback/refund/prize. Entering a UPI PIN ALWAYS sends money OUT and NEVER receives money.`;
      } else if (hasPositiveAm) {
        warning = `Debit Alert: Approving this UPI link and entering your UPI PIN sends ₹${parsed.am} OUT of your account. A UPI PIN is NEVER required to receive money.`;
      }

      if (!upiDecoded) {
        upiDecoded = {
          pa: parsed.pa,
          pn: parsed.pn,
          am: parsed.am,
          cu: parsed.cu,
          tn: parsed.tn,
          mode: parsed.mode,
          tr: parsed.tr,
          warning
        };
      }

      if (hasPositiveAm || hasReceiveLanguage) {
        rule4Triggered = true;
        rule4Tokens.add(trimmed.value);
        highlightSpans.push({
          start: trimmed.start,
          end: trimmed.end,
          severity: 'danger',
          ruleId: 'upi_collect_trap'
        });
      }
    }
  }

  // Also detect plain-text UPI collect-trap wording when no upi://pay URI is pasted
  if (!rule4Triggered) {
    const hasCollectContext = /\b(?:upi|collect\s+request|pay\s+request)\b/i.test(text) ||
      text.includes('यूपीआई');
    const hasReceiveLanguage = containsAnyKeyword(lowerText, UPI_RECEIVE_MISMATCH_KEYWORDS);
    if (hasCollectContext && hasReceiveLanguage) {
      rule4Triggered = true;
      const m = /\b(?:upi\s+collect|collect\s+request|upi)\b/i.exec(text);
      if (m) {
        rule4Tokens.add(m[0]);
        highlightSpans.push({
          start: m.index,
          end: m.index + m[0].length,
          severity: 'danger',
          ruleId: 'upi_collect_trap'
        });
      } else {
        rule4Tokens.add('UPI collect');
      }
    }
  }

  if (rule4Triggered) {
    findings.push({
      ruleId: 'upi_collect_trap',
      severity: 'danger',
      points: 30,
      title: 'UPI Collect / PIN-to-Receive Trap',
      detail: 'Detected a UPI debit/collect pattern paired with refund, prize, or PIN claims. Entering a UPI PIN only sends money out and never credits money.',
      matchedTokens: Array.from(rule4Tokens)
    });
  }

  // ---------------------------------------------------------------------------
  // Rule 5: Social-Engineering Pressure Tokens (+15 to +25 risk)
  // ---------------------------------------------------------------------------
  const rule5Tokens = [];
  const seenRule5 = new Set();

  for (let i = 0; i < PRESSURE_RULES.length; i++) {
    const pr = PRESSURE_RULES[i];
    if (pr.regex) {
      pr.regex.lastIndex = 0;
      let match;
      while ((match = pr.regex.exec(text)) !== null) {
        const matchedText = match[0];
        const key = matchedText.toLowerCase();
        if (!seenRule5.has(key)) {
          seenRule5.add(key);
          rule5Tokens.push(matchedText);
        }
        highlightSpans.push({
          start: match.index,
          end: match.index + matchedText.length,
          severity: 'warn',
          ruleId: 'social_engineering_pressure'
        });
      }
    } else if (pr.literal) {
      let searchFrom = 0;
      while (searchFrom < text.length) {
        const idx = text.indexOf(pr.literal, searchFrom);
        if (idx === -1) break;
        if (!seenRule5.has(pr.literal)) {
          seenRule5.add(pr.literal);
          rule5Tokens.push(pr.literal);
        }
        highlightSpans.push({
          start: idx,
          end: idx + pr.literal.length,
          severity: 'warn',
          ruleId: 'social_engineering_pressure'
        });
        searchFrom = idx + pr.literal.length;
      }
    }
  }

  if (rule5Tokens.length > 0) {
    const rule5Points = Math.min(25, 15 + (rule5Tokens.length - 1) * 5);
    findings.push({
      ruleId: 'social_engineering_pressure',
      severity: 'warn',
      points: rule5Points,
      title: 'High-Pressure / Authority Manipulation Language',
      detail: 'Found panic, isolation, fake legal/KYC suspension, or urgency phrases engineered to force action before verifying.',
      matchedTokens: rule5Tokens
    });
  }

  // ---------------------------------------------------------------------------
  // Score & Verdict Calculation
  // ---------------------------------------------------------------------------
  let rawScore = 0;
  for (let i = 0; i < findings.length; i++) {
    rawScore += findings[i].points;
  }
  const riskScore = Math.min(100, rawScore);

  let verdictLevel = 'low';
  let verdict = 'LOW RISK - NO KNOWN TRAP TOKENS';
  if (riskScore >= 50) {
    verdictLevel = 'high';
    verdict = 'HIGH RISK - LIKELY SCAM TRAP';
  } else if (riskScore > 0) {
    verdictLevel = 'medium';
    verdict = 'CAUTION - SUSPICIOUS SIGNALS';
  }

  const highlightedSegments = buildHighlightedSegments(text, highlightSpans);
  const elapsedMs = Number((Number(process.hrtime.bigint() - startNs) / 1e6).toFixed(3));

  return {
    riskScore,
    verdictLevel,
    verdict,
    elapsedMs,
    findings,
    upiDecoded,
    highlightedSegments
  };
}

module.exports = {
  MAX_INPUT_LENGTH,
  analyzeInput
};
