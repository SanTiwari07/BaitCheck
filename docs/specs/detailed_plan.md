# Detailed Execution & Engineering Plan - BaitCheck

**Target Directory:** `C:\Projects\02_Hackathons_and_Flagship_Apps\BaitCheck`  
**Timeline:** 22 November 2026 → 30 November 2026 (`04:00 PM IST` Unstop Cutoff; personal target submit **28–29 Nov**)

---

## 1. Production Repository Structure (Under 150 KB Source)

```text
BaitCheck/
├── package.json              # Root manifest ("start": "node server.js", Node 20+, better-sqlite3, express)
├── embarko.json              # App ID (post-first-deploy) + daily benchmark cron schedule
├── hackathon_requirement.md  # Verified challenge rules, scoring math & Embarko runtime limits
├── prd.md                    # Product vision, all-ages personas, 3 drills & safety guardrails
├── requirement.md            # Functional, forensic parser, SQLite schema & mobile requirements
├── design.md                 # Canonical getdesign.md Bill-Poster / Print-Shop design system
├── detailed_plan.md          # This build, test, video & submission roadmap
├── server.js                 # Single-process HTTP server binding 0.0.0.0:$PORT (<60 MB RAM)
├── src/
│   ├── db.js                 # SQLite init under process.env.DATA_DIR (preserves _litestream_* tables)
│   ├── forensicEngine.js     # Deterministic Punycode, homoglyph, .pdf.apk, @-mask & upi://pay parser
│   ├── drills.js             # Bilingual (EN + हिंदी) scripts & non-spoiler choices for Drills 1–3
│   └── storage.js            # Optional PUT to process.env.STORAGE_URL for Verdict Ticket PNGs
├── public/
│   ├── index.html            # Mobile-first shell with permanent SIMULATION safety ribbon
│   ├── styles.css            # design.md token implementation (Ink #0D0D0D, Yellow #FEC917, Newsprint #F2EFE7)
│   └── app.js                # Tap-to-unlock WebAudio, TTS fallback, Drill runner, X-Ray UI, Canvas Ticket
└── tests/
    └── forensic.test.js      # Node built-in test runner verifying all forensic rules & edge cases
```

---

## 2. Exact `embarko.json` & Persistence Contracts

### `embarko.json` (Place at Repo Root Next to `package.json`)
```json
{
  "$schema": "https://embarko.ai/schema/embarko.json",
  "schedules": [
    {
      "cron": "0 9 * * *",
      "path": "/tasks/daily-stats",
      "timezone": "Asia/Kolkata",
      "name": "Refresh daily anonymized BaitCheck trap benchmark"
    }
  ]
}
```
*(After first deploy returns `app.id`, commit `"appId": "<id>"` inside `embarko.json` so every redeploy updates the exact same app.)*

### API Endpoint Map
- `GET /health` → Returns `{ ok: true, memoryMb, uptime }` for quick uptime verification.
- `GET /c/:id` & `GET /c/:id/report` → Serves `public/index.html` cleanly for client-side challenge/report routing.
- `POST /api/scan` → Runs `forensicEngine.js`, logs anonymized `risk_score` + `rules_hit_json` to SQLite, returns inline highlighted segments + decoded UPI params.
- `POST /api/challenge` → Creates a named challenge link (`/c/:id`) in `family_challenges`.
- `GET /api/challenge/:id` → Returns challenge metadata + all recorded `drill_results`.
- `POST /api/challenge/:id/result` → Persists a completed drill result (`scenario_id`, `passed`, `reaction_ms`, `missed_flag`).
- `GET /api/stats` → Returns split-flap cohort totals (total drills, pass rate, top missed trap).
- `POST /api/badge` → Optional server proxy uploading `1080×1350` PNG Verdict Ticket to `STORAGE_URL`.
- `GET /tasks/daily-stats` → Authenticated via `Bearer $CRON_SECRET`; updates `daily_stats`.

---

## 3. 8-Day Solo Execution Schedule (22 Nov – 30 Nov 2026)

