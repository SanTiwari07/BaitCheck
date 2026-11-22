# BaitCheck — Hackathon Demo & Operator Guide

**Live Target URL:** `https://baitcheck.embarko.app`  
**Event:** Deploy With Embarko Student Challenge 2026 (`#DeployWithEmbarko`)  
**Repository:** `https://github.com/SanTiwari07/BaitCheck`

---

## 1. What BaitCheck Does
**BaitCheck** is a mobile-first **60-second AI-era scam survival simulator + deterministic forensic link & UPI X-Ray + shareable family challenge platform**.

Instead of passive awareness quizzes, BaitCheck drops any user (ages 10–80, in English or हिंदी, with zero login wall) straight into a high-tension simulated incoming call and 3 timed 15-second panic drills, pairs it with a real deterministic forensic scanner (`POST /api/scan`), and lets students generate personal `/c/:id` links to test parents or friends and watch their live `/c/:id/report` readiness sheet update in SQLite.

---

## 2. What Problem It Solves
Modern scams exploit **15 seconds of human panic** rather than broken grammar:
1. **AI Voice / "Digital Arrest" Video Calls** forcing isolation and instant "security deposit" transfers.
2. **Disguised `.pdf.apk` Chat Lures** (fake electricity cutoff bills / delivery notices) stealing SMS OTPs and Android Accessibility control.
3. **UPI Cashback / Refund Collect Traps** tricking victims into entering a UPI PIN thinking it receives money.

Existing tools are reactive (caller ID), hardware/OS-gated, enterprise-only, or purely post-fraud (`1930`). BaitCheck pre-trains the instinct *before* panic hits and embeds the `1930` Golden-Hour checklist right inside the Verdict Ticket.

---

## 3. How to Start the Application Locally

### Prerequisites
- **Node.js `20+`** (verified on `v26.13.0` using built-in `node:sqlite`, with `better-sqlite3` as an optional dependency for Node 20 environments).

### Installation & Start
```bash
npm install
npm start
```
The server listens on `http://0.0.0.0:3000` (or `process.env.PORT`).

### Run Automated Tests
```bash
npm test
```
Runs unit tests (`tests/forensic.test.js`), SQLite/HTTP API integration tests (`tests/api.test.js`), and real headless browser E2E tests (`tests/e2e.test.js`).

---

## 4. Required & Optional Environment Configuration

| Variable | Required? | Default | Purpose |
|---|---|---|---|
| `PORT` | No (set by Embarko) | `3000` | HTTP bind port (`0.0.0.0:$PORT`). |
| `DATA_DIR` | No (set by Embarko) | `./data` | Persistent directory for `baitcheck.db` (preserves Litestream `_litestream_*` tables). |
| `CRON_SECRET` | Optional (set by Embarko) | `""` | Bearer secret protecting `GET /tasks/daily-stats` (`401` if set and missing/mismatched). |
| `STORAGE_URL` | Optional | `""` | Embarko file storage base URL for `POST /api/badge` PNG uploads. |
| `STORAGE_TOKEN` | Optional | `""` | Bearer token for `STORAGE_URL` (never exposed to clients). |
| `APP_NAME` | Optional | `baitcheck` | Target app slug under `STORAGE_URL`. |

**Embarko Hosting Notes:**
- No `Dockerfile`, no WebSockets, single Node process (`<60 MB` RSS under 256 MB cap).
- Claim the deployed app immediately (`claimed: true`) so Embarko does not auto-delete it after 24 hours.
- `embarko.json` schedules daily benchmark refresh (`0 9 * * *` `Asia/Kolkata`) at `/tasks/daily-stats`.

---

## 5. Step-by-Step Live Demonstration Flow (60–90 Seconds)

### Step 1: Instant First-Screen Hook (`/` on a phone or `360×800` viewport)
- Open `http://localhost:3000` (or `https://baitcheck.embarko.app`).
- Point out the permanent yellow top safety ribbon (`SIMULATION • EDUCATIONAL SCAM DRILL — NO REAL DATA, OTPs, OR DOWNLOADS`), the `EN | हिंदी` toggle, and the pulsing **"Central Cyber Desk (Simulated)"** incoming call card with zero login wall.
- Toggle `हिंदी` briefly to show full bilingual support, then tap **`ANSWER & START 60s DRILL →`** (unlocks WebAudio alert chime + live 15.0s countdown).

### Step 2: Play Through the 3 Panic Drills (`01 60s DRILL`)
1. **Drill 1 (Digital Arrest Video Call):** Tap the trap option (*"Stay on the video call & pay the refundable deposit"*) to showcase the visceral **`SIMULATED LOSS: -₹50,000`** red debrief banner explaining why real agencies never arrest on video calls.
2. **Drill 2 (Fake Utility Bill `.pdf.apk`):** Tap the attachment pill `MetroBill_Notice.pdf.apk • 4.2 MB` to prove **zero real file downloads** occur (`SIMULATION SAFE` inline notice), then choose *"Check the .apk extension & delete the message"* to earn **`TRAP DODGED (+35 IMMUNITY)`**.
3. **Drill 3 (UPI Cashback Collect Trap):** Choose *"Decline — a UPI PIN only sends money out"* to earn **`TRAP DODGED (+30 IMMUNITY)`**.

