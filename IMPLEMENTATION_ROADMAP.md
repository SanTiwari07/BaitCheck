# BaitCheck — Prioritized Implementation Roadmap

**Last Updated:** 22 November 2026  
**Target Architecture:** Single-process Node.js (`0.0.0.0:$PORT`, `<60 MB` RSS), SQLite in `DATA_DIR`, self-contained Bill-Poster SPA in `public/`.

---

## Priority 1: Critical Functionality (Hackathon & Core Requirements)

### Feature 1.1: Project Runtime Scaffold, Embarko Config & Health Endpoint
- **Objective:** Establish the root Node.js server manifest, Embarko deployment configuration, Git hygiene, and `/health` endpoint compliant with Embarko's 256 MB RAM and no-Dockerfile constraints.
- **User Benefit:** Ensures instant cold starts, deterministic `0.0.0.0:$PORT` binding, and verifiable uptime/memory telemetry.
- **Frontend Changes:** Placeholder/minimal static route serving from `public/`.
- **Backend Changes:** Create `package.json`, `embarko.json`, `server.js` (`GET /health`, static serving, SPA fallback for `/c/:id` & `/c/:id/report`), `.gitignore`.
- **Database Changes:** None yet.
- **Dependencies:** Node 20+ (verify `better-sqlite3` or built-in SQLite compatibility).
- **Acceptance Criteria:**
  - `server.js` binds `0.0.0.0` and `process.env.PORT || 3000`.
  - `GET /health` returns `{ ok: true, memoryMb, uptime }` with HTTP 200 and RSS `<75 MB`.
  - `embarko.json` declares `/tasks/daily-stats` schedule (`0 9 * * *`, `Asia/Kolkata`).
- **Test Cases:** Health endpoint returns 200 + numeric `memoryMb` < 75; `/c/demo` and `/c/demo/report` return HTML 200.
- **Completion Status:** Completed and verified

### Feature 1.2: Persistent SQLite Database Layer (`src/db.js`) & Cohort Stats API
- **Objective:** Implement idempotent SQLite persistence in `DATA_DIR/baitcheck.db` preserving Litestream tables and storing zero PII.
- **User Benefit:** Family challenge links, drill scores, and anonymized cohort stats survive app restarts and redeploys.
- **Frontend Changes:** None (consumed by API).
- **Backend Changes:** `src/db.js` schema initialization (`family_challenges`, `drill_results`, `forensic_scans`, `daily_stats`), seed baseline `daily_stats`, query helpers, `GET /api/stats`, `GET /tasks/daily-stats` (with `Bearer $CRON_SECRET` 401 guard).
- **Database Changes:** All 4 tables created with `CREATE TABLE IF NOT EXISTS`; zero modifications to `_litestream_seq` / `_litestream_lock`.
- **Dependencies:** Feature 1.1.
- **Acceptance Criteria:**
  - Database opens in `process.env.DATA_DIR || ./data/baitcheck.db`.
  - `_litestream_*` tables preserved if present.
  - `daily_stats` seeded on empty first boot.
  - `/tasks/daily-stats` rejects missing/bad `Authorization` header with `401` when `CRON_SECRET` is set.
- **Test Cases:** DB persistence across restart; cron auth 401 vs 200; baseline stats non-zero; zero PII fields stored.
- **Completion Status:** Completed and verified

### Feature 1.3: Deterministic Forensic Engine (`src/forensicEngine.js`) & `POST /api/scan`
- **Objective:** Implement `<10 ms` deterministic forensic dissection of URLs, messages, `.apk` lures, and `upi://pay?` strings without external APIs.
- **User Benefit:** Anyone can paste a suspicious WhatsApp message, URL, or UPI link (or tap 4 sample presets) and immediately see risk score `0–100`, decoded UPI fields, and highlighted red-flag tokens.
- **Frontend Changes:** None in this step (API + tests first).
- **Backend Changes:** `src/forensicEngine.js` implementing all 6 rule families (Punycode `xn--` & Cyrillic/Greek homoglyphs `+35`, double-extension/APK lures `+40`, `@`-mask/IPv4/shorteners `+30`, `upi://pay?` parameter dissector & collect mismatch `+30`, bilingual urgency/isolation/KYC tokens `+15–25`, 2000-char limit & safe token spans), wired to `POST /api/scan` logging only `risk_score` and `rules_hit_json` to `forensic_scans`.
- **Database Changes:** Writes anonymized rows to `forensic_scans`.
- **Dependencies:** Feature 1.2.
- **Acceptance Criteria:**
  - Executes in `<20 ms` (`<10 ms` target).
  - Detects Punycode, mixed-script Cyrillic/Greek homoglyphs, `.pdf.apk`, `@` userinfo spoofing, raw IPv4, shorteners with urgency, `upi://pay?` debit parameters, and EN/हिंदी pressure phrases.
  - Rejects empty or >2000 char input cleanly (or truncates/validates with HTTP 400).
  - Returns safe non-HTML spans/tokens for XSS-safe rendering.
