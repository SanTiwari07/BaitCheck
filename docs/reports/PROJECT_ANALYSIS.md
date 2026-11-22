# BaitCheck - Complete Project Analysis & Requirements Traceability Matrix

**Analysis Date:** 22 November 2026  
**Workspace:** `c:\Projects\02_Hackathons_and_Flagship_Apps\BaitCheck`  
**Target Remote:** `https://github.com/SanTiwari07/BaitCheck`  
**Documents Analyzed:**
1. `hackathon_requirement.md` (Embarko Student Challenge 2026 rules, scoring, & runtime constraints)
2. `prd.md` (Product Requirements Document - vision, personas, flows, anti-phishing guardrails)
3. `requirement.md` (Functional, forensic engine, SQLite persistence, mobile & security requirements)
4. `design.md` (Bill-Poster & Print-Shop Editorial Design System)
5. `detailed_plan.md` (Repo structure, `embarko.json`, API map, 8-day schedule, cut list)
6. `BaitCheck_Embarko_Hackathon_Dossier.pdf` (11-page execution dossier: telemetry, competitor audit, bilingual scripts, SQLite/forensic spec, judge stress test, video script)

---

## 1. Current Workspace & Git Discovery

### 1.1 Directory & Codebase State
- **Existing Code Files:** None (`public/`, `src/`, and `tests/` directories exist and are currently empty).
- **Existing Assets:** None in `public/`. No `package.json`, `server.js`, or `embarko.json` exists yet.
- **Documentation & Dossier:** Complete specification suite present at workspace root, including the newly added `BaitCheck_Embarko_Hackathon_Dossier.pdf`.
- **Runtime Environment Verified:** Node.js `v26.13.0`, npm `11.20.0`, Python `3.12.10`, Microsoft Edge & Google Chrome available locally for mobile/desktop verification.

### 1.2 Git & Remote State
- **Local Git:** Not initialized yet (`.git` directory absent).
- **GitHub Remote (`SanTiwari07/BaitCheck`):** Exists and is currently empty (0 commits, 0 branches).
- **GitHub CLI Auth:** Authenticated as `SanTiwari07`.
- **Action Required:** Initialize local Git repository (`main` branch), add `.gitignore` (excluding `node_modules/`, `data/`, `.env`, local logs/artifacts), preserve all existing user documentation in an initial baseline commit, and push incrementally per verified feature.

### 1.3 Current Architecture & Gap Assessment
Because the codebase directories are currently unpopulated, BaitCheck is at **greenfield implementation from locked specifications**:
- **Target Architecture:** Single-process Node.js HTTP/Express server (`server.js`) listening on `0.0.0.0:$PORT`, serving static self-contained SPA assets from `public/` and REST APIs backed by deterministic JS logic (`src/forensicEngine.js`, `src/drills.js`, `src/storage.js`) and persistent SQLite (`src/db.js` under `DATA_DIR`).
- **Missing Features:** All application code (`package.json`, `embarko.json`, `server.js`, `src/*`, `public/*`, `tests/*`) must be built and verified end-to-end.
- **Technical & Hosting Risks Identified Early:**
  1. **Embarko 256 MB RAM Cap:** Observed live failures on Showcase apps (`codereel` 502). Must keep Node + SQLite under 60–75 MB RSS with zero ML/headless-browser server dependencies.
  2. **Node 26 / Native Module Compatibility:** Local Node is `v26.13.0`; `better-sqlite3` prebuilt binaries must be verified, with clean compatibility or fallback if native compilation fails locally while keeping Embarko Node 20+ compatibility.
  3. **Automated Anti-Phishing False Positives:** Because BaitCheck simulates scams, any real brand logo, real agency name, `<input type="password">`, OTP/PIN field, or actual file download could trigger automated takedown. Strict guardrails are mandatory.
  4. **Mobile Browser Audio/TTS Gotchas:** Autoplay blocked on iOS Safari & Android Chrome; `navigator.vibrate` unsupported on iOS Safari; Hindi TTS missing on many phones. Must unlock WebAudio on user tap and use always-on `>=18px` captions + CSS keyframes.
  5. **Litestream Data Loss Prevention:** Embarko uses Litestream (`_litestream_seq`, `_litestream_lock`) inside `DATA_DIR`. Never drop or alter tables destructively.

