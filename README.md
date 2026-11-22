# BaitCheck

**60-Second Interactive Scam Survival Trainer, Deterministic Forensic Link/UPI X-Ray & Family Challenge Platform**  
Built for the **Deploy With Embarko Student Challenge 2026** (`#DeployWithEmbarko`) · Target URL: `https://baitcheck.embarko.app`

---

## Key Capabilities

1. **60-Second Panic Drill (`01 60s DRILL`):** Zero-login mobile simulator testing reflexes against an AI "Digital Arrest" call, a disguised `.pdf.apk` utility bill lure, and a UPI cashback collect trap—complete with tap-to-unlock WebAudio cues, always-on `>=18px` `EN | हिंदी` captions, `-₹50,000` / `-₹4,500` simulated loss debriefs, a downloadable `1080×1350` Canvas Verdict Ticket PNG, and the `1930` Golden-Hour checklist.
2. **Deterministic Link, Message & UPI X-Ray (`02 LINK X-RAY`, `POST /api/scan`):** Sub-5ms rule engine checking Punycode (`xn--`), mixed-script Cyrillic/Greek homoglyphs, double-extension `.pdf.apk` executables, `@` URL userinfo masking, raw IPv4 hosts, shorteners, high-risk disposable TLDs, `upi://pay?` parameters, and bilingual EN/हिंदी social-engineering pressure phrases—with 4 one-tap sample presets and zero PII storage.
3. **Shareable Family Challenges & Live Report (`03 CHALLENGE`, `/c/:id`, `/c/:id/report`):** Generates personal challenge links persisted in SQLite (`DATA_DIR/baitcheck.db`) with Litestream table preservation and 4-second HTTP polling (zero WebSockets).
4. **Embarko-Ready Runtime:** Single Node.js process (`0.0.0.0:$PORT`), zero Dockerfile, `~56 MB` RSS memory (well below the `256 MB` cap), and `embarko.json` daily benchmark cron (`/tasks/daily-stats`).

---

## Quick Start

```bash
npm install
npm start
```

Run the complete automated test suite (unit + SQLite/API integration + headless browser E2E):

```bash
npm test
```

---

## Documentation Index

- [DEMO_GUIDE.md](DEMO_GUIDE.md) — Step-by-step live hackathon demonstration & operator runbook
- [TEST_REPORT.md](TEST_REPORT.md) — Automated test results, security audit, and memory/latency benchmarks
- [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) — Complete discovery & requirements traceability matrix
- [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) — Prioritized build roadmap and completion status
- [ENGINEERING_LOG.md](ENGINEERING_LOG.md) — Multi-agent engineering log, decisions, and fixes