- **Test Cases:** `tests/forensic.test.js` covering 20+ malicious and benign inputs, edge cases, and latency.
- **Completion Status:** Completed and verified

### Feature 1.4: Bilingual Drills Data (`src/drills.js`) & Challenge REST APIs
- **Objective:** Implement bilingual EN/हिंदी drill scripts, non-spoiler choices, and challenge creation/result/report REST endpoints.
- **User Benefit:** Enables the 60-second panic drill and shareable `/c/:id` family/friend tests with live `/c/:id/report` updates.
- **Frontend Changes:** None in this step.
- **Backend Changes:** `src/drills.js` (Drills 1–3 in EN + हिंदी + 1930 Golden-Hour playbook + 4 X-Ray presets), `POST /api/challenge`, `GET /api/challenge/:id`, `POST /api/challenge/:id/result`.
- **Database Changes:** Reads/writes `family_challenges` and `drill_results` (accepting `target_label` or `parent_label`).
- **Dependencies:** Feature 1.2.
- **Acceptance Criteria:**
  - Strictly fictional entities (`Central Cyber Desk (Simulated)`, `Metro Power Utility (Demo)`, `PaySim Wallet Collect (Demo)`).
  - Choices do not spoil correct answers; weights sum to 100 (`35 + 35 + 30`).
  - Input validation prevents XSS/empty slugs and rejects unknown `challenge_id` with 404.
- **Test Cases:** API integration tests for creating challenges, recording 3 drill results, verifying reaction_ms bounds, and reading report aggregations.
- **Completion Status:** Completed and verified

---

## Priority 2: Essential Functionality (Complete End-to-End Product)

### Feature 2.1: Bill-Poster Design System & Instant Mobile Shell (`Screen 0` + Navigation)
- **Objective:** Build `public/index.html` and `public/styles.css` implementing `design.md` tokens, permanent `SIMULATION` ribbon, top nav, `EN | हिंदी` toggle, 3-tab switcher, and Screen 0 Incoming Call hero.
- **User Benefit:** First-time visitors immediately see what BaitCheck does in 2 seconds on a smartphone (`360×800`) with zero login wall.
- **Frontend Changes:** `public/index.html`, `public/styles.css`, initial `public/app.js` shell, tab routing, language toggle, and CSP-compliant event binding (zero inline `onclick`).
- **Backend Changes:** None.
- **Database Changes:** None.
- **Dependencies:** Feature 1.1.
- **Acceptance Criteria:**
  - Permanent sticky yellow `SIMULATION • EDUCATIONAL SCAM DRILL — NO REAL DATA, OTPs, OR DOWNLOADS` ribbon.
  - Zero horizontal scroll at `360×800`, `390×844`, tablet, and desktop.
  - All touch targets `>=44px` (`>=48px` primary CTAs).
  - Exact Bill-Poster palette (`#FEC917`, `#0D0D0D`, `#161616`, `#F2EFE7`), `0px` radii, condensed `Archivo Narrow` display type.
- **Test Cases:** Browser viewport tests at `360×800` and `1280×800`, verifying zero horizontal overflow and zero console/CSP errors.
- **Completion Status:** Pending

