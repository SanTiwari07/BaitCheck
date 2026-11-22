# Product Requirements Document (PRD) - BaitCheck

**Product Name:** `BaitCheck`  
**Target Live URL:** `https://baitcheck.embarko.app`  
**Target Event:** Deploy With Embarko Student Challenge 2026 (`#DeployWithEmbarko`)  
**Product Category:** Mobile-First Interactive AI-Era Scam Survival Trainer & Forensic Link X-Ray  
**Target Audience:** **Everyone (Ages 10 to 80)** - kids/teens (fake game mods/giveaways), students (fake internship/delivery `.apk`s), working adults (UPI collect/KYC traps), and parents/elders (AI voice-clone & "Digital Arrest" calls).

---

## 1. Problem Statement

As AI voice cloning, deepfake video calls, and automated phishing kits become cheap and pervasive in 2026, scams no longer rely on broken spelling-they exploit **15 seconds of human panic and urgency**. Across Indian consumer forums (`r/india`, `r/developersIndia`, `r/IsThisAScamIndia`) and bank/cybercrime advisories, three attack vectors dominate:
1. **AI Voice / "Digital Arrest" Video Calls:** Attackers impersonate officials or distressed relatives to induce isolation and panic transfers.
2. **Disguised `.apk` Chat Lures (`.pdf.apk`):** Fake utility disconnection notices, delivery alerts, or free game/mod installers that steal SMS OTPs and Android Accessibility control.
3. **UPI "Accept Refund / Prize" Collect Traps:** Exploiting the confusion that entering a UPI PIN *debits* money rather than crediting it.

**Why Existing Tools Fail:** Caller-ID apps (`Truecaller`) are reactive; OS-level warnings (`Google On-Device Scam Detection`) are hardware/OS gated; enterprise trainers (`KnowBe4`) are B2B email quizzes; and passive awareness posters fail the moment a real person panics under a ticking clock.

---

## 2. Product Vision & Core Value Proposition

**BaitCheck** turns passive cyber-safety advice into a **60-second, tactile mobile panic drill + real-time forensic link dissector**.
- **Not a boring school quiz:** Opens directly onto a high-tension simulated incoming call (`"Unknown Desk - Simulated"`), uses realistic non-spoiler action buttons, and triggers a visceral **`SIMULATED LOSS: -₹50,000 IN 8.4s`** (or **`BAIT DODGED: 100% SURVIVED`**) verdict ticket when you finish.
- **Not just a game:** Includes a genuine, deterministic **Link, Message & UPI X-Ray (`POST /api/scan`)** that dissects Punycode/homoglyph lookalike domains, double-extension `.pdf.apk` lures, `@` URL masking, and `upi://pay?` parameters inline.
- **Shareable Family & Friend Challenge (`/c/:id`):** Any user can create a named challenge link (`baitcheck.embarko.app/c/mom-7x2a`), send it on WhatsApp, and watch the live **Readiness Report (`/c/:id/report`)** update in SQLite (`DATA_DIR`) as their friend, sibling, or parent completes the 3 drills.

---

## 3. Target Personas & Jobs-to-be-Done

| Persona | Core Threat Vector | Job-to-be-Done |
|---|---|---|
| **Teen / Gamer (Age 12–18)** | Fake "Free Gift / Mod `.apk`" chat forwards & prize collect links | Spot disguised `.apk` extensions and "PIN to receive" traps in <15s without feeling lectured. |
| **College Student (Age 18–24)** | Fake recruiter/delivery `.apk`s, UPI QR traps, and testing parents/friends | Run the 60s drill, generate a `/c/:id` challenge link for family/friends, and compare scores. |
| **Parent / Elder (Age 45–80)** | AI voice/video "Digital Arrest" calls & urgent power-cut chat lures | Practice in `EN` or `हिंदी` with huge readable typography and always-on captions-zero app install. |
| **Hackathon Judge (Mobile Browser)** | Evaluates `Work (400 pts)` on a smartphone in 30–60 seconds | Experience an instant "WOW" first screen (`Screen 0`), test 1-tap X-Ray presets, and verify real SQLite persistence. |

---

## 4. Core User Flows & Product Scope