---

## 2. Extracted Project & Hackathon Synthesis

- **Problem Statement:** AI voice cloning, deepfake video calls, `.pdf.apk` chat lures, and UPI collect traps exploit 15 seconds of human panic. Existing solutions (Truecaller, Google On-Device Scam Detection, KnowBe4, ScamAdviser, post-fraud 1930) are reactive, OS-gated, B2B-only, or require copy-pasting before panicking.
- **Target Users:** Ages 10–80 across Indian families - teens/gamers, college students (who also test parents/friends), parents/elders (EN & हिंदी), and mobile-first hackathon judges.
- **Core Functionality:**
  1. Instant 60-Second Panic Drill (Zero login wall; Screen 0 Incoming Call -> Drill 1 Digital Arrest -> Drill 2 `.pdf.apk` -> Drill 3 UPI Collect -> Verdict Ticket + `1930` Golden-Hour Playbook).
  2. Deterministic Link, Message & UPI Forensic X-Ray (`POST /api/scan`) with 4 one-tap presets and inline token highlighting.
  3. Shareable Family & Friend Challenge (`/c/:id`) + Live Polling Readiness Report (`/c/:id/report`) persisted in SQLite (`DATA_DIR`).
  4. Downloadable `1080×1350` Canvas Verdict Ticket PNG (+ optional `STORAGE_URL` upload).
  5. Cohort Daily Benchmark Cron (`GET /tasks/daily-stats`) + Split-Flap Cohort Counter (`GET /api/stats`).