### Feature 2.2: 60-Second Interactive Panic Drill Runner, WebAudio & Finale
- **Objective:** Implement tap-to-unlock WebAudio `AudioContext`, optional `speechSynthesis` (`en-IN`/`hi-IN`), 15s countdown bar, Drills 1–3 interactive screens, `-₹50,000` simulated loss debrief, Immunity % finale, and `1930` Golden-Hour swatch playbook.
- **User Benefit:** Tactile 60s survival training that works muted or unmuted on iOS Safari and Android Chrome with `>=18px` bilingual captions.
- **Frontend Changes:** Full drill state machine, WebAudio synthesizer (ring/tick/alert/success tones), CSS keyframes pulse (no `navigator.vibrate`), non-downloadable `.pdf.apk` pill modal/feedback, split-flap finale counters, 3-step `1930` accordion/swatch cards.
- **Backend Changes:** Consumes `GET /api/stats` and `POST /api/challenge/:id/result` when running under `/c/:id`.
- **Database Changes:** Persists drill outcomes when opened via challenge link.
- **Dependencies:** Features 1.4, 2.1.
- **Acceptance Criteria:**
  - Zero `<input type="password">`, OTP, PIN pad, real brand logos, or file downloads.
  - Measures accurate `reaction_ms` per drill; handles timer expiry (`0.0s`) gracefully as missed/timed-out.
  - Updates cleanly in both `EN` and `हिंदी`.
- **Test Cases:** End-to-end drill playthrough (all-pass, all-trap, timeout, `/c/:id` persistence) in headless browser.
- **Completion Status:** Pending

### Feature 2.3: Forensic Link, Message & UPI X-Ray Workbench (`Tab 2`)
- **Objective:** Wire Tab 2 UI to `POST /api/scan` with 4 one-tap real-world presets, `0–100` risk meter, itemized X-Ray verdict cards, decoded UPI table, and XSS-safe inline red/amber token highlighting.
- **User Benefit:** One-tap proof of deterministic forensic utility for judges and everyday users checking suspicious WhatsApp/SMS links.
- **Frontend Changes:** X-Ray form, 4 preset chips, loading/error/empty states, safe DOM-node token highlighter (`textContent`, never raw `innerHTML`), UPI breakdown card.
- **Backend Changes:** Uses `POST /api/scan`.
- **Database Changes:** Logs anonymized scan metrics.
- **Dependencies:** Features 1.3, 2.1.
- **Acceptance Criteria:**
  - All 4 presets populate and scan cleanly in `<100ms` UI roundtrip.
  - XSS payloads like `<script>alert(1)</script>` render safely as escaped text.
  - Clear error state on empty or oversized input.
- **Test Cases:** Preset scans, custom UPI/homoglyph/APK scan, XSS payload safety test in browser.
- **Completion Status:** Pending

### Feature 2.4: Shareable Family Challenge Creator & Live Readiness Report (`Tab 3`, `/c/:id`, `/c/:id/report`)
- **Objective:** Enable creating named challenge links (zero PII), sharing/copying URL + WhatsApp share text, running `/c/:id` drills for a recipient, and live-polling `/c/:id/report` every 4 seconds.
- **User Benefit:** Turns BaitCheck into a real family viral loop where kids test parents/friends and see which exact scam fooled them.
- **Frontend Changes:** Tab 3 creator form, shareable link card (copy button + report link), `/c/:id` recipient banner (`"Challenge from X for Y"`), `/c/:id/report` readiness sheet with 4s polling (`setInterval` cleared on unmount/completion) and per-drill status.
- **Backend Changes:** Uses `POST /api/challenge`, `GET /api/challenge/:id`, `POST /api/challenge/:id/result`.
- **Database Changes:** Full challenge + drill result lifecycle.
- **Dependencies:** Features 1.4, 2.2.
- **Acceptance Criteria:**
  - Nickname validation (no empty strings; advisory reminder not to enter phone numbers).
  - `/c/:id/report` updates live within 4s after `/c/:id` drill completion without WebSockets.
  - Unknown `/c/invalid-id` displays clean 404/empty state with CTA back to home drill.
- **Test Cases:** E2E multi-step journey: create challenge -> open `/c/:id` -> complete 3 drills -> open `/c/:id/report` -> verify exact scores and reaction times rendered.
- **Completion Status:** Pending

---

## Priority 3: UI/UX Improvements & Canvas Verdict Ticket

