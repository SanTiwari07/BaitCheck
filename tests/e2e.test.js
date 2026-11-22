'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn, execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { createApp } = require('../server');

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

function findBrowserExecutable() {
  for (const candidate of CHROME_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error(
    `No headless Chromium executable found. Checked: ${CHROME_CANDIDATES.join(', ')}`
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function launchHeadlessBrowser(userDataDir) {
  const exePath = findBrowserExecutable();
  const proc = spawn(
    exePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-extensions',
      '--remote-debugging-port=0',
      `--user-data-dir=${userDataDir}`,
      'about:blank'
    ],
    {
      stdio: ['ignore', 'pipe', 'pipe']
    }
  );

  let stderrBuf = '';
  proc.stderr.on('data', (chunk) => {
    stderrBuf += chunk.toString('utf8');
  });

  const activePortFile = path.join(userDataDir, 'DevToolsActivePort');
  const deadline = Date.now() + 15000;
  let port = null;
  let browserPath = null;

  while (Date.now() < deadline) {
    if (proc.exitCode !== null) {
      throw new Error(`Browser exited prematurely with code ${proc.exitCode}: ${stderrBuf}`);
    }

    const match = /DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)(\/devtools\/browser\/[^\s]+)/.exec(
      stderrBuf
    );
    if (match) {
      port = Number(match[1]);
      browserPath = match[2];
      break;
    }

    if (fs.existsSync(activePortFile)) {
      const lines = fs
        .readFileSync(activePortFile, 'utf8')
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (lines.length >= 2 && Number(lines[0]) > 0) {
        port = Number(lines[0]);
        browserPath = lines[1];
        break;
      }
    }
    await delay(50);
  }

  if (!port) {
    throw new Error(`Timed out waiting for DevTools port. stderr: ${stderrBuf}`);
  }

  let pageWsUrl = null;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (res.ok) {
        const targets = await res.json();
        const page = targets.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
        if (page) {
          pageWsUrl = page.webSocketDebuggerUrl;
          break;
        }
      }
    } catch {
      // Retry until DevTools HTTP endpoint is ready.
    }
    await delay(50);
  }

  if (!pageWsUrl) {
    throw new Error(`Timed out waiting for page target on port ${port} (${browserPath})`);
  }

  return { proc, port, pageWsUrl };
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.nextId = 1;
    this.pending = new Map();
    this.consoleErrors = [];
    this.pageExceptions = [];
    this.loadWaiters = [];
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      const onOpen = () => {
        cleanup();
        resolve();
      };
      const onError = (err) => {
        cleanup();
        reject(new Error(`CDP WebSocket error: ${err.message || err}`));
      };
      const cleanup = () => {
        this.ws.removeEventListener('open', onOpen);
        this.ws.removeEventListener('error', onError);
      };
      this.ws.addEventListener('open', onOpen);
      this.ws.addEventListener('error', onError);
    });

    this.ws.addEventListener('message', (event) => {
      let msg;
      try {
        msg = JSON.parse(String(event.data));
      } catch {
        return;
      }

      if (typeof msg.id === 'number') {
        const entry = this.pending.get(msg.id);
        if (entry) {
          this.pending.delete(msg.id);
          clearTimeout(entry.timer);
          if (msg.error) {
            entry.reject(new Error(`CDP ${entry.method} error: ${msg.error.message}`));
          } else {
            entry.resolve(msg.result || {});
          }
        }
        return;
      }

      if (msg.method === 'Runtime.consoleAPICalled' && msg.params?.type === 'error') {
        const text = (msg.params.args || [])
          .map((a) => (a.value !== undefined ? String(a.value) : a.description || a.type))
          .join(' ');
        this.consoleErrors.push(text);
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const details = msg.params?.exceptionDetails;
        const text =
          details?.exception?.description || details?.text || 'Uncaught page exception';
        this.pageExceptions.push(text);
      } else if (msg.method === 'Page.loadEventFired') {
        const waiters = this.loadWaiters.splice(0, this.loadWaiters.length);
        for (const w of waiters) w();
      }
    });

    await this.send('Runtime.enable');
    await this.send('Page.enable');
    await this.send('DOM.enable');
  }

  send(method, params = {}, timeoutMs = 10000) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error(`CDP WebSocket is not open for ${method}`));
    }
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP command timed out: ${method}`));
      }, timeoutMs);
      this.pending.set(id, { method, resolve, reject, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async setViewport(width, height, mobile) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: mobile ? 2 : 1,
      mobile
    });
  }

  async navigate(url) {
    const loadPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timed out waiting for Page.loadEventFired on ${url}`));
      }, 10000);
      this.loadWaiters.push(() => {
        clearTimeout(timer);
        resolve();
      });
    });
    const navResult = await this.send('Page.navigate', { url });
    if (navResult.errorText) {
      throw new Error(`Navigation failed (${url}): ${navResult.errorText}`);
    }
    await loadPromise;
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    if (res.exceptionDetails) {
      const msg =
        res.exceptionDetails.exception?.description ||
        res.exceptionDetails.text ||
        'Evaluation exception';
      throw new Error(`Runtime.evaluate exception: ${msg}`);
    }
    return res.result ? res.result.value : undefined;
  }

  async waitFor(predicateJs, description, timeoutMs = 8000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const val = await this.eval(`Boolean((() => (${predicateJs}))())`);
      if (val) return;
      await delay(50);
    }
    const snippet = await this.eval('document.body ? document.body.innerText.slice(0, 500) : ""');
    throw new Error(`Timed out waiting for: ${description}. Visible text:\n${snippet}`);
  }

  async clickSelector(selector) {
    const ok = await this.eval(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el || el.disabled) return false;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return false;
      el.scrollIntoView({ block: 'center' });
      el.click();
      return true;
    })()`);
    assert.ok(ok, `Expected clickable visible element matching "${selector}"`);
  }

  async clickByText(selector, textSubstring) {
    const ok = await this.eval(`(() => {
      const els = Array.from(document.querySelectorAll(${JSON.stringify(selector)}));
      const target = els.find((el) => {
        if (el.disabled) return false;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return false;
        return (el.textContent || '').includes(${JSON.stringify(textSubstring)});
      });
      if (!target) return false;
      target.scrollIntoView({ block: 'center' });
      target.click();
      return true;
    })()`);
    assert.ok(
      ok,
      `Expected clickable "${selector}" containing "${textSubstring}"`
    );
  }

  async setInputValue(selector, value) {
    const ok = await this.eval(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      el.focus();
      el.value = ${JSON.stringify(value)};
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`);
    assert.ok(ok, `Expected input/textarea "${selector}"`);
  }

  async close() {
    for (const [, entry] of this.pending) {
      clearTimeout(entry.timer);
      entry.reject(new Error('CDP client closed'));
    }
    this.pending.clear();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
  }
}