### Flow A - Instant 60-Second Panic Drill (Zero Login Wall)
1. **Screen 0 (First Viewport):** Pulsing **"INCOMING CALL • CYBER DESK (SIMULATED)"** bill-poster card with `EN | हिंदी` toggle, quick-tabs (`[60s Drill]`, `[Link X-Ray]`, `[Send Challenge]`), and a primary CTA **`ANSWER & START 60s DRILL`** (tap unlocks WebAudio `AudioContext` on iOS/Android).
2. **Drill 1 (0–20s) - AI Voice / "Digital Arrest" Call:** 15s countdown bar, blurred geometric caller frame, `REC • SIMULATED` tag, bilingual audio/captions, and 3 non-spoiler tap choices (`[Stay on Call & Verify]`, `[Ask for Official Written Notice & Hang Up]`, `[Disconnect - Scam]`).
3. **Drill 2 (20–40s) - Disguised `.pdf.apk` Utility/Delivery Chat:** Generic chat bubble showing `Notice_Bill_v2.pdf.apk (4.2 MB)` (non-downloadable button) + 15s timer + 3 realistic choices (`[Open File Now]`, `[Inspect Extension .apk]`, `[Block & Verify Official App]`).
4. **Drill 3 (40–60s) - UPI "+₹4,500 Cashback Collect" Trap:** Simulated wallet collect notice (no PIN pad, no real brand logo) + 15s timer + choices (`[Approve & Claim ₹4,500]`, `[Decline - PIN Only Sends Money]`).
5. **Verdict Ticket & 1930 Tear-Off Playbook:** Mechanical split-flap final score (`0–100%`), average reaction latency (`ms`), perforated **BaitCheck Verdict Ticket** (downloadable/shareable `1080×1350` PNG), and **1930 Golden-Hour Playbook** (`1. Airplane Mode if .apk tapped → 2. Call 1930 → 3. cybercrime.gov.in`).

### Flow B - Real-Time Link, Message & UPI X-Ray (`Tab 2`)
- Textarea to paste *any* suspicious SMS, WhatsApp forward, URL, or `upi://pay?...` string + **4 one-tap real-world presets** (for instant judge testing).
- Displays a `0–100 Risk Score`, itemized **X-Ray Verdict Cards** (highlighting exact risky tokens inline), and decoded UPI fields (`pa`, `pn`, `am`) explaining *why* a link is dangerous or safe.

### Flow C - Shareable Challenge Links & Live Report (`Tab 3`, `/c/:id`)
- User enters a display nickname (`"Mom"`, `"Rahul"`, `"Hostel Room 204"` - zero phone numbers/PII) and gets a short link `baitcheck.embarko.app/c/<slug>` persisted in `DATA_DIR/baitcheck.db`.
- Opening `/c/:id` runs the exact 3-drill simulator and writes each scenario's `passed`, `reaction_ms`, and `missed_flag` back to SQLite.
- Opening `/c/:id/report` shows the creator a live-polling **Readiness Sheet** highlighting exactly which trap fooled the participant and how fast they reacted.

---

## 5. Strict Anti-Phishing & Abuse-Prevention Guardrails

To guarantee `baitcheck.embarko.app` is **never flagged or taken offline** by automated phishing/abuse scanners before Dec 5:
1. **Zero Real Brand or Agency Names/Logos:** Use strictly fictional demo entities (`Central Cyber Desk Demo`, `Metro Power Utility Demo`, `PaySim Collect Demo`) with bespoke geometric SVG emblems-never CBI, Police, RBI, TRAI, SBI, HDFC, WhatsApp, GPay, PhonePe, or Paytm marks.
2. **Permanent Top Safety Ribbon:** Sticky full-width top bar across every route & mode: `SIMULATION • EDUCATIONAL SCAM DRILL - NO REAL DATA, OTPs, OR DOWNLOADS`.
3. **Zero Credential/OTP/PIN Inputs:** Never render `<input type="password">`, OTP entry boxes, bank account forms, card inputs, or UPI PIN keypads.
4. **Zero Real Downloads:** The `.pdf.apk` chat pill only triggers an in-DOM simulated modal/feedback card-never an actual file download or `blob:` APK.

---

## 6. Explicit Non-Goals & Success Metrics

- **Non-Goals:** No user registration/passwords; no live call interception; no Android Accessibility permissions; no real UPI intent (`upi://pay`) triggers; no heavy server-side ML/LLM dependencies.
- **Hackathon Success Metrics:**
  - **Work (`400 pts`):** Mobile first-screen impact (`360×800` zero horizontal overflow), 100% uptime (`<60 MB` RAM), real SQLite `DATA_DIR` persistence across redeploys, genuine deterministic forensic scanner.
  - **Video (`300 pts`) + Reach (`300 pts`):** 55s vertical 9:16 reaction Reel posted on Instagram, X, and YouTube by Nov 27 driving organic comments and views.
  - **Deterministic Floor (`415 pts`):** Valid submission + 3 platform links (`200`) + LinkedIn (`5`) + real classmate referrals (up to `210`).
