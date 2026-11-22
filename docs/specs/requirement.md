# Technical & Functional Requirements — BaitCheck

**Version:** 1.0 (Hackathon Build Spec)  
**Runtime Target:** Single-process Node.js 20+ on Embarko (`0.0.0.0:$PORT`, `<60 MB RAM`, max `256 MB`)

---

## 1. Functional Requirements (`FR`)

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| **FR-01** | **Instant Mobile Hero (`Screen 0`)** | Visiting `/` loads the simulated Incoming Call card immediately with zero login wall, language toggle (`EN` / `हिंदी`), tab switcher (`60s Drill`, `Link X-Ray`, `Challenge`), and `ANSWER & START 60s DRILL` CTA. |
| **FR-02** | **Audio Unlock & Bilingual Captions** | Tapping `Answer` initializes/resumes WebAudio `AudioContext` cleanly on iOS Safari & Android Chrome, plays synthesized chime/tick cues, invokes `speechSynthesis` only if an `en-IN`/`hi-IN` voice exists, and always displays `>=18px` captions. |
| **FR-03** | **Three Interactive Timed Drills** | Runs Drill 1 (Digital Arrest Call), Drill 2 (`.pdf.apk` Chat Lure), and Drill 3 (UPI Collect Trap) sequentially on a 15s countdown bar, recording `reaction_ms`, `passed`, and `missed_flag` per drill without spoiling answers in button labels. |
| **FR-04** | **Simulated Loss Feedback & Playbook** | Selecting a trap button flashes a high-contrast `SIMULATED LOSS: -₹50,000` debrief explaining the exact manipulation tactic before advancing. Finale renders Immunity %, split-flap stats, and the 3-step `1930` Golden-Hour checklist. |
| **FR-05** | **Forensic Link/Message/UPI X-Ray** | `POST /api/scan` evaluates arbitrary pasted text/URLs/UPI strings deterministically in `<10 ms`, returning `riskScore (0–100)`, `verdict`, `findings[]`, `upiDecoded`, and `highlightedTokens[]`. UI includes 4 one-tap sample presets. |
| **FR-06** | **Shareable Family/Friend Challenges** | `POST /api/challenge` creates a short unique slug (`id`) in SQLite (`creator_name`, `target_label`, `lang`) and returns `/c/:id` and `/c/:id/report` URLs. |
| **FR-07** | **Live Readiness Report** | `/c/:id` saves each completed drill via `POST /api/challenge/:id/result`. `/c/:id/report` polls `GET /api/challenge/:id` (every 4s while pending, no WebSockets) to show live pass/fail breakdown per drill. |
| **FR-08** | **Downloadable Verdict Ticket PNG** | Client HTML5 Canvas draws a `1080×1350` bill-poster Verdict Ticket (score, reaction time, traps dodged, `baitcheck.embarko.app` footer) downloadable locally and optionally pushable to Embarko `STORAGE_URL`. |
| **FR-09** | **Cohort Daily Benchmark Cron** | `GET /tasks/daily-stats` validates `Authorization: Bearer ${CRON_SECRET}`, aggregates anonymized drill pass rates & top missed trap across SQLite rows, and persists summary metrics in `daily_stats`. |

---

## 2. Deterministic Forensic Engine Requirements (`POST /api/scan`)

All checks in `src/forensicEngine.js` must execute **deterministically without external API keys**:

1. **Punycode & IDN Homoglyph Check (`+35 risk`):**
   - Flags `xn--` labels in extracted hostnames.
   - Detects mixed-script Unicode homoglyphs (Cyrillic `а, е, о, р, с, х` or Greek lookalikes mixed with Latin characters inside domain labels).
2. **Double-Extension & Executable Lure Check (`+40 risk`):**
   - Matches disguised attachments such as `\.(pdf|jpg|jpeg|png|doc|docx|xls)\.(apk|exe|bat|scr|msi)\b` or standalone `.apk` mentions alongside urgent payment/utility/mod keywords.