describe('BaitCheck Headless Browser E2E Suite (CDP)', () => {
  let tmpDir;
  let userDataDir;
  let downloadDir;
  let dbPath;
  let app;
  let server;
  let baseUrl;
  let chromeProc;
  let cdp;

  before(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baitcheck-e2e-'));
    userDataDir = path.join(tmpDir, 'chrome-profile');
    downloadDir = path.join(tmpDir, 'downloads');
    fs.mkdirSync(userDataDir, { recursive: true });
    fs.mkdirSync(downloadDir, { recursive: true });

    dbPath = path.join(tmpDir, 'e2e.db');
    app = createApp({ dbPath });
    server = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    const addr = server.address();
    baseUrl = `http://127.0.0.1:${addr.port}`;

    const launched = await launchHeadlessBrowser(userDataDir);
    chromeProc = launched.proc;
    cdp = new CdpClient(launched.pageWsUrl);
    await cdp.connect();

    // Direct any triggered downloads into temp directory so host Downloads stays clean.
    try {
      await cdp.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadDir
      });
    } catch {
      // Ignore if Browser.setDownloadBehavior is required on newer builds.
    }
  });

  after(async () => {
    if (cdp) {
      await cdp.close();
    }

    if (chromeProc && chromeProc.exitCode === null) {
      try {
        if (process.platform === 'win32') {
          execFileSync('taskkill', ['/PID', String(chromeProc.pid), '/T', '/F'], {
            stdio: 'ignore'
          });
        } else {
          chromeProc.kill('SIGKILL');
        }
      } catch {
        try {
          chromeProc.kill('SIGKILL');
        } catch {
          // Ignore kill errors.
        }
      }
      await Promise.race([
        new Promise((resolve) => chromeProc.once('exit', resolve)),
        delay(2000)
      ]);
    }

    if (server) {
      if (typeof server.closeAllConnections === 'function') {
        server.closeAllConnections();
      }
      await new Promise((resolve) => server.close(resolve));
    }

    if (app && app.locals && app.locals.db) {
      app.locals.db.close();
    }

    if (tmpDir) {
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 150 });
      } catch {
        // Ignore transient Windows file lock cleanup issues in temp dir.
      }
    }
  });

  it('1. Mobile 360x800 layout, safety ribbon, >=44px touch targets & bilingual toggle', async () => {
    await cdp.setViewport(360, 800, true);
    await cdp.navigate(`${baseUrl}/`);
    await cdp.waitFor('document.querySelector("#answer-start-drill-btn")', 'Hero CTA button');

    const initialMetrics = await cdp.eval(`(() => {
      const ribbon = document.querySelector('.safety-ribbon');
      const ribbonStyle = ribbon ? getComputedStyle(ribbon) : null;
      const ribbonRect = ribbon ? ribbon.getBoundingClientRect() : null;
      const buttons = Array.from(document.querySelectorAll('header button, #view-drill button'));
      const buttonChecks = buttons
        .filter((b) => {
          const r = b.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        })
        .map((b) => ({
          id: b.id || b.className,
          text: (b.textContent || '').trim().slice(0, 32),
          height: b.getBoundingClientRect().height
        }));
      return {
        ribbonVisible: Boolean(ribbon && ribbonStyle.display !== 'none' && ribbonRect.height > 0),
        ribbonText: ribbon ? ribbon.textContent.trim() : '',
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        buttonChecks
      };
    })()`);

    assert.equal(initialMetrics.ribbonVisible, true, 'Safety ribbon must be visible');
    assert.match(initialMetrics.ribbonText, /SIMULATION/);
    assert.ok(
      initialMetrics.scrollWidth <= 360,
      `Expected zero horizontal overflow on 360px mobile, got scrollWidth=${initialMetrics.scrollWidth}`
    );
    assert.ok(initialMetrics.buttonChecks.length >= 6, 'Expected header + hero buttons');
    for (const btn of initialMetrics.buttonChecks) {
      assert.ok(
        btn.height >= 44,
        `Button "${btn.text}" (${btn.id}) height ${btn.height}px is below 44px touch target`
      );
    }

    // Switch to Hindi
    await cdp.clickSelector('#lang-hi-btn');
    await cdp.waitFor(
      'document.querySelector("#tab-drill-label")?.textContent === "60s ड्रिल"',
      'Hindi tab label update'
    );

    const hiMetrics = await cdp.eval(`({
      tabDrill: document.querySelector('#tab-drill-label')?.textContent?.trim(),
      ribbon: document.querySelector('#safety-ribbon-text')?.textContent?.trim(),
      scrollWidth: document.documentElement.scrollWidth
    })`);
    assert.equal(hiMetrics.tabDrill, '60s ड्रिल');
    assert.match(hiMetrics.ribbon, /सिम्युलेशन/);
    assert.ok(
      hiMetrics.scrollWidth <= 360,
      `Expected zero horizontal overflow in Hindi mode, got ${hiMetrics.scrollWidth}`
    );

    // Switch back to English
    await cdp.clickSelector('#lang-en-btn');
    await cdp.waitFor(
      'document.querySelector("#tab-drill-label")?.textContent === "60s DRILL"',
      'English tab label restore'
    );
  });

  it('2. Full 60s Drill flow (Trap + APK Inspect + Pass + 1080x1350 PNG Canvas)', async () => {
    await cdp.setViewport(360, 800, true);
    await cdp.navigate(`${baseUrl}/`);
    await cdp.waitFor('document.querySelector("#answer-start-drill-btn")', 'Hero CTA');

    await cdp.clickSelector('#answer-start-drill-btn');
    await cdp.waitFor(
      'document.querySelector("#drill-countdown-time") && document.querySelector(".caption-script")',
      'Drill 1 active stage'
    );

    const drill1State = await cdp.eval(`(() => {
      const cap = document.querySelector('.caption-script');
      const timer = document.querySelector('#drill-countdown-time');
      return {
        bodyText: document.querySelector('#view-drill')?.textContent || '',
        timerText: timer ? timer.textContent.trim() : '',
        captionFontSize: cap ? parseFloat(getComputedStyle(cap).fontSize) : 0,
        scrollWidth: document.documentElement.scrollWidth
      };
    })()`);

    assert.match(drill1State.bodyText, /Central Cyber Desk \(Simulated\)/);
    assert.match(drill1State.timerText, /^\d+\.\ds$/);
    assert.ok(
      drill1State.captionFontSize >= 18,
      `Expected >=18px caption fontSize, got ${drill1State.captionFontSize}px`
    );
    assert.ok(drill1State.scrollWidth <= 360);

    // Mid-drill tab switch: pause countdown on X-Ray tab for 400ms, then resume on Drill tab and verify it still ticks down
    await delay(250);
    const timerBeforeSwitch = await cdp.eval(
      'parseFloat(document.querySelector("#drill-countdown-time")?.textContent || "0")'
    );
    assert.ok(timerBeforeSwitch > 5, `Expected active countdown > 5s, got ${timerBeforeSwitch}`);

    await cdp.clickSelector('#tab-xray-btn');
    await cdp.waitFor(
      '!document.querySelector("#view-xray")?.classList.contains("is-hidden")',
      'X-Ray tab visible mid-drill'
    );
    await delay(400);

    await cdp.clickSelector('#tab-drill-btn');
    await cdp.waitFor(
      '!document.querySelector("#view-drill")?.classList.contains("is-hidden") && document.querySelector("#drill-countdown-time")',
      'Drill tab restored mid-drill'
    );
    const timerOnReturn = await cdp.eval(
      'parseFloat(document.querySelector("#drill-countdown-time")?.textContent || "0")'
    );
    assert.ok(timerOnReturn > 0, `Expected positive countdown on return, got ${timerOnReturn}`);
    assert.ok(
      timerBeforeSwitch - timerOnReturn <= 0.35,
      `Expected countdown to pause while on X-Ray tab (before=${timerBeforeSwitch}, return=${timerOnReturn})`
    );

    await delay(450);
    const timerAfterResume = await cdp.eval(
      'parseFloat(document.querySelector("#drill-countdown-time")?.textContent || "0")'
    );
    assert.ok(
      timerAfterResume < timerOnReturn,
      `Expected resumed countdown to tick down without freezing (return=${timerOnReturn}, after=${timerAfterResume})`
    );

    // Drill 1: Choose trap option
    await cdp.clickByText('#view-drill .choices-list button', 'Stay on the video call & pay the refundable deposit');
    await cdp.waitFor('document.querySelector(".trap-alert-banner")', 'Drill 1 trap debrief');
    const d1Debrief = await cdp.eval(
      'document.querySelector(".trap-alert-banner")?.textContent || ""'
    );
    assert.match(d1Debrief, /SIMULATED LOSS: -₹50,000/);

    await cdp.clickByText('#view-drill .trap-alert-banner button', 'NEXT DRILL');

    // Drill 2: Inspect .pdf.apk safely, then spot red flag
    await cdp.waitFor(
      'document.querySelector(".apk-pill-btn")',
      'Drill 2 .pdf.apk attachment pill'
    );
    const d2Text = await cdp.eval('document.querySelector("#view-drill")?.textContent || ""');
    assert.match(d2Text, /Metro Power Utility \(Demo\)/);

    await cdp.clickByText('.apk-pill-btn', 'MetroBill_Notice.pdf.apk');
    await cdp.waitFor('document.querySelector(".apk-sim-notice")', 'Safe APK simulation notice');
    const apkNotice = await cdp.eval(
      'document.querySelector(".apk-sim-notice")?.textContent || ""'
    );
    assert.match(apkNotice, /SIMULATION SAFE/);

    await cdp.clickByText('#view-drill .choices-list button', 'Check the .apk extension & delete the message');
    await cdp.waitFor('document.querySelector(".safe-pass-banner")', 'Drill 2 pass debrief');
    const d2Debrief = await cdp.eval(
      'document.querySelector(".safe-pass-banner")?.textContent || ""'
    );
    assert.match(d2Debrief, /TRAP DODGED \(\+35 IMMUNITY\)/);

    await cdp.clickByText('#view-drill .safe-pass-banner button', 'NEXT DRILL');

    // Drill 3: UPI Collect Trap
    await cdp.waitFor(
      '(document.querySelector("#view-drill")?.textContent || "").includes("PaySim Wallet Collect (Demo)")',
      'Drill 3 PaySim Wallet Collect'
    );
    await cdp.clickByText(
      '#view-drill .choices-list button',
      'Decline — a UPI PIN only sends money out'
    );
    await cdp.waitFor('document.querySelector(".safe-pass-banner")', 'Drill 3 pass debrief');
    const d3Debrief = await cdp.eval(
      'document.querySelector(".safe-pass-banner")?.textContent || ""'
    );
    assert.match(d3Debrief, /TRAP DODGED \(\+30 IMMUNITY\)/);

    await cdp.clickByText('#view-drill .safe-pass-banner button', 'VIEW VERDICT TICKET');
    await cdp.waitFor('document.querySelector(".verdict-ticket")', 'Finale verdict ticket');

    const finale = await cdp.eval(`(() => ({
      tiles: Array.from(document.querySelectorAll('#view-drill .split-flap-tile')).map((t) => t.textContent.trim()),
      ticketVisible: Boolean(document.querySelector('.verdict-ticket')),
      scrollWidth: document.documentElement.scrollWidth
    }))()`);

    assert.equal(finale.ticketVisible, true);
    assert.ok(finale.tiles.some((t) => t.includes('65%')), `Expected 65% in ${finale.tiles}`);
    assert.ok(finale.tiles.some((t) => t.includes('2/3')), `Expected 2/3 in ${finale.tiles}`);
    assert.ok(finale.scrollWidth <= 360);

    // Hook Canvas toDataURL to verify exact 1080x1350 PNG export without errors
    await cdp.eval(`(() => {
      window.__capturedCanvasExport = null;
      const orig = HTMLCanvasElement.prototype.toDataURL;
      window.__origToDataURL = orig;
      HTMLCanvasElement.prototype.toDataURL = function (...args) {
        const out = orig.apply(this, args);
        window.__capturedCanvasExport = {
          width: this.width,
          height: this.height,
          dataUrl: out
        };
        return out;
      };
    })()`);

    await cdp.clickByText('#view-drill button.button-primary', 'DOWNLOAD VERDICT TICKET');
    await cdp.waitFor(
      '(document.querySelector("#view-drill")?.textContent || "").includes("baitcheck-verdict-ticket.png") && document.querySelector("#view-drill .ticket-preview-img")',
      'PNG download confirmation message and .ticket-preview-img preview'
    );

    const previewImg = await cdp.eval(`(() => {
      const img = document.querySelector('#view-drill .ticket-preview-img');
      return img ? {
        src: img.getAttribute('src') || '',
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      } : null;
    })()`);
    assert.ok(previewImg, 'Expected .ticket-preview-img to render after downloading PNG');
    assert.ok(
      previewImg.src.startsWith('data:image/png;base64,'),
      'Expected .ticket-preview-img src to be a PNG data URL'
    );

    const canvasCapture = await cdp.eval(`(() => {
      const cap = window.__capturedCanvasExport;
      if (window.__origToDataURL) {
        HTMLCanvasElement.prototype.toDataURL = window.__origToDataURL;
        delete window.__origToDataURL;
      }
      return cap;
    })()`);

    assert.ok(canvasCapture, 'Expected HTMLCanvasElement.toDataURL to be called');
    assert.equal(canvasCapture.width, 1080);
    assert.equal(canvasCapture.height, 1350);
    assert.ok(canvasCapture.dataUrl.startsWith('data:image/png;base64,'));

    // Verify PNG header and IHDR dimensions directly from decoded bytes
    const pngBytes = Buffer.from(
      canvasCapture.dataUrl.slice('data:image/png;base64,'.length),
      'base64'
    );
    assert.deepEqual(
      pngBytes.subarray(0, 8),
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    );
    assert.equal(pngBytes.readUInt32BE(16), 1080);
    assert.equal(pngBytes.readUInt32BE(20), 1350);
  });

  it('3. Tab 2 Link X-Ray (Presets, Decoded UPI Table & XSS Safety)', async () => {
    await cdp.setViewport(360, 800, true);
    await cdp.clickSelector('#tab-xray-btn');
    await cdp.waitFor(
      '!document.querySelector("#view-xray")?.classList.contains("is-hidden")',
      'Link X-Ray panel visible'
    );

    const xrayOverflow = await cdp.eval('document.documentElement.scrollWidth');
    assert.ok(xrayOverflow <= 360, `Expected <=360px overflow in X-Ray tab, got ${xrayOverflow}`);

    // Preset 1: Punycode + KYC SMS
    await cdp.clickByText('#view-xray .preset-chip', 'Punycode + KYC SMS');
    await cdp.waitFor(
      'document.querySelector("#view-xray .risk-meter-wrap") && document.querySelectorAll("#view-xray mark").length > 0',
      'Preset 1 Punycode HIGH RISK result'
    );

    const preset1 = await cdp.eval(`(() => ({
      scoreText: document.querySelector('#view-xray .risk-score-row .display-xl')?.textContent?.trim() || '',
      verdict: document.querySelector('#view-xray .risk-score-row .status-tag')?.textContent?.trim() || '',
      markCount: document.querySelectorAll('#view-xray .xray-highlight-box mark').length
    }))()`);

    assert.match(preset1.verdict, /HIGH RISK/);
    const scoreNum = parseInt(preset1.scoreText, 10);
    assert.ok(scoreNum >= 50, `Expected score >= 50, got ${preset1.scoreText}`);
    assert.ok(preset1.markCount >= 1, 'Expected <mark> elements rendered');

    // Preset 3: UPI Cashback Trap
    await cdp.clickByText('#view-xray .preset-chip', 'UPI Cashback Trap');
    await cdp.waitFor('document.querySelector("#view-xray .upi-table")', 'Decoded UPI table');

    const upiTableText = await cdp.eval(
      'document.querySelector("#view-xray .upi-table")?.textContent || ""'
    );
    assert.match(upiTableText, /reward-desk@paysim/);
    assert.match(upiTableText, /4500/);

    // XSS Safety test
    const xssPayload = '<img src=x onerror="window.__xssPwned=true"> https://xn--evil-demo.example';
    await cdp.setInputValue('#xray-textarea', xssPayload);
    await cdp.clickByText('#view-xray button.button-primary', 'RUN FORENSIC X-RAY');

    await cdp.waitFor(
      '(document.querySelector("#view-xray .xray-highlight-box")?.textContent || "").includes("xn--evil-demo.example")',
      'XSS payload scan result'
    );

    const xssCheck = await cdp.eval(`(() => {
      const box = document.querySelector('#view-xray .xray-highlight-box');
      return {
        pwned: window.__xssPwned,
        imgCount: box ? box.querySelectorAll('img').length : -1,
        text: box ? box.textContent : '',
        marks: box ? Array.from(box.querySelectorAll('mark')).map((m) => m.textContent) : []
      };
    })()`);

    assert.equal(xssCheck.pwned, undefined, 'XSS payload must never execute');
    assert.equal(xssCheck.imgCount, 0, 'XSS <img> tag must never be parsed as DOM element');
    assert.ok(xssCheck.text.includes('<img src=x onerror="window.__xssPwned=true">'));
    assert.ok(
      xssCheck.marks.some((m) => m.includes('xn--evil-demo.example')),
      `Expected xn--evil-demo.example highlighted in <mark>, got ${JSON.stringify(xssCheck.marks)}`
    );
  });

  it('4. Tab 3 Family Challenge -> /c/:id -> /c/:id/report live persistence', async () => {
    await cdp.setViewport(360, 800, true);
    await cdp.clickSelector('#tab-challenge-btn');
    await cdp.waitFor(
      '!document.querySelector("#view-challenge")?.classList.contains("is-hidden")',
      'Challenge tab visible'
    );

    await cdp.setInputValue('#challenge-creator-input', 'Aarav');
    await cdp.setInputValue('#challenge-target-input', 'Mom');
    await cdp.clickSelector('#view-challenge form button[type="submit"]');

    await cdp.waitFor(
      'document.querySelector("#view-challenge .share-url-box")',
      'Shareable challenge URL box'
    );

    const shareUrl = await cdp.eval(
      'document.querySelector("#view-challenge .share-url-box")?.textContent?.trim() || ""'
    );
    const slugMatch = /\/c\/(mom-[a-z0-9-]+)/.exec(shareUrl);
    assert.ok(slugMatch, `Expected /c/mom-... URL, got "${shareUrl}"`);
    const challengePath = `/c/${slugMatch[1]}`;

    // Verify localStorage recent challenges persistence & Tab 3 recent list rendering
    const recentState = await cdp.eval(`(() => {
      const raw = window.localStorage.getItem('baitcheck_recent_challenges_v1');
      const rows = Array.from(document.querySelectorAll('#view-challenge .recent-challenge-row')).map(
        (r) => r.textContent || ''
      );
      return { raw, rows };
    })()`);
    assert.ok(recentState.raw, 'Expected baitcheck_recent_challenges_v1 in localStorage');
    const parsedRecent = JSON.parse(recentState.raw);
    assert.ok(Array.isArray(parsedRecent) && parsedRecent.length >= 1);
    assert.ok(
      parsedRecent.some(
        (entry) =>
          entry.id === slugMatch[1] &&
          entry.creator_name === 'Aarav' &&
          entry.target_label === 'Mom'
      ),
      `Expected created challenge ${slugMatch[1]} in localStorage, got ${recentState.raw}`
    );
    assert.ok(
      recentState.rows.some((txt) => txt.includes('Aarav') && txt.includes('Mom') && txt.includes(challengePath)),
      `Expected recent challenge row in Tab 3, got ${JSON.stringify(recentState.rows)}`
    );

    // Navigate directly to /c/mom-...
    await cdp.navigate(`${baseUrl}${challengePath}`);
    await cdp.waitFor(
      'document.querySelector(".challenge-banner-title") && document.querySelector("#answer-start-drill-btn")',
      'Challenge banner and Start button on /c/:id'
    );

    const bannerText = await cdp.eval(
      'document.querySelector(".challenge-banner-title")?.textContent?.trim() || ""'
    );
    assert.equal(bannerText.toUpperCase(), 'CHALLENGE FROM AARAV FOR MOM');

    // Run all 3 drills with passing choices
    await cdp.clickSelector('#answer-start-drill-btn');

    // Drill 1 Pass
    await cdp.waitFor('document.querySelector("#view-drill .choices-list button")', 'Drill 1 choices');
    await cdp.clickByText('#view-drill .choices-list button', 'Ask for an official written warrant & hang up');
    await cdp.waitFor(
      '(document.querySelector("#view-drill")?.textContent || "").includes("Saved to live family readiness report.")',
      'Drill 1 telemetry saved'
    );
    await cdp.clickByText('#view-drill .safe-pass-banner button', 'NEXT DRILL');

    // Drill 2 Pass
    await cdp.waitFor('document.querySelector(".apk-pill-btn")', 'Drill 2 choices');
    await cdp.clickByText('#view-drill .choices-list button', 'Check the .apk extension & delete the message');
    await cdp.waitFor(
      '(document.querySelector("#view-drill")?.textContent || "").includes("Saved to live family readiness report.")',
      'Drill 2 telemetry saved'
    );
    await cdp.clickByText('#view-drill .safe-pass-banner button', 'NEXT DRILL');

    // Drill 3 Pass
    await cdp.waitFor(
      '(document.querySelector("#view-drill")?.textContent || "").includes("PaySim Wallet Collect (Demo)")',
      'Drill 3 choices'
    );
    await cdp.clickByText('#view-drill .choices-list button', 'Reject request & block sender without tapping Approve');
    await cdp.waitFor(
      '(document.querySelector("#view-drill")?.textContent || "").includes("Saved to live family readiness report.")',
      'Drill 3 telemetry saved'
    );
    await cdp.clickByText('#view-drill .safe-pass-banner button', 'VIEW VERDICT TICKET');

    await cdp.waitFor('document.querySelector(".verdict-ticket")', 'Challenge finale ticket');
    const finaleTiles = await cdp.eval(
      'Array.from(document.querySelectorAll("#view-drill .split-flap-tile")).map((t) => t.textContent.trim())'
    );
    assert.ok(finaleTiles.some((t) => t.includes('100%')), `Expected 100% immunity, got ${finaleTiles}`);

    // Navigate directly to /c/mom-.../report
    await cdp.navigate(`${baseUrl}${challengePath}/report`);
    await cdp.waitFor(
      'document.querySelector("#view-report .split-flap-grid")',
      'Live challenge report loaded'
    );

    const report = await cdp.eval(`(() => ({
      text: document.querySelector('#view-report')?.textContent || '',
      tiles: Array.from(document.querySelectorAll('#view-report .split-flap-tile')).map((t) => t.textContent.trim()),
      scrollWidth: document.documentElement.scrollWidth
    }))()`);

    assert.match(report.text.toUpperCase(), /REPORT FOR MOM/);
    assert.match(report.text.toUpperCase(), /SENT BY AARAV/);
    assert.match(report.text.toUpperCase(), /ALL 3 DRILLS COMPLETED/);
    assert.ok(report.tiles.some((t) => t.includes('100%')), `Expected 100% in ${report.tiles}`);
    assert.ok(
      report.scrollWidth <= 360,
      `Expected zero horizontal overflow on /report at 360px, got ${report.scrollWidth}`
    );
  });

  it('5. Desktop 1280x800 2-column grid layout & zero console/exception errors', async () => {
    await cdp.setViewport(1280, 800, false);
    await cdp.navigate(`${baseUrl}/`);
    await cdp.waitFor('document.querySelector("#answer-start-drill-btn")', 'Desktop hero ready');

    const layout = await cdp.eval(`(() => {
      const stage = document.querySelector('.stage-column')?.getBoundingClientRect();
      const companion = document.querySelector('.companion-column')?.getBoundingClientRect();
      return {
        stage: stage ? { left: stage.left, right: stage.right, width: stage.width } : null,
        companion: companion ? { left: companion.left, right: companion.right, width: companion.width } : null,
        scrollWidth: document.documentElement.scrollWidth
      };
    })()`);

    assert.ok(layout.stage && layout.stage.width > 0);
    assert.ok(layout.companion && layout.companion.width > 0);
    assert.ok(
      layout.companion.left > layout.stage.left,
      `Expected 2-column side-by-side grid (companion.left=${layout.companion.left} > stage.left=${layout.stage.left})`
    );
    assert.ok(layout.companion.right <= 1280);
    assert.ok(
      layout.scrollWidth <= 1280,
      `Expected zero horizontal overflow at 1280px, got ${layout.scrollWidth}`
    );

    assert.deepEqual(
      cdp.consoleErrors,
      [],
      `Expected zero browser console errors, observed: ${JSON.stringify(cdp.consoleErrors)}`
    );
    assert.deepEqual(
      cdp.pageExceptions,
      [],
      `Expected zero uncaught page exceptions, observed: ${JSON.stringify(cdp.pageExceptions)}`
    );
  });

  it('6. Responsive 390x844 & 768x1024 zero overflow + /c/nonexistent-999 friendly 404 recovery', async () => {
    // iPhone 14 (390x844) across primary tabs
    await cdp.setViewport(390, 844, true);
    await cdp.navigate(`${baseUrl}/`);
    await cdp.waitFor('document.querySelector("#answer-start-drill-btn")', '390x844 hero ready');
    const iphoneHeroOverflow = await cdp.eval('document.documentElement.scrollWidth');
    assert.ok(
      iphoneHeroOverflow <= 390,
      `Expected zero horizontal overflow on 390x844 hero, got scrollWidth=${iphoneHeroOverflow}`
    );

    await cdp.clickSelector('#tab-xray-btn');
    await cdp.waitFor(
      '!document.querySelector("#view-xray")?.classList.contains("is-hidden")',
      '390x844 X-Ray tab visible'
    );
    const iphoneXrayOverflow = await cdp.eval('document.documentElement.scrollWidth');
    assert.ok(
      iphoneXrayOverflow <= 390,
      `Expected zero horizontal overflow on 390x844 X-Ray, got scrollWidth=${iphoneXrayOverflow}`
    );

    await cdp.clickSelector('#tab-challenge-btn');
    await cdp.waitFor(
      '!document.querySelector("#view-challenge")?.classList.contains("is-hidden")',
      '390x844 Challenge tab visible'
    );
    const iphoneChalOverflow = await cdp.eval('document.documentElement.scrollWidth');
    assert.ok(
      iphoneChalOverflow <= 390,
      `Expected zero horizontal overflow on 390x844 Challenge, got scrollWidth=${iphoneChalOverflow}`
    );

    // Tablet (768x1024)
    await cdp.setViewport(768, 1024, false);
    await cdp.navigate(`${baseUrl}/`);
    await cdp.waitFor('document.querySelector("#answer-start-drill-btn")', '768x1024 hero ready');
    const tabletOverflow = await cdp.eval('document.documentElement.scrollWidth');
    assert.ok(
      tabletOverflow <= 768,
      `Expected zero horizontal overflow on 768x1024 tablet, got scrollWidth=${tabletOverflow}`
    );

    // Friendly 404 recovery on /c/nonexistent-999
    await cdp.setViewport(390, 844, true);
    await cdp.navigate(`${baseUrl}/c/nonexistent-999`);
    await cdp.waitFor(
      '(document.querySelector("#view-drill .eyebrow")?.textContent || "").includes("404 • CHALLENGE")',
      '404 • CHALLENGE recovery screen'
    );

    const notFoundState = await cdp.eval(`(() => ({
      eyebrow: document.querySelector('#view-drill .eyebrow')?.textContent?.trim() || '',
      heading: document.querySelector('#view-drill h1')?.textContent?.trim() || '',
      bodyText: document.querySelector('#view-drill')?.textContent || '',
      scrollWidth: document.documentElement.scrollWidth,
      buttons: Array.from(document.querySelectorAll('#view-drill button')).map((b) => ({
        text: (b.textContent || '').trim(),
        height: b.getBoundingClientRect().height
      }))
    }))()`);

    assert.equal(notFoundState.eyebrow, '404 • CHALLENGE');
    assert.equal(notFoundState.heading, 'CHALLENGE LINK NOT FOUND');
    assert.ok(notFoundState.scrollWidth <= 390, `Expected <=390px overflow on 404 view, got ${notFoundState.scrollWidth}`);
    assert.ok(notFoundState.buttons.some((b) => b.text.includes('START 60s DRILL') && b.height >= 44));
    assert.ok(notFoundState.buttons.some((b) => b.text.includes('CREATE NEW CHALLENGE') && b.height >= 44));

    // Verify recovery CTA navigates back to working 60s drill hero
    await cdp.clickByText('#view-drill button', 'START 60s DRILL');
    await cdp.waitFor('document.querySelector("#answer-start-drill-btn")', 'Recovered to fresh 60s drill hero');

    assert.deepEqual(
      cdp.consoleErrors,
      [],
      `Expected zero browser console errors, observed: ${JSON.stringify(cdp.consoleErrors)}`
    );
    assert.deepEqual(
      cdp.pageExceptions,
      [],
      `Expected zero uncaught page exceptions, observed: ${JSON.stringify(cdp.pageExceptions)}`
    );
  });
});
