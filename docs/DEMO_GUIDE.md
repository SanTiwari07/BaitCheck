# BaitCheck - Hackathon Demo Guide

**Live app:** `https://baitcheck.embarko.app`\
**Event:** Deploy With Embarko Student Challenge 2026 (`#DeployWithEmbarko`)\
**Repository:** `https://github.com/SanTiwari07/BaitCheck`

## 1. What BaitCheck Does

BaitCheck is a free, bilingual scam-safety practice app for kids, adults, and older people. In a short guided drill, people make choices in realistic but fictional scam situations, learn the warning signs, and practice a safer next step. They can also inspect a suspicious message with the rule-based Message Check or invite family to practice together.

The app is designed for quick understanding: no account is needed to start, the home screen offers three clear actions, the main practice takes about a minute, and additional examples can be explored without a timer. A larger-text control is available in the header.

## 2. The Problem and the Approach

Scams often use urgency, fear, trust, or confusion to make people act before they can check. BaitCheck gives people a low-pressure way to rehearse pausing and verifying, using examples such as:

1. A caller pretending to be police or a government official and demanding money.
2. A fake electricity or delivery notice that asks someone to install an app.
3. A UPI refund or cashback request that tries to make someone enter a PIN.
4. A cloned family voice asking for emergency money.
5. A parcel-fee QR code, a job that asks for an upfront fee, or fake tech support asking for remote access.

The scenarios use fictional names and safe, non-functional examples. The practice does not initiate calls, payments, downloads, or remote access.

## 3. How to Start the Application Locally

### Prerequisites

- Node.js 20 or newer. The project uses built-in `node:sqlite` on supported Node versions and can use the optional `better-sqlite3` dependency on Node 20.

### Install and start

```bash
npm install
npm start
```

The server listens on `http://0.0.0.0:3000` or the port configured by `PORT`.

### Automated tests

```bash
npm test
```

This runs the repository's unit, API integration, and browser end-to-end test suites.

## 4. Environment Configuration

| Variable | Required? | Default | Purpose |
|---|---|---|---|
| `PORT` | No | `3000` | HTTP server port. |
| `DATA_DIR` | No | `./data` | Persistent location for the SQLite database. |
| `CRON_SECRET` | No | Empty | Protects `GET /tasks/daily-stats` when configured. |
| `STORAGE_URL` | No | Empty | Optional remote storage endpoint for badge PNG uploads. |
| `STORAGE_TOKEN` | No | Empty | Optional server-side storage credential. |
| `APP_NAME` | No | `baitcheck` | App slug used by remote storage. |

## 5. Judge Demo Flow (about 90 seconds)

### Step 1: Explain the first screen (15 seconds)

- Open the deployed app on a phone-sized screen.
- Point out the safety banner: this is a simulation and does not take real payments, OTPs, or downloads.
- Show English/Hindi, sound, and the A+ larger-text control.
- Explain the three plain-language actions: **Practice**, **Check a message**, and **Practice with family**.
- Start the main practice.

### Step 2: Make one decision in the timed practice (30 seconds)

- Read the fictional caller/message and pick a response.
- Choose a risky response once to show the consequence and explanation, then point out the safer alternative.
- Highlight that feedback names the warning sign and gives a next action instead of only marking an answer right or wrong.
- If time permits, finish all three short scenarios and show the summary.

### Step 3: Show the no-timer lessons (15 seconds)

- Return to the home screen and expand **More scam examples • no timer**.
- Open one example (for example, the cloned family voice call).
- Choose an answer, read the supportive feedback, and retry. Mention the other lessons: parcel-fee QR, upfront-fee job, and fake tech support.

### Step 4: Check a message (15 seconds)

- Open **Check a message** and load a built-in fictional example.
- Show how the scanner highlights suspicious signals and explains them in plain language.
- Emphasize that its signal score is an aid, not proof that a message is safe. Verify using an official app, website, or known phone number. The pasted message is not saved.

### Step 5: Close with family practice and safety (15 seconds)

- Open **Practice with family** to show how a user can create a shareable practice link and review a report.
- Explain that only nicknames are used for the challenge; do not enter full names, contact details, OTPs, PINs, passwords, or bank information.
- Finish with the emergency guidance: contact India's cyber-fraud helpline **1930** promptly if money has been lost, ask a trusted person for help, and report through the official `cybercrime.gov.in` portal.

## 6. Features to Highlight

- **Accessible start:** no login wall, large buttons, English/Hindi, and an A+ text-size option.
- **Short and optional practice:** a guided one-minute drill plus additional untimed lessons.
- **Actionable learning:** scenario feedback explains the clue and a safer next step.
- **Message Check:** deterministic analysis of links, suspicious wording, and UPI payment requests. The result is a signal, not a guarantee.
- **Family practice:** shareable challenges with nickname-based reports.
- **Privacy and safety:** no real transactions, downloads, credential collection, or saved pasted message text.
- **Transparent metrics:** home-page stats combine an illustrative baseline with activity recorded by the app; do not present the baseline as a user study.

## 7. Submission Video Outline (55 seconds)

The challenge page asks for a 40-second to 3-minute video covering six parts. Keep it vertical, captioned, and understandable without sound. Show your real Embarko workflow accurately.

| Time | Part | What to show and say |
|---|---|---|
| 0:00-0:04 | Introduction | Show the simulated call. Say who you are and that you built BaitCheck to help families practice spotting scams. |
| 0:04-0:16 | What you built | Show one scenario, make a choice, and reveal the clue and safer next step. Keep the simulation label visible. |
| 0:16-0:23 | Embarko experience | Briefly explain how you used Embarko and your AI tool while building the app. Use your actual experience. |
| 0:23-0:34 | Hosting on Embarko | Show the real deployment workflow or dashboard and the live app opening at its Embarko URL. |
| 0:34-0:49 | Wow factor | Open a family practice link and show its report, or run the message checker on a fictional sample. Choose one clear payoff. |
| 0:49-0:55 | Link and hashtag | Show the live URL clearly and end with `#DeployWithEmbarko`. |

Post the video publicly on Instagram, X, and YouTube if you can produce a clean version for each. Submit every post link with the app link. Keep the app live and posts public until judging. Do not use paid promotion, purchased engagement, or copyrighted media.

## 8. Safe Demo Examples

Use the built-in examples in the app. If typing a sample manually, use fictional domains and never use a real person's message or personal data. Example themes include:

1. A fake KYC notice with a lookalike domain.
2. An electricity notice asking the recipient to install an Android package.
3. A fictional UPI refund request that asks for a PIN to “receive” money.
4. A fictional safe reminder pointing to the official cybercrime portal and 1930.

`GET /health` provides a basic service-health response.

## 9. Known Limitations

- Message Check is rule-based and cannot prove that a message, caller, or website is safe. Scam techniques change; users should verify independently.
- Speech output depends on voices installed on the device. Text remains available if a matching voice is unavailable.
- Remote badge uploads require `STORAGE_URL` and `STORAGE_TOKEN`; local badge generation can work without them.
- Challenge reports require the app's server and database to be available.

## 10. Troubleshooting

- **Port already in use:** set `PORT=3001` before starting (PowerShell: `$env:PORT=3001; npm start`).
- **No sound on mobile:** check the device's sound settings and tap the sound control; browsers require a user gesture before audio can play.
- **Unauthorized daily stats request:** when `CRON_SECRET` is configured, include `Authorization: Bearer <CRON_SECRET>`.
