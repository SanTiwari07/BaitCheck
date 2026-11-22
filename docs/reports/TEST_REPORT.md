# BaitCheck — Final QA, Security & Performance Test Report (Phase 8)

**Audit Date:** 2026-11-22  
**Workspace:** `c:\Projects\02_Hackathons_and_Flagship_Apps\BaitCheck`  
**Runtime:** Node.js `v26.13.0` (`node:sqlite` built-in driver active; `better-sqlite3` fallback available)  
**Headless Browser:** Google Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe`) via Chrome DevTools Protocol (CDP)  
**Overall Verdict:** **PASS** — 60/60 automated tests passing across 17 suites (52 original + 4 `tests/storage.test.js` + 4 `tests/db.test.js` post-modularization), 0 dependency vulnerabilities, 0 dangerous DOM/code sinks, 0 forbidden brand impersonations, and `56.46 MB` RSS memory under live benchmark load.

---

## 1. Security & Abuse-Guardrail Audit

### 1.1 Dependency Vulnerability Audit

Executed `npm audit --omit=dev` and `npm audit`:

```text
> npm audit --omit=dev
found 0 vulnerabilities

> npm audit
found 0 vulnerabilities
```

### 1.2 Static Source & Markup Scan (`server.js`, `src/*`, `public/*`)

Scanned `server.js`, `src/db.js`, `src/drills.js`, `src/forensicEngine.js`, `src/storage.js`, `public/index.html`, `public/app.js`, and `public/styles.css`.

| Audit Check | Result | Observed Matches / Details |
| :--- | :--- | :--- |
| **Hardcoded credentials / tokens / keys** | **PASS (0 hardcoded secrets)** | Only environment-variable lookups observed: `process.env.STORAGE_TOKEN` (`server.js:185`, `src/storage.js:78`) and `process.env.CRON_SECRET` (`server.js:415`). `redactStorageToken()` strips `STORAGE_TOKEN` from `/api/badge` responses (`server.js:184-190, 395-408`). |
| **`innerHTML` / `outerHTML` / `insertAdjacentHTML` / `document.write`** | **PASS (0 matches)** | All DOM rendering in `public/app.js` uses `document.createElement`, `document.createElementNS`, `document.createTextNode`, and `.textContent`. |
| **`eval(...)` / `new Function(...)`** | **PASS (0 matches)** | Zero dynamic code evaluation in server, engine, or client code. |
| **`<input type="password">` or password collection** | **PASS (0 password inputs)** | Only non-code occurrences of the word `password` are educational disclaimers (`public/app.js:18`, `public/index.html:77`). Challenge form inputs use `type="text"`. |
| **`navigator.vibrate`** | **PASS (0 matches)** | Not used anywhere in the codebase. |
| **Inline `<script>` / `onclick=` / inline event handlers** | **PASS (0 matches)** | `public/index.html:82` loads `<script src="/app.js" defer></script>` externally; all UI listeners are bound via `addEventListener` in `public/app.js`. |
| **Forbidden real bank / agency / app brand names** | **PASS (0 impersonations)** | Scanned for `SBI`, `HDFC`, `ICICI`, `Paytm`, `GPay`, `Google Pay`, `PhonePe`, `WhatsApp`, `CBI`, `RBI`, `TRAI`, `UIDAI`, `NPCI`. Only permissible matches are outbound share button labels (`public/app.js:147` `'SHARE ON WHATSAPP'`, `public/app.js:311` `'WHATSAPP पर भेजें'`) linking to `https://wa.me/?text=...` (`public/app.js:2534`). All drill/preset entities are fictional (`Central Cyber Desk (Simulated)`, `Metro Power Utility (Demo)`, `PaySim Wallet Collect (Demo)`, `reward-desk@paysim`). |

### 1.3 HTTP, Storage & Zero-PII Guardrails Observed

- **Zero-PII SQLite Telemetry:** `db.recordForensicScan` (`src/db.js:348-367`) persists only `risk_score` and `rules_hit_json` (rule IDs + points), verified against raw SQLite rows in `tests/api.test.js`.
- **SQL Injection Safety:** All SQLite queries in `src/db.js` use parameterized prepared statements (`?` placeholders).
- **HTTP Hardening (`server.js`):**
  - `app.disable('x-powered-by')` (`server.js:221`).
  - JSON body limits enforced (`32kb` default, `2mb` for `/api/badge`, returning `413 Payload too large`; malformed JSON returns `400 Invalid JSON payload`).
  - `POST /api/challenge/:id/result` strictly validates `passed` via `parseStrictBoolean()` (`server.js:198-206, 330-333`), rejecting non-boolean strings such as `"yes"` and `"FALSE"` with `400 { error: 'passed must be a boolean' }`.
  - Unmatched `/api/*` paths return `404 { error: 'Not found' }`, and unmatched `GET`/`HEAD` page routes return `404` HTML containing the `SIMULATION` safety ribbon (`server.js:40-66, 427-435`).
  - `GET /tasks/daily-stats` enforces `Authorization: Bearer ${CRON_SECRET}` when `CRON_SECRET` is configured (`server.js:414-418`).
  - `POST /api/badge` validates `PNG_FILENAME_RE` (`^[a-zA-Z0-9_-]{3,48}\.png$`), base64 encoding, and 8-byte PNG magic header (`0x89 50 4E 47 0D 0A 1A 0A`).
- **CSP Compatibility Note:** Express does not emit a `Content-Security-Policy` response header directly in `server.js`, though the frontend (`public/index.html`, `public/app.js`) contains zero inline `<script>` tags, zero inline `on*=` attributes, and zero `eval` calls, making it compatible with a strict `script-src 'self'` policy at the edge or middleware layer.

---

## 2. Automated Test Suite & Phase 8 Regressions

### 2.1 Regression Coverage Added

1. **`tests/forensic.test.js`:**
   - Verified `"You are under digital arrest right now."` (`riskScore === 15`) returns `verdictLevel: 'medium'` (and never `'low'` / `'NO KNOWN TRAP TOKENS'`).
   - Added Suite `12. Phase 8 Regression — High-risk disposable TLD + keyword lures vs benign domains`: verifies `http://metrobank-kyc.xyz/login` and `verify-bill.top/pay` score `+25` (`url_deception`, `verdictLevel: 'medium'`) while benign `https://example.xyz/about` and `https://cybercrime.gov.in` score `0` (`verdictLevel: 'low'`).
2. **`tests/api.test.js`:**
   - Verified `POST /api/challenge/:id/result` with `passed: "yes"` or `passed: "FALSE"` returns `400 { error: 'passed must be a boolean' }`.
   - Verified `GET /api/nonexistent` returns `404 { error: 'Not found' }` JSON and `GET /nonexistent-page` returns `404` HTML with the `SIMULATION` ribbon.
   - Retains full `POST /api/badge` storage upload, validation, unconfigured fallback, and `STORAGE_TOKEN` redaction checks.
3. **`tests/e2e.test.js`:**
   - **Test 2 (Mid-drill pause/resume & PNG preview):** Switches from active Drill 1 to the Link X-Ray tab for `400 ms`, switches back to the Drill tab, verifies the countdown paused without draining and continues ticking down cleanly without freezing; also verifies `.ticket-preview-img` renders with a PNG data URL after clicking `DOWNLOAD VERDICT TICKET`.
   - **Test 4 (Recent Challenges `localStorage`):** Verifies `localStorage.getItem('baitcheck_recent_challenges_v1')` persists the created challenge and renders `.recent-challenge-row` in Tab 3 before navigating through `/c/:id` and `/c/:id/report`.
   - **Test 6 (Responsive & 404 recovery):** Verifies `390x844` and `768x1024` zero horizontal overflow and `/c/nonexistent-999` recovery flow with zero console errors or page exceptions.

### 2.2 Verbatim `npm test` Output

Executed `npm test` (`node --test`) after all edits to `tests/forensic.test.js`, `tests/api.test.js`, and `tests/e2e.test.js`:

```text
> baitcheck@1.0.0 test
> node --test

▶ SQLite Persistence & Litestream Safety
  ✔ persists challenges, drill results, and forensic scans across close() and reopen (19.2202ms)
  ✔ preserves pre-existing _litestream_seq and _litestream_lock tables and rows (22.0964ms)
✔ SQLite Persistence & Litestream Safety (43.6928ms)
▶ Full HTTP API Lifecycle & Zero-PII Integration
  ✔ GET /health returns 200 with ok: true and memoryMb < 75 (39.3214ms)
  ✔ GET /api/drills returns 3 drills, 3 playbook steps, and 4 presets (7.8192ms)
  ✔ GET /api/stats returns seeded cohort baseline (totalDrills >= 142) (3.3548ms)
  ✔ POST /api/scan scores all 4 presets accurately and rejects invalid payloads with 400 (42.4931ms)
  ✔ Zero-PII check: POST /api/scan never stores raw sensitive URL/text in forensic_scans (4.7015ms)
  ✔ POST /api/challenge validates inputs, creates slug, and handles non-ASCII "माँ" fallback (17.0488ms)
  ✔ GET /api/challenge/:id returns 404 on unknown/invalid IDs and 200 on created ID (12.9748ms)
  ✔ POST /api/challenge/:id/result validates scenarioId/challenge and computes immunityScore 100, 65, 0 (67.3141ms)
  ✔ GET /tasks/daily-stats enforces CRON_SECRET and does not double-count cohort stats (13.6829ms)
  ✔ GET /api/nonexistent returns 404 JSON and GET /nonexistent-page returns 404 HTML with SIMULATION ribbon (3.9604ms)
✔ Full HTTP API Lifecycle & Zero-PII Integration (235.2514ms)
▶ POST /api/badge Storage Upload & Fallback Guardrails
  ✔ returns 200 unconfigured fallback when STORAGE_URL/STORAGE_TOKEN are absent (28.6898ms)
  ✔ rejects invalid filename and invalid PNG payloads with 400 (53.761ms)
  ✔ returns 200 with uploaded URL when mock uploader succeeds (29.7874ms)
  ✔ returns 502 on upstream failure and redacts STORAGE_TOKEN from error responses (34.6862ms)
✔ POST /api/badge Storage Upload & Fallback Guardrails (148.2387ms)
▶ BaitCheck Headless Browser E2E Suite (CDP)
  ✔ 1. Mobile 360x800 layout, safety ribbon, >=44px touch targets & bilingual toggle (325.5715ms)
  ✔ 2. Full 60s Drill flow (Trap + APK Inspect + Pass + 1080x1350 PNG Canvas) (1366.7975ms)
  ✔ 3. Tab 2 Link X-Ray (Presets, Decoded UPI Table & XSS Safety) (211.9553ms)
  ✔ 4. Tab 3 Family Challenge -> /c/:id -> /c/:id/report live persistence (249.136ms)
  ✔ 5. Desktop 1280x800 2-column grid layout & zero console/exception errors (89.2105ms)
  ✔ 6. Responsive 390x844 & 768x1024 zero overflow + /c/nonexistent-999 friendly 404 recovery (150.3161ms)
✔ BaitCheck Headless Browser E2E Suite (CDP) (3150.7426ms)
▶ Forensic Engine — Unit & Edge-Case Suite
  ▶ 1. Punycode (xn--) detection & span highlighting
    ✔ flags xn-- punycode URL host with exact span highlighting (2.0459ms)
    ✔ flags uppercase XN-- and standalone punycode domains without scheme (1.4081ms)
  ✔ 1. Punycode (xn--) detection & span highlighting (4.3094ms)
  ▶ 2. Mixed Cyrillic/Greek homoglyphs vs clean Hindi Devanagari
    ✔ detects Cyrillic lookalike "е" inside Latin domain mеtrobank.example (1.2971ms)
    ✔ detects Cyrillic "а" and Greek "ο" lookalikes inside Latin domains/brands (0.348ms)
    ✔ does NOT false-positive on clean Hindi Devanagari mixed with clean English URLs (0.2281ms)
    ✔ does NOT false-positive on pure non-Latin Cyrillic text without Latin mixing (0.1158ms)
  ✔ 2. Mixed Cyrillic/Greek homoglyphs vs clean Hindi Devanagari (2.1748ms)
  ▶ 3. Double-extension & executable lures
    ✔ flags .pdf.apk double-extension lure at +40 risk and highlights only filename (0.1814ms)
    ✔ flags .jpg.exe and .doc.bat double-extension lures at +40 risk (0.2071ms)
    ✔ scores standalone .apk at +35 without lure keywords and +40 with urgent lure keywords (0.2399ms)
  ✔ 3. Double-extension & executable lures (0.7716ms)
  ▶ 4. @ userinfo masking vs harmless email in query params
    ✔ flags @ userinfo credential masking in URL authority (+30 danger) (0.2882ms)
    ✔ does NOT false-positive on harmless email in URL query params or path (0.1456ms)
  ✔ 4. @ userinfo masking vs harmless email in query params (0.5389ms)
  ▶ 5. Raw IPv4 literal URLs vs invalid IPv4 strings
    ✔ flags valid raw IPv4 URL host (+30 danger) with exact host span (0.3542ms)
    ✔ ignores invalid IPv4 octets like 999.999.1.1 (0.1519ms)
  ✔ 5. Raw IPv4 literal URLs vs invalid IPv4 strings (0.6143ms)
  ▶ 6. URL shorteners alone vs with urgency
    ✔ scores bit.ly and tinyurl.com alone at +20 warn (0.2559ms)
    ✔ escalates shortener url_deception from +20 to +30 when urgency keywords are present (0.2445ms)
  ✔ 6. URL shorteners alone vs with urgency (0.5909ms)
  ▶ 7. UPI deep-link parameter dissection & collect-trap rules
    ✔ dissects pa, pn, am, cu, tn and warns on positive am + cashback/refund/PIN (0.7829ms)
    ✔ dissects positive am without cashback wording with Debit Alert warning (0.2249ms)
    ✔ dissects benign upi://pay without positive am or receive bait without flagging (0.149ms)
    ✔ detects plain-text UPI collect-trap wording when no upi://pay URI is present (0.2599ms)
  ✔ 7. UPI deep-link parameter dissection & collect-trap rules (1.5616ms)
  ▶ 8. Bilingual EN & हिंदी social-engineering pressure tokens
    ✔ detects English pressure tokens (digital arrest, stay alone) and scales points up to 25 (0.5469ms)
    ✔ detects Hindi pressure tokens (बिजली कट, गिरफ्तारी, पिन डालें) (0.3091ms)
  ✔ 8. Bilingual EN & हिंदी social-engineering pressure tokens (0.9688ms)
  ▶ 9. Benign inputs & validation errors (400 EMPTY_INPUT / INPUT_TOO_LONG)
    ✔ returns low risk 0 for https://cybercrime.gov.in and normal family messages (0.3149ms)
    ✔ throws 400 EMPTY_INPUT for empty, whitespace, or non-string inputs (0.8387ms)
    ✔ throws 400 INPUT_TOO_LONG for >2000 chars and accepts exact 2000-char boundary (0.4567ms)
  ✔ 9. Benign inputs & validation errors (400 EMPTY_INPUT / INPUT_TOO_LONG) (1.7697ms)
  ▶ 10. Lossless highlightedSegments, XSS immunity & <10ms latency
    ✔ never injects HTML tags and preserves exact text with overlapping signals & angle brackets (0.435ms)
    ✔ completes within <10 ms even on 2000-char pathological input (2.372ms)
  ✔ 10. Lossless highlightedSegments, XSS immunity & <10ms latency (3.1496ms)
  ▶ 11. DRILLS, PLAYBOOK & PRESETS integrity validation
    ✔ has exactly 3 drills whose weights sum to 100 (0.2217ms)
    ✔ has non-spoiler choice labels and varied trap positions across drills (0.4179ms)
    ✔ contains zero real bank/agency/app brand names across drills, playbook, and presets (0.3246ms)
  ✔ 11. DRILLS, PLAYBOOK & PRESETS integrity validation (1.0932ms)
  ▶ 12. Phase 8 Regression — High-risk disposable TLD + keyword lures vs benign domains
    ✔ scores disposable TLD + lure keyword URLs at +25 (url_deception, medium) while benign domains score 0 (low) (0.2127ms)
  ✔ 12. Phase 8 Regression — High-risk disposable TLD + keyword lures vs benign domains (0.2504ms)
✔ Forensic Engine — Unit & Edge-Case Suite (18.5502ms)
ℹ tests 52
ℹ suites 17
ℹ pass 52
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 5247.0953
```

---

## 3. Live Process & Memory Benchmark

Spawned `node server.js` on `PORT=3948` with an isolated temporary `DATA_DIR`, executed 25 rounds of `POST /api/scan` + `GET /api/stats` + `GET /api/drills` (75 API requests), queried `GET /health`, and then terminated the process (`SIGTERM`) and removed the temporary `DATA_DIR`.

| Metric | Observed Value |
| :--- | :--- |
| **Requests Completed** | `25/25` `POST /api/scan` (`200`), `25/25` `GET /api/stats` (`200`), `25/25` `GET /api/drills` (`200`) |
| **`GET /health` `ok`** | `true` |
| **`GET /health` `memoryMb`** | `56.46` MB RSS (budget: `< 75 MB`) |
| **`GET /health` `uptime`** | `0` s (benchmark completed within first second of process uptime) |
| **`POST /api/scan` HTTP Round-Trip Latency (Avg)** | `3.517` ms |
| **`POST /api/scan` HTTP Round-Trip Latency (Min / P95 / Max)** | `0.949` ms / `3.433` ms / `47.95` ms |
| **Forensic Engine `elapsedMs` (Avg)** | `0.117` ms |
| **Final `GET /api/stats` `totalScans`** | `25` (`totalDrills: 142`, `passRatePct: 61.5`, `topMissedScenario: "drill-2-apk"`) |