### Feature 3.1: Downloadable `1080×1350` Canvas Verdict Ticket PNG & Optional Storage Upload (`src/storage.js`)
- **Objective:** Render a high-craft perforated Bill-Poster `1080×1350` Verdict Ticket PNG on HTML5 Canvas for download/share, plus optional `POST /api/badge` upload to Embarko `STORAGE_URL` when configured.
- **User Benefit:** Gives users and video creators a shareable visual artifact (`baitcheck.embarko.app` stamped) after completing the 60s drill.
- **Frontend Changes:** Canvas renderer in `public/app.js` matching `design.md` typography/colors, download PNG button, share/save status feedback.
- **Backend Changes:** `src/storage.js` + `POST /api/badge` (cleanly returns graceful fallback message if `STORAGE_URL` / `STORAGE_TOKEN` env vars are absent).
- **Database Changes:** None.
- **Dependencies:** Feature 2.2.
- **Acceptance Criteria:**
  - Generates valid `1080×1350` PNG blob (`image/png`) client-side without external image tainting.
  - Works 100% offline/locally via browser download even when `STORAGE_URL` is unset.
- **Test Cases:** Verify Canvas dimensions (`1080×1350`), non-empty PNG output, and `/api/badge` handling with/without env vars.
- **Completion Status:** Pending

### Feature 3.2: UI/UX Polish, Responsive Desktop Grid & Accessibility Audit
- **Objective:** Refine tablet/desktop `>=1024px` split view (interactive stage + live cohort/1930 sidebar), keyboard accessibility, ARIA labels, focus outlines, and cohort split-flap counter section.
- **User Benefit:** Looks crisp on both mobile judges' phones and desktop showcase screens.
- **Frontend Changes:** `public/styles.css` media queries (`720px`, `1024px`, `1400px`), ARIA live regions for captions & timer alerts, keyboard navigation across tabs & choices.
- **Backend Changes:** None.
- **Database Changes:** None.
- **Dependencies:** Features 2.1–3.1.
- **Acceptance Criteria:**
  - `360×800`, `390×844`, `768×1024`, and `1280×800` all pass layout & overflow checks.
  - Zero missing `alt`/ARIA labels on buttons and interactive elements.
- **Test Cases:** Multi-viewport Playwright/Chrome headless screenshot & DOM audit.
- **Completion Status:** Pending

---

## Priority 4: Reliability, Security & Performance Hardening

### Feature 4.1: Full-Stack Integration Tests, Security Audit & Memory/Latency Verification
- **Objective:** Build comprehensive unit, API integration, and browser E2E tests; verify `<60 MB` RSS memory, `<20 ms` `/api/scan`, CSP compliance, XSS safety, and zero hardcoded secrets.
- **User Benefit:** Guarantees zero crashes, zero 502s under Embarko's 256 MB cap, and total reliability during judging.
- **Frontend Changes:** Fix any edge-case UI/console errors discovered.
- **Backend Changes:** Request rate/size safeguards, graceful shutdown, strict JSON error handlers.
- **Database Changes:** Verify WAL/journal safety with Litestream compatibility.
- **Dependencies:** Priority 1–3.
- **Acceptance Criteria:**
  - All automated unit, integration, and E2E tests pass 100%.
  - Idle & post-load RSS `<60 MB` (strictly `<75 MB`).
  - Zero console errors, zero failed network requests during normal journeys.
- **Test Cases:** `tests/forensic.test.js`, `tests/api.test.js`, `tests/e2e.test.js`, memory benchmark.
- **Completion Status:** Pending

---

## Priority 5: Demo Readiness & Final Evaluation

### Feature 5.1: First-Time User Experience, `DEMO_GUIDE.md`, `TEST_REPORT.md` & Judge Evaluation
- **Objective:** Validate first-time user clarity, write `DEMO_GUIDE.md` and `TEST_REPORT.md`, run strict independent Hackathon Judge evaluation (scoring all 9 criteria 1–10), and remediate any score `<8`.
- **User Benefit:** Anyone opening BaitCheck for the first time understands it in 2 seconds and can demo all features reliably.
- **Frontend Changes:** Any copy/UX micro-improvements flagged by judge audit.
- **Backend Changes:** None unless judge audit finds gaps.
- **Database Changes:** Pre-seeded realistic cohort baseline.
- **Dependencies:** Priority 4.
- **Acceptance Criteria:**
  - All 9 evaluation scores `>=8` or documented/fixed.
  - All completion criteria in Phase 10 checked off and verified.
- **Test Cases:** Complete cold-start fresh-browser walkthrough following `DEMO_GUIDE.md`.
- **Completion Status:** Pending