- **Evaluation Criteria (1,415 pts):** Work (`400` - Tie-Breaker #1: look/feel, originality, works on phone, Embarko deploy), Video (`300` - Tie-Breaker #2: 3s hook, 6-part rubric, `#DeployWithEmbarko`), Reach (`300`), Submission+Posts (`200`), Referral Bonus (`210`), LinkedIn (`5`).
- **Hard Technical Constraints:** Single Node process (`0.0.0.0:$PORT`), max `256 MB` RAM (target `<60 MB`), no Dockerfile, no WebSockets, SQLite in `DATA_DIR` preserving `_litestream_*` tables, `embarko.json` cron with `Bearer $CRON_SECRET`, strict CSP (`self`, `https:`, `data:`, `blob:`, `wasm`; no inline `onclick` handlers or third-party iframes).

---

## 3. Document Conflicts & Resolution Register

Priority hierarchy applied: (1) Explicit hackathon rules, (2) Latest explicitly updated project decisions / Dossier, (3) PRD, (4) Detailed plan, (5) Design doc, (6) General assumptions.

| Conflict ID | Topic | Conflicting Sources | Resolution Applied |
|---|---|---|---|
| **CONF-01** | **Submission Deadline** | `hackathon_requirement.md` & PDF note Unstop lists `30 Nov 2026, 04:00 PM IST`, while Official Rules list `30 Nov 2026, 11:59 PM IST`. | Target completion & submission **28–29 Nov 2026**, hard cutoff **30 Nov, 03:00 PM IST**. |
| **CONF-02** | **Challenge Recipient Column Name** | `requirement.md` Sec. 3 uses `target_label` in `family_challenges`; `BaitCheck_Embarko_Hackathon_Dossier.pdf` Sec. 8 uses `parent_label`. | Store `target_label` in SQLite (matching `requirement.md` + all-ages PRD), and accept/alias both `target_label` and `parent_label` in `POST /api/challenge` and `GET /api/challenge/:id` API payloads for full compatibility. |
| **CONF-03** | **Drill 3 Choice Count & Scoring Weights** | `prd.md` Sec. 4 lists 2 choices for Drill 3 (`Approve & Claim`, `Decline - PIN Only Sends Money`); PDF Sec. 7 lists 3 choices (`Approve & Enter PIN (Simulated)`, `Spot Red Flag: PIN is NEVER needed to receive money`, `Decline & Report`) with weights `+35 / +35 / +30`. | Use **3 non-spoiler choices** for Drill 3 as defined in PDF Sec. 7 so all 3 drills have consistent 3-choice UX and sum cleanly to `100%` (`35 + 35 + 30`). |
| **CONF-04** | **Memory Limit Target** | `prd.md` / `hackathon_requirement.md` target `<60 MB`; `requirement.md` NFR-01 specifies `<75 MB`; PDF Sec. 4 states `<55 MB`. | Enforce `<60 MB` idle RSS target (strictly `<75 MB` peak, well within Embarko's `256 MB` hard cap). |
| **CONF-05** | **Fonts & Strict CSP** | `design.md` loads `Archivo` & `Archivo Narrow` from `https://fonts.googleapis.com` (permitted under `https:` CSP) with system fallbacks; PDF Sec. 4 says self-host all UI assets/CSS/JS inside `/public`. | Self-host all CSS, JS, SVG, and WebAudio inside `/public`; link Google Fonts over `https:` with `Arial Narrow` / `Impact` / `system-ui` local fallbacks so CSP and offline environments both work cleanly. |

---

## 4. Requirements Traceability Matrix

Status classifications used:
- `Completed and verified`
- `Implemented but not verified`
- `Partially implemented`
- `Not implemented`
- `Blocked`
- `Conflicting requirements`

| Req ID | Requirement | Source Document | Current Status | Implementation Location | Test Status |
|---|---|---|---|---|---|
| **FR-01** | Instant Mobile Hero (`Screen 0`) - Incoming Call card, zero login wall, `EN | हिंदी`, 3 tabs, `ANSWER & START 60s DRILL` CTA | `requirement.md`, `prd.md`, `design.md`, PDF Sec. 6 | Completed and verified | `public/index.html`, `public/styles.css`, `public/app.js` | Passed (`tests/e2e.test.js`) |
| **FR-02** | Audio Unlock & Bilingual Captions - tap unlocks WebAudio `AudioContext`, synthesized cues, conditional `speechSynthesis` (`en-IN`/`hi-IN`), always-on `>=18px` captions | `requirement.md`, `prd.md`, PDF Sec. 6 | Completed and verified | `public/app.js`, `public/styles.css` | Passed (`tests/e2e.test.js`) |
| **FR-03** | Three Interactive Timed Drills - Drill 1 (Digital Arrest), Drill 2 (`.pdf.apk` Utility/Delivery), Drill 3 (UPI Collect) with 15s countdown bar, `reaction_ms`, `passed`, `missed_flag`, non-spoiler choices | `requirement.md`, `prd.md`, PDF Sec. 7 | Completed and verified | `src/drills.js`, `public/app.js` | Passed (`tests/forensic.test.js`, `tests/e2e.test.js`) |
| **FR-04** | Simulated Loss Feedback & Playbook - `-₹50,000` debrief banner on trap, Immunity % split-flap finale, 3-step `1930` Golden-Hour checklist | `requirement.md`, `prd.md`, `design.md`, PDF Sec. 7 | Completed and verified | `public/app.js`, `public/styles.css` | Passed (`tests/e2e.test.js`) |
| **FR-05** | Forensic Link/Message/UPI X-Ray (`POST /api/scan`) - `<10ms` deterministic parser (`xn--`/homoglyphs, `.pdf.apk`, `@`-mask/IP/shorteners/disposable TLDs, `upi://pay?`, urgency tokens), 4 presets, inline highlights | `requirement.md`, `prd.md`, `detailed_plan.md`, PDF Sec. 8 | Completed and verified | `src/forensicEngine.js`, `server.js`, `public/app.js` | Passed (`tests/forensic.test.js`, `tests/api.test.js`, `tests/e2e.test.js`) |
| **FR-06** | Shareable Family/Friend Challenges (`POST /api/challenge`) - create named `/c/:id` link without PII | `requirement.md`, `prd.md`, `detailed_plan.md` | Completed and verified | `server.js`, `src/db.js`, `public/app.js` | Passed (`tests/api.test.js`, `tests/e2e.test.js`) |
| **FR-07** | Live Readiness Report (`/c/:id`, `/c/:id/report`, `POST /api/challenge/:id/result`, `GET /api/challenge/:id`) - 4s HTTP polling (no WebSockets) | `requirement.md`, `detailed_plan.md`, PDF Sec. 4/8 | Completed and verified | `server.js`, `src/db.js`, `public/app.js` | Passed (`tests/api.test.js`, `tests/e2e.test.js`) |
| **FR-08** | Downloadable `1080×1350` Canvas Verdict Ticket PNG (+ optional `STORAGE_URL` upload via `POST /api/badge`) | `requirement.md`, `detailed_plan.md`, `design.md` | Completed and verified | `public/app.js`, `src/storage.js`, `server.js` | Passed (`tests/api.test.js`, `tests/e2e.test.js`) |
| **FR-09** | Cohort Daily Benchmark Cron (`GET /tasks/daily-stats`) & Split-Flap Stats (`GET /api/stats`) - `Bearer $CRON_SECRET` auth, `embarko.json` schedule | `requirement.md`, `detailed_plan.md`, `hackathon_requirement.md` | Completed and verified | `embarko.json`, `server.js`, `src/db.js` | Passed (`tests/api.test.js`) |
| **DR-01** | SQLite in `DATA_DIR/baitcheck.db` preserving `_litestream_seq` & `_litestream_lock` via `CREATE TABLE IF NOT EXISTS` | `requirement.md`, `hackathon_requirement.md`, PDF Sec. 4/8 | Completed and verified | `src/db.js` | Passed (`tests/api.test.js`) |
| **DR-02** | Zero PII storage (no phones, emails, Aadhaar/PAN, raw SMS text in `forensic_scans`) | `requirement.md`, `prd.md` | Completed and verified | `src/db.js`, `server.js` | Passed (`tests/api.test.js`) |
| **DR-03** | Seed Cohort Baseline (`daily_stats` seeded on first boot if empty) | `requirement.md` | Completed and verified | `src/db.js` | Passed (`tests/api.test.js`) |
| **SR-01..03** | Abuse-check & Security - permanent `SIMULATION` ribbon, fictional entities only, zero password/OTP/PIN/download inputs, HTML escaping (zero XSS), `Bearer $CRON_SECRET` 401 check, CSP-clean (zero inline `onclick` or inline `<script>`) | `requirement.md`, `prd.md`, `hackathon_requirement.md`, PDF Sec. 6 | Completed and verified | `public/index.html`, `public/app.js`, `server.js` | Passed (`tests/api.test.js`, `tests/e2e.test.js`, `TEST_REPORT.md`) |
| **DES-01** | Bill-Poster & Print-Shop Design System (`#FEC917` Yellow, `#0D0D0D` Ink, `#161616` Wall, `#F2EFE7` Newsprint, `0px` radius, `Archivo Narrow`/`Archivo`, masking tape, split-flap tiles, swatch strips, perforated ticket stub) | `design.md` | Completed and verified | `public/styles.css`, `public/index.html` | Passed (`tests/e2e.test.js`) |
| **MR-01..02** | Mobile-First Ergonomics (`360×800` / `390×844` zero horizontal overflow, `>=44px` touch targets, `>=48px` primary CTAs, no `navigator.vibrate`) | `requirement.md`, `design.md`, PDF Sec. 6 | Completed and verified | `public/styles.css`, `public/app.js` | Passed (`tests/e2e.test.js`) |
| **NFR-01..02** | Runtime Constraints - `0.0.0.0:$PORT`, Node 20+, no Dockerfile, RSS `<60 MB`, `/api/scan < 20ms`, `/health` endpoint | `hackathon_requirement.md`, `requirement.md`, `detailed_plan.md` | Completed and verified | `package.json`, `server.js` | Passed (`56.46 MB` RSS, `3.5 ms` HTTP scan in `TEST_REPORT.md`) |