### Step 3: Perforated Verdict Ticket & `1930` Playbook
- On the finale screen, show the mechanical split-flap counters (**`65% IMMUNITY`**, **`2/3 TRAPS DODGED`**), the perforated Verdict Ticket, and the **3-step `1930` Golden-Hour Playbook** (*1. Airplane Mode -> 2. Call 1930 -> 3. cybercrime.gov.in*).
- Tap **`DOWNLOAD VERDICT TICKET (1080×1350 PNG)`** to generate the high-resolution `1080×1350` poster PNG locally (with inline preview for mobile WebViews).

### Step 4: Real-Time Deterministic Forensic Link & UPI X-Ray (`02 LINK X-RAY`)
- Switch to **`02 LINK X-RAY`**.
- Tap **`Punycode + KYC SMS`** preset -> instant `<5 ms` dissection highlighting `xn--metrobank-kyc-9x2a.example` in red and urgency phrases in amber.
- Tap **`UPI Cashback Trap`** preset -> shows decoded UPI payload table (`pa`, `pn`, `am: 4500`, `tn`) plus the Golden Rule warning.
- Optionally paste `"You are under digital arrest right now"` or `"http://metrobank-kyc.xyz/login"` to demonstrate live custom analysis (`CAUTION — SUSPICIOUS SIGNALS`).

### Step 5: Family Challenge Link & Live Readiness Report (`03 CHALLENGE` -> `/c/:id` -> `/c/:id/report`)
- Switch to **`03 CHALLENGE`**.
- Enter nickname **`Aarav`** and target **`Mom`** (zero PII stored), tap **`CREATE CHALLENGE LINK →`**.
- Open **`OPEN LIVE REPORT →`** (`/c/mom-.../report`) in one view (showing `LIVE • AUTO-POLLING EVERY 4s`), or open the `/c/mom-...` challenge link on a second phone/tab, complete the 3 drills, and watch `/c/mom-.../report` update live with per-drill pass/fail status and reaction speed in milliseconds.

---

## 6. Main Features to Showcase
- **Zero-Login Mobile Hero (`Screen 0`):** Immediate value clarity above the fold on `360×640` / `360×800`.
- **Tap-to-Unlock WebAudio + Always-On `>=18px` Bilingual Captions (`EN | हिंदी`):** Works muted or unmuted on iOS Safari and Android Chrome.
- **Deterministic `<5 ms` Forensic Engine (`POST /api/scan`):** Punycode/homoglyphs, `.pdf.apk`, `@`-mask/IPv4/shorteners/disposable TLDs, `upi://pay?` dissector, and EN/हिंदी pressure phrases.
- **Persistent Family Challenges (`/c/:id` & `/c/:id/report`):** SQLite persistence in `DATA_DIR` with Litestream safety and 4s HTTP polling (zero WebSockets).
- **Strict Anti-Phishing & Abuse Safety:** Fictional entities only, zero real brand logos, zero OTP/PIN/password inputs, zero file downloads.

---

## 7. Sample Data & Safe Test Strings
- **Safe Presets (built into Tab 2):**
  1. `Punycode + KYC SMS`: `URGENT: Your KYC is suspended today. Verify immediately at https://xn--metrobank-kyc-9x2a.example/update`
  2. `.pdf.apk Utility Bill`: `URGENT: Electricity cut tonight 9:30 PM. Install MetroBill_Notice.pdf.apk to pay Rs 12 verification.`
  3. `UPI Cashback Trap`: `Congratulations! Claim Rs 4500 cashback refund: upi://pay?pa=reward-desk@paysim&pn=Prize%20Refund%20Demo&am=4500&cu=INR&tn=Approve%20PIN%20to%20Receive`
  4. `Safe Portal Link`: `Official cyber safety portal reminder: report fraud at https://cybercrime.gov.in or dial 1930.`
- **Health Telemetry Check:** `GET /health` returns `{ ok: true, memoryMb, uptime }`.

---

## 8. Known Limitations
- **Speech Synthesis Voices:** `window.speechSynthesis` only reads captions aloud when the visitor's OS/browser has an `en-IN` or `hi-IN` voice installed; otherwise it degrades silently to WebAudio ticks + always-on `>=18px` captions.
- **Remote Badge CDN Upload (`POST /api/badge`):** Requires `STORAGE_URL` and `STORAGE_TOKEN` environment variables on Embarko; when unset, local `1080×1350` PNG download and inline mobile preview work 100% client-side.
- **Rule-Based X-Ray Scope:** `POST /api/scan` uses deterministic lexical, URL, UPI, and Unicode homoglyph rules (`<5 ms`, `<60 MB` RAM) rather than live WHOIS lookups or remote ML models.

---

## 9. Troubleshooting
- **Port already in use:** Run with `PORT=3001 npm start` (PowerShell: `$env:PORT=3001; npm start`).
- **Node 20 vs Node 26 SQLite driver:** `src/db.js` automatically uses built-in `node:sqlite` on Node 22.5+/26+ and falls back to optional `better-sqlite3` on Node 20+.
- **No sound on mobile phone:** Ensure device mute switch is off and tap `ANSWER & START 60s DRILL →` (browsers require a direct tap to unlock `AudioContext`).
- **401 on `/tasks/daily-stats`:** When `CRON_SECRET` is set, include header `Authorization: Bearer <CRON_SECRET>`.