3. **URL Deception & Masking Check (`+30 risk`):**
   - Flags `@` userinfo credential masking in URLs (e.g., `https://secure.bank@evil.example`).
   - Flags raw IPv4 literal URLs (`http://192.168...` / public IP hosts) and common shorteners (`bit.ly`, `tinyurl.com`, `t.co`, `rb.gy`, `cutt.ly`) when combined with urgent action text.
4. **UPI Deep-Link & Collect-Trap Dissector (`+30 risk`):**
   - Parses `upi://pay?...` query parameters (`pa`, `pn`, `am`, `cu`, `tn`, `mode`).
   - Flags positive `am` (debit amount) or collect terminology paired with "receive/cashback/prize/refund/PIN" language.
5. **Social-Engineering Pressure Tokens (`+15–25 risk`):**
   - Matches bilingual/English urgency, isolation, and authority threats (`digital arrest`, `warrant`, `disconnection tonight`, `stay on call`, `do not tell`, `kyc suspended`, `enter pin to receive`, `बिजली कट`, `गिरफ्तारी`).
6. **Input Validation & Safety:**
   - Max input length `2,000` characters; strip/escape HTML strictly before rendering inline highlights (zero XSS).

---

## 3. Data & Persistence Requirements (`DR`)

SQLite database path: `path.join(process.env.DATA_DIR || path.join(__dirname, '..', 'data'), 'baitcheck.db')`.

- **DR-01 (Litestream Preservation):** Never drop or alter Embarko's `_litestream_seq` or `_litestream_lock` tables. Use idempotent `CREATE TABLE IF NOT EXISTS` statements only.
- **DR-02 (Zero PII Storage):** Never collect or store phone numbers, emails, Aadhaar/PAN, real bank details, or raw pasted SMS text in SQLite (`forensic_scans` stores only `risk_score`, `rules_hit_json`, and timestamp).
- **DR-03 (Seed Cohort Baseline):** On first boot when `daily_stats` is empty, seed baseline educational stats so the public cohort ticker displays immediately without showing `0` records.

```sql
CREATE TABLE IF NOT EXISTS family_challenges (
  id TEXT PRIMARY KEY,
  creator_name TEXT NOT NULL,
  target_label TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drill_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  challenge_id TEXT NOT NULL,
  scenario_id TEXT NOT NULL,
  passed INTEGER NOT NULL,
  reaction_ms INTEGER NOT NULL,
  missed_flag TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (challenge_id) REFERENCES family_challenges(id)
);

CREATE TABLE IF NOT EXISTS forensic_scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  risk_score INTEGER NOT NULL,
  rules_hit_json TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_stats (
  stat_date TEXT PRIMARY KEY,
  total_drills INTEGER NOT NULL,
  pass_rate_pct REAL NOT NULL,
  top_missed_scenario TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Non-Functional, Mobile & Security Requirements (`NFR` / `MR` / `SR`)

- **NFR-01 (Memory Footprint):** Idle & peak RSS memory must remain **under 75 MB** (safe headroom under Embarko's 256 MB cap).
- **NFR-02 (Latency):** `/api/scan` responds in `<20 ms`; `/` first contentful paint `<1.0s` on mobile 4G.
- **MR-01 (Mobile Ergonomics):** Designed mobile-first for `360×800` and `390×844` viewports; zero horizontal scroll (`overflow-x: hidden`); all interactive buttons/tabs **>= 44×44px** (`>= 48px` primary CTAs).
- **MR-02 (Browser Audio/Motion Safety):** No reliance on `navigator.vibrate` (unsupported on iOS Safari); CSS `@keyframes` pulse animations + WebAudio triggered exclusively inside `click`/`touchend` handlers.
- **SR-01 (Abuse & XSS Safety):** All user-supplied nicknames (`creator_name`, `target_label`) and `/api/scan` text must be HTML-escaped before DOM insertion; zero `innerHTML` with raw user strings.
- **SR-02 (Cron Auth):** `/tasks/daily-stats` must reject missing/invalid `Authorization: Bearer ${CRON_SECRET}` with HTTP `401` (when `CRON_SECRET` is configured).
- **SR-03 (CSP Compliance):** Zero inline `<script>` event handlers (`onclick=...`); attach all event listeners via `/app.js`; self-hosted CSS/JS assets compatible with Embarko's strict CSP headers.