| Date | Phase | Concrete Tasks | Verifiable Gate |
|---|---|---|---|
| **Nov 22 (Day 1)** | **Setup, Dual Reg & Claim** | 1. Register on Unstop & `embarko.ai/challenge?cref=UNSTOP` with identical email + phone; click email verification link.<br>2. Scaffold `package.json`, `server.js`, `src/db.js`, `embarko.json`, and minimal `public/index.html`.<br>3. Deploy to `baitcheck.embarko.app` (or `baitcheck-app`) and **claim permanently** (`claimed: true`). | Live permanent URL opens with HTTP 200; leaderboard row visible. |
| **Nov 23 (Day 2)** | **Core Backend & Forensic Engine** | Implement `src/forensicEngine.js` (all 6 deterministic checks), `src/db.js` (`DATA_DIR` + seed cohort stats), REST endpoints, and `tests/forensic.test.js`. | `node --test` 100% green across 20+ scam & benign test strings. |
| **Nov 24 (Day 3)** | **Mobile UI & 3 Bilingual Drills** | Implement `design.md` Bill-Poster CSS (`#0D0D0D`, `#FEC917`, `#F2EFE7`, `Archivo Narrow`), Screen 0 Incoming Call hero, tap-to-unlock WebAudio + captions, and all 3 EN/हिंदी drills. | Full 60s drill playable on `360×800` mobile viewport with zero horizontal scroll. |
| **Nov 25 (Day 4)** | **X-Ray UI, `/c/:id` & Verdict Ticket** | Wire Tab 2 (`POST /api/scan` + 4 presets + inline highlights), Tab 3 (`/c/:id` + `/c/:id/report` polling), Canvas `1080×1350` Verdict Ticket PNG, and `1930` tear-off playbook. | Redeploy to Embarko and confirm SQLite `/c/:id` data survives restart. |
| **Nov 26 (Day 5)** | **FEATURE FREEZE & Phone QA** | Freeze features at 11:00 PM IST. Test on real iPhone Safari + Android Chrome (muted + unmuted), verify `>=44px` touch targets, verify zero real brand logos or OTP/PIN fields. | Zero console/network errors on real phones; RSS memory `<75 MB`. |
| **Nov 27 (Day 6)** | **Film & Post 3-Platform Video** | Record 55s vertical `9:16` reaction video (parent/friend trying Screen 0 + Drills 1–3 + Link X-Ray + Embarko prompt live deploy + `/c/:id/report`). Post publicly on **Instagram Reels, YouTube Shorts, and X** with `#DeployWithEmbarko` + link + comment CTA. | All 3 public video links live (`+150` post pts runway + 3-day organic reach window). |
| **Nov 28–29 (Days 7–8)** | **Submit, LinkedIn & Referrals** | Submit `baitcheck.embarko.app` + all 3 post URLs on `embarko.ai/challenge` (`+200` baseline), claim LinkedIn comment & repost (`+5`), and invite real classmates via your referral link (up to `+210` cap). Sync Unstop submission. | Confirmed `205–415` pre-judging points on `embarko.ai/challenge/leaderboard`. |
| **Nov 30 (<15:00 IST)** | **Final Health Check** | Verify `baitcheck.embarko.app` returns 200 OK, all 3 posts remain public, and Unstop shows submitted before 3:00 PM IST (1h safety buffer). | Keep app & posts online through Dec 15+. |

---

## 4. Feature Prioritization & Cut List (`P0–P3`)

- **P0 (Never Cut):**
  - Permanent `SIMULATION` ribbon + fictional entities + zero OTP/PIN/downloads.
  - Screen 0 Incoming Call tap-to-unlock WebAudio + always-on EN/हिंदी captions.
  - All 3 realistic non-spoiler drills + `-₹50,000` simulated loss debrief + `1930` Golden-Hour sheet.
  - Real `POST /api/scan` forensic X-Ray with 4 presets + inline highlights.
  - `DATA_DIR` SQLite `/c/:id` + `/c/:id/report` persistence + permanent Embarko claim.
- **P1 (High-Value Polish):**
  - Canvas `1080×1350` Verdict Ticket PNG download.
  - `embarko.json` daily `/tasks/daily-stats` cron + Split-Flap cohort counter on Home/Report.
- **P2 (Cut If Behind by Nov 25):**
  - Server `STORAGE_URL` upload for Verdict Ticket PNG (local Canvas PNG download works cleanly without it).
  - Graceful `speechSynthesis` voice reading (always-on captions + WebAudio ticks already carry the experience).
- **P3 (Explicitly Excluded):**
  - User login/passwords, 4th/5th scenarios, custom domain setup, or heavy external LLM calls.

---

## 5. 55-Second Vertical Video Shotlist (6-Part Rubric)

1. **`0:00–0:04` (Part 1 & 3s Hook):** Real phone in hand pulsing *"INCOMING CALL • CYBER DESK (SIMULATED)"* as a family member/friend taps Answer → *"I gave them 60 seconds to survive 3 AI-era scams-watch what they clicked."*
2. **`0:04–0:20` (Part 2: App Walkthrough):** Fast cuts through Digital Arrest call, `.pdf.apk` chat trap, UPI Collect trap, and pasting a shady link into **Link X-Ray** (`xn--` / `.apk` highlighted in red).
3. **`0:20–0:36` (Parts 3 & 4: Embarko Prompt & Live Deploy):** Screen-recording copying the Embarko prompt from `embarko.ai`, pasting into AI, and watching `baitcheck.embarko.app` go live with SQLite `DATA_DIR`.
4. **`0:36–0:48` (Part 5: WOW Factor):** Showing the child's `/c/:id/report` screen updating live + perforated **BaitCheck Verdict Ticket** printing on screen.
5. **`0:48–0:55` (Part 6: Link & Hashtag):** Full-screen `baitcheck.embarko.app` + text overlay `#DeployWithEmbarko` + *"Test your family and comment their score below!"*
