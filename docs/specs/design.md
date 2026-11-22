---
version: alpha
name: BaitCheck
description: >
  A bill-poster inspired cyber-defense training studio and link forensics tool.
  Combines deep ink-black paste-up walls, warm newsprint cream sheets, pure paper
  cards, a single Signal Yellow marker accent, sharp zero-radius print geometry,
  and Archivo Condensed display headlines to turn a 60-second AI-scam survival
  drill into an unmistakable, mobile-first print-shop artifact.
colors:
  primary: "#FEC917"
  on-primary: "#0D0D0D"
  ink: "#0D0D0D"
  wall: "#161616"
  surface-dark: "#1A1A1A"
  canvas: "#F2EFE7"
  paper: "#FCFAF6"
  surface-card: "#FFFFFF"
  tape: "#F1EDE5"
  surface-muted: "#EFEFEF"
  stone: "#8E8B80"
  body: "#1E1E1C"
  muted: "#5A5850"
  on-dark: "#F7F5EF"
  on-dark-muted: "#B5B1A6"
  hairline: "rgba(13, 13, 13, 0.16)"
  hairline-strong: "#0D0D0D"
  hairline-dark: "rgba(255, 255, 255, 0.14)"
  danger: "#D92D20"
  danger-surface: "#FEF3F2"
  on-danger: "#FFFFFF"
  success: "#067647"
  success-surface: "#ECFDF3"
  on-success: "#FFFFFF"
typography:
  display-xl:
    fontFamily: "'Archivo Narrow', 'Archivo', 'Arial Narrow', sans-serif"
    fontSize: "2.35rem"
    fontWeight: "800"
    lineHeight: "0.92"
    letterSpacing: "-0.025em"
  display-md:
    fontFamily: "'Archivo Narrow', 'Archivo', 'Arial Narrow', sans-serif"
    fontSize: "1.65rem"
    fontWeight: "800"
    lineHeight: "0.95"
    letterSpacing: "-0.02em"
  title-card:
    fontFamily: "'Archivo Narrow', 'Archivo', 'Arial Narrow', sans-serif"
    fontSize: "1.2rem"
    fontWeight: "800"
    lineHeight: "1.05"
    letterSpacing: "-0.015em"
  eyebrow:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: "700"
    lineHeight: "1.2"
    letterSpacing: "0.1em"
  body-lg:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: "500"
    lineHeight: "1.45"
    letterSpacing: "0em"
  body-md:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: "400"
    lineHeight: "1.5"
    letterSpacing: "0em"
  caption:
    fontFamily: "'Archivo', system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: "500"
    lineHeight: "1.35"
    letterSpacing: "0.02em"
  mono-tabular:
    fontFamily: "'Consolas', 'JetBrains Mono', monospace"
    fontSize: "0.78rem"
    fontWeight: "700"
    lineHeight: "1.25"
    letterSpacing: "0.06em"
  button:
    fontFamily: "'Archivo Narrow', 'Archivo', sans-serif"
    fontSize: "0.95rem"
    fontWeight: "800"
    lineHeight: "1.1"
    letterSpacing: "0.03em"
rounded:
  none: "0px"
  pill-hole: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  section: "48px"
components:
  safety-ribbon:
    background: "{colors.primary}"
    color: "{colors.on-primary}"
    borderBottom: "1px solid {colors.hairline-strong}"
    padding: "{spacing.xs} {spacing.base}"
    typography: "{typography.eyebrow}"
    borderRadius: "{rounded.none}"
  top-nav:
    background: "{colors.ink}"
    color: "{colors.on-dark}"
    borderBottom: "1px solid {colors.hairline-dark}"
    padding: "{spacing.md} {spacing.base}"
  brand-stamp:
    background: "{colors.primary}"
    color: "{colors.on-primary}"
    padding: "{spacing.xs} {spacing.sm}"
    typography: "{typography.button}"
    borderRadius: "{rounded.none}"
  button-primary:
    background: "{colors.primary}"
    color: "{colors.on-primary}"
    border: "1px solid {colors.hairline-strong}"
    padding: "{spacing.md} {spacing.base}"
    typography: "{typography.button}"
    borderRadius: "{rounded.none}"
  button-primary-active:
    background: "{colors.ink}"
    color: "{colors.primary}"
    border: "1px solid {colors.primary}"
    padding: "{spacing.md} {spacing.base}"
    typography: "{typography.button}"
    borderRadius: "{rounded.none}"
  button-dark:
    background: "{colors.surface-dark}"
    color: "{colors.on-dark}"
    border: "1px solid {colors.hairline-strong}"
    padding: "{spacing.md} {spacing.base}"
    typography: "{typography.button}"
    borderRadius: "{rounded.none}"
  button-ghost-light:
    background: "{colors.surface-card}"
    color: "{colors.ink}"
    border: "1px solid {colors.hairline-strong}"
    padding: "{spacing.sm} {spacing.md}"
    typography: "{typography.button}"
    borderRadius: "{rounded.none}"
  highlight-mark:
    background: "{colors.primary}"
    color: "{colors.on-primary}"
    padding: "2px {spacing.xs}"
    borderRadius: "{rounded.none}"
  poster-wall:
    background: "{colors.wall}"
    color: "{colors.on-dark}"
    padding: "{spacing.lg} {spacing.base}"
  newsprint-sheet:
    background: "{colors.canvas}"
    color: "{colors.body}"
    borderTop: "1px solid {colors.hairline-strong}"
    padding: "{spacing.lg} {spacing.base}"
  paper-card:
    background: "{colors.surface-card}"
    color: "{colors.body}"
    border: "1px solid {colors.hairline-strong}"
    padding: "{spacing.base}"
    borderRadius: "{rounded.none}"
  masking-tape:
    background: "{colors.tape}"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.none}"
  split-flap-tile:
    background: "{colors.ink}"
    color: "{colors.on-dark}"
    border: "1px solid {colors.hairline-dark}"
    padding: "{spacing.sm} {spacing.md}"
    typography: "{typography.display-md}"
    borderRadius: "{rounded.none}"
  verdict-ticket:
    background: "{colors.surface-card}"
    color: "{colors.body}"
    border: "1px solid {colors.hairline-strong}"
    borderRadius: "{rounded.none}"
  ticket-stub:
    background: "{colors.primary}"
    color: "{colors.on-primary}"
    borderRight: "2px dashed {colors.hairline-strong}"
    padding: "{spacing.md}"
    borderRadius: "{rounded.none}"
  swatch-strip:
    background: "{colors.surface-card}"
    color: "{colors.body}"
    border: "1px solid {colors.hairline-strong}"
    padding: "{spacing.md} {spacing.base}"
    borderRadius: "{rounded.none}"
  drill-choice-card:
    background: "{colors.paper}"
    color: "{colors.body}"
    border: "1px solid {colors.hairline-strong}"
    padding: "{spacing.md} {spacing.base}"
    typography: "{typography.body-md}"
    borderRadius: "{rounded.none}"
  trap-alert-banner:
    background: "{colors.danger-surface}"
    color: "{colors.danger}"
    border: "2px solid {colors.danger}"
    padding: "{spacing.base}"
    borderRadius: "{rounded.none}"
  safe-pass-banner:
    background: "{colors.success-surface}"
    color: "{colors.success}"
    border: "2px solid {colors.success}"
    padding: "{spacing.base}"
    borderRadius: "{rounded.none}"
---

## Overview

**BaitCheck** adopts the **Bill-Poster & Print-Shop Editorial System** (`design-agency-v2` / Arkline template architecture from `getdesign.md`), translating physical street posters, split-flap counters, perforated tickets, and ink swatches into a razor-sharp mobile cyber-defense trainer. Rather than looking like a soft SaaS quiz or a generic blue-and-white government brochure, BaitCheck feels like an urgent, street-smart **warning press**: ink-black walls alternating with warm newsprint cream sheets, crisp `0px` edges, and a single high-voltage Signal Yellow (`{colors.primary}`) highlight color reserved for critical actions, timer bars, and verbal hooks.

**Key Characteristics:**
- **Alternating High-Contrast Walls & Paper:** Deep ink walls (`{colors.ink}`, `{colors.wall}`) strictly alternate with warm newsprint (`{colors.canvas}`) and crisp paper (`{colors.surface-card}`) bands.
- **Zero-Radius Physical Geometry (`{rounded.none}`):** Cards, buttons, tags, and tickets use sharp `0px` corners; only mechanical ticket punch holes use `{rounded.pill-hole}`.
- **Signal Yellow Focus:** `{colors.primary}` is the sole chromatic brand accent-deployed as slightly rotated highlighter blocks (`-1deg`), active CTA fills, perforated stubs, and countdown bars.
- **Tactile Print Metaphors Over Blur/Gradients:** Hierarchy comes from massive condensed uppercase headlines (`{typography.display-xl}`), `1px solid` ink borders (`{colors.hairline-strong}`), masking-tape strips (`{colors.tape}`), split-flap reaction counters (`{components.split-flap-tile}`), and dashed tear-off stubs (`{components.ticket-stub}`).
- **Mobile-First First-Screen Wow:** Fits cleanly in a `360px–430px` mobile viewport with zero horizontal scroll, instant tap-to-unlock audio, and `>=18px` always-on bilingual captions (`{typography.body-lg}`).

---

## Colors

### Brand & Accent
- `primary` (`#FEC917`): Signal Yellow - sole chromatic brand accent for the `BAITCHECK` stamp, primary drill start button, active tabs, highlighter blocks behind key words (`SCAM`, `60 SECONDS`, `TRAP`), and perforated verdict stubs.
- `on-primary` (`#0D0D0D`): Deep Ink Black - text and icons placed over Signal Yellow surfaces (`>= 13:1` contrast).

### Surface
- `ink` (`#0D0D0D`): Deep Ink Black - header navigation bar, incoming-call hero wall, split-flap counter backdrop, and colophon footer.
- `wall` (`#161616`): Charcoal Paste-Up Wall - secondary dark wall background behind pinned call/flyer sheets.
- `surface-dark` (`#1A1A1A`): Charcoal Card/Button - dark secondary action buttons and dark swatch strips.
- `canvas` (`#F2EFE7`): Warm Newsprint Cream - primary light surface for the Link X-Ray workbench, FAQ small-print, and challenge creator sections.
- `paper` (`#FCFAF6`): Warm Off-White Sheet - slightly brighter sheet for interactive drill choice cards and debriefs.
- `surface-card` (`#FFFFFF`): Pure Paper White - crisp cards, pinned notices, and Verdict Ticket body.
- `tape` (`#F1EDE5`): Masking Tape Strip - semi-matte warm cream rectangle pinning cards onto dark walls.
- `surface-muted` (`#EFEFEF`): Soft Newsprint Gray - inactive swatch strip and subtle table striping.
- `stone` (`#8E8B80`): Olive-Taupe Ink - secondary swatch strip and subtle metadata accents.

### Hairlines
- `hairline` (`rgba(13, 13, 13, 0.16)`): Subtle rule dividers inside tables, FAQ rows, and split-flap borders.
- `hairline-strong` (`#0D0D0D`): Crisp `1px` structural ink outline around cards, tags, buttons, and tickets.
- `hairline-dark` (`rgba(255, 255, 255, 0.14)`): Hairline divider on ink-black sections.

### Text
- `body` (`#1E1E1C`): Primary editorial dark ink for light surfaces.
- `muted` (`#5A5850`): Secondary dark-gray caption ink for eyebrows and subcopy.
- `on-dark` (`#F7F5EF`): Crisp warm white text on dark walls.
- `on-dark-muted` (`#B5B1A6`): Muted metadata ink on dark walls.

### Semantic
- `danger` (`#D92D20`): Trap Triggered / High Risk (`-₹50,000 SIMULATED LOSS`, high-risk URL flags).
- `danger-surface` (`#FEF3F2`): Light crimson paper tint for trap-alert banners.
- `on-danger` (`#FFFFFF`): White text on high-risk badges.
- `success` (`#067647`): Bait Dodged / Safe Check (`SURVIVED`, verified safe URL).
- `success-surface` (`#ECFDF3`): Light mint paper tint for pass banners.
- `on-success` (`#FFFFFF`): White text on pass badges.

---

## Typography

BaitCheck sets all display shouting in **`Archivo Narrow` / `Archivo Condensed`** and all readable UI/captions in **`Archivo`**, matching the template's explicit print-shop colophon.

| Role Token | Family | Size | Weight | Line Height | Tracking | Case & Usage |
|---|---|---:|---:|---:|---:|---|
| `display-xl` | `Archivo Narrow` | `2.35rem` | `800` | `0.92` | `-0.025em` | **ALL CAPS** - Hero & Finale verdicts (`INCOMING CALL`, `BAIT DODGED`). |
| `display-md` | `Archivo Narrow` | `1.65rem` | `800` | `0.95` | `-0.02em` | **ALL CAPS** - Section titles & split-flap counter digits (`92%`, `4.2s`). |
| `title-card` | `Archivo Narrow` | `1.2rem` | `800` | `1.05` | `-0.015em` | **ALL CAPS** - Drill card headers & Verdict Ticket headings. |
| `eyebrow` | `Archivo` | `0.6875rem` | `700` | `1.2` | `0.10em` | **ALL CAPS** - Numbered section tags (`01 · DRILL`, `02 · X-RAY`, `03 · REPORT`). |
| `body-lg` | `Archivo` | `1.125rem` | `500` | `1.45` | `0em` | Sentence case - Always-on EN/हिंदी drill captions (`>=18px` elder readability). |
| `body-md` | `Archivo` | `0.9375rem` | `400` | `1.50` | `0em` | Sentence case - Choice card labels, debrief notes, FAQ answers. |
| `caption` | `Archivo` | `0.78rem` | `500` | `1.35` | `0.02em` | Sublines, preset chips, reaction-time tags. |
| `mono-tabular` | `Consolas` / Mono | `0.78rem` | `700` | `1.25` | `0.06em` | Uppercase serial stamps (`NO. 0042`, `15.0s`, `xn--` Punycode tokens). |
| `button` | `Archivo Narrow` | `0.95rem` | `800` | `1.10` | `0.03em` | **ALL CAPS** - Crisp action labels (`ANSWER & START ->`). |

### Principles
1. **Condensed Shout, Clean Read:** Headlines use tight `{typography.display-xl}` condensation; drill dialogue never uses all-caps so elders and kids scan captions effortlessly at `{typography.body-lg}`.
2. **Tabular Discipline:** Countdown timers, reaction times (`ms`), and risk scores (`0–100`) use `font-variant-numeric: tabular-nums` so numbers never jitter during live countdowns.

### Note on Font Substitutes
Load `Archivo` and `Archivo Narrow` from Google Fonts (`https://fonts.googleapis.com`, permitted under Embarko CSP `https:`), with `Arial Narrow`, `Impact` (display fallback) and `system-ui, sans-serif` (body fallback) so offline/restricted browsers retain condensed vs. humanist proportions.

---

## Layout

- **Mobile-First Single-Column Spine:** Primary app shell caps at `480px` centered width on desktop (framed cleanly on a `{colors.wall}` desk backdrop) and fills `100%` width on phones (`360px–430px`) with `{spacing.base}` (`16px`) horizontal gutters.
- **Rhythmic Banding:** Top safety ribbon (`{colors.primary}`) → Top Nav (`{colors.ink}`) → Hero Incoming Call Wall (`{colors.wall}`) → Active Drill / Link X-Ray Workbench (`{colors.canvas}`) → Cohort Split-Flap Counter (`{colors.ink}`) → 1930 Tear-Off Playbook (`{colors.canvas}`) → Colophon Footer (`{colors.ink}`).
- **Whitespace Philosophy:** Generous vertical padding (`{spacing.lg}` inside cards, `{spacing.section}` between bands) ensures dense warning copy still breathes like a well-set broadsheet poster.

---

## Elevation

Physical print layering replaces soft SaaS drop shadows:
- **Level 0 (Wall / Floor):** Flat `{colors.wall}`, `{colors.ink}`, or `{colors.canvas}` surfaces separated by `1px solid {colors.hairline-strong}`.
- **Level 1 (Pasted Sheet):** `{colors.surface-card}` pinned with a top-center `{components.masking-tape}` rectangle and subtle `-0.8deg` / `+0.8deg` tilt (optional `3px 3px 0px {colors.ink}` hard offset ink shadow on active focus cards-never blurry `box-shadow`).
- **Level 2 (Sticky Safety Header):** Top `{components.safety-ribbon}` (`position: sticky; top: 0; z-index: 50`) guaranteeing simulation visibility across all scroll positions.

---

## Components

Every component key below maps 1:1 with the YAML `components:` registry:

- **`safety-ribbon`**: Full-width top strip using `{colors.primary}`, `{colors.on-primary}`, `{colors.hairline-strong}`, `{spacing.xs}`, `{spacing.base}`, `{typography.eyebrow}`, and `{rounded.none}`. Displays `SIMULATION • EDUCATIONAL SCAM DRILL - NO REAL DATA`.
- **`top-nav`**: Dark `{colors.ink}` bar with `{colors.on-dark}`, `{colors.hairline-dark}`, `{spacing.md}`, `{spacing.base}` holding the brand stamp on the left and `[EN | हिंदी]` + `[MENU / TABS]` on the right.
- **`brand-stamp`**: Rectangular `{colors.primary}` badge for `BAITCHECK` with `{colors.on-primary}`, `{spacing.xs}`, `{spacing.sm}`, `{typography.button}`, `{rounded.none}`.
- **`button-primary`**: Signal Yellow CTA using `{colors.primary}`, `{colors.on-primary}`, `{colors.hairline-strong}`, `{spacing.md}`, `{spacing.base}`, `{typography.button}`, `{rounded.none}` (`min-height: 48px`).
- **`button-primary-active`**: Inverted pressed/selected state using `{colors.ink}` background, `{colors.primary}` text/border, `{spacing.md}`, `{spacing.base}`, `{typography.button}`, `{rounded.none}`.
- **`button-dark`**: Secondary charcoal CTA using `{colors.surface-dark}`, `{colors.on-dark}`, `{colors.hairline-strong}`, `{spacing.md}`, `{spacing.base}`, `{typography.button}`, `{rounded.none}`.
- **`button-ghost-light`**: Crisp outlined paper button using `{colors.surface-card}`, `{colors.ink}`, `{colors.hairline-strong}`, `{spacing.sm}`, `{spacing.md}`, `{typography.button}`, `{rounded.none}`.
- **`highlight-mark`**: Inline tilted (`-1.2deg`) Signal Yellow marker block using `{colors.primary}`, `{colors.on-primary}`, `{spacing.xs}`, `{rounded.none}` behind key headline words.
- **`poster-wall`**: Dark paste-up container using `{colors.wall}`, `{colors.on-dark}`, `{spacing.lg}`, `{spacing.base}`.
- **`newsprint-sheet`**: Warm paper section using `{colors.canvas}`, `{colors.body}`, `{colors.hairline-strong}`, `{spacing.lg}`, `{spacing.base}`.
- **`paper-card`**: Pinned card using `{colors.surface-card}`, `{colors.body}`, `{colors.hairline-strong}`, `{spacing.base}`, `{rounded.none}`.
- **`masking-tape`**: Decorative top-center adhesive rectangle using `{colors.tape}`, `{colors.hairline}`, `{rounded.none}` (`width: 68px; height: 16px`).
- **`split-flap-tile`**: Mechanical score/timer block using `{colors.ink}`, `{colors.on-dark}`, `{colors.hairline-dark}`, `{spacing.sm}`, `{spacing.md}`, `{typography.display-md}`, `{rounded.none}` with a `1px` horizontal center split line.
- **`verdict-ticket`**: Two-part finale card using `{colors.surface-card}`, `{colors.body}`, `{colors.hairline-strong}`, `{rounded.none}` pairing a yellow stub with the Immunity summary.
- **`ticket-stub`**: Vertical perforated stub using `{colors.primary}`, `{colors.on-primary}`, `{colors.hairline-strong}`, `{spacing.md}`, `{rounded.none}` displaying serial number & punch hole.
- **`swatch-strip`**: Stacked Ink-Swatch accordion bar (used for the `1930 Golden-Hour 3-Step Playbook` and X-Ray breakdown rows) using `{colors.surface-card}`, `{colors.body}`, `{colors.hairline-strong}`, `{spacing.md}`, `{spacing.base}`, `{rounded.none}`.
- **`drill-choice-card`**: Tactile full-width tap card using `{colors.paper}`, `{colors.body}`, `{colors.hairline-strong}`, `{spacing.md}`, `{spacing.base}`, `{typography.body-md}`, `{rounded.none}` (`min-height: 52px`).
- **`trap-alert-banner`**: Simulated loss debrief box using `{colors.danger-surface}`, `{colors.danger}`, `{spacing.base}`, `{rounded.none}`.
- **`safe-pass-banner`**: Correct red-flag spotted box using `{colors.success-surface}`, `{colors.success}`, `{spacing.base}`, `{rounded.none}`.

---

## Responsive Behavior

| Breakpoint | Width Range | Layout & Navigation Behavior |
|---|---|---|
| **Mobile (Primary Target)** | `320px – 719px` | Full-width single-column stack (`16px` gutters), sticky `safety-ribbon`, compact `[BAITCHECK]` + `[EN/हिं]` + `[TABS]` header, stacked `verdict-ticket` (stub on top), `100%` width `drill-choice-card`s. |
| **Tablet** | `720px – 1023px` | Centered `540px` editorial sheet over `{colors.wall}` desk backdrop; 2-column split-flap counters and horizontal `ticket-stub`. |
| **Desktop** | `1024px – 1399px` | Centered `560px` phone-frame interactive stage on left + live 3-step `swatch-strip` / Cohort Split-Flap panel alongside on `1040px` max grid. |
| **Wide** | `1400px+` | Capped at `1120px` container (`margin: 0 auto`) so poster typography and line lengths remain punchy and scannable. |

### Touch Targets
- **WCAG AAA Compliance:** Every interactive `button-primary`, `button-dark`, `button-ghost-light`, preset chip, language toggle, and `drill-choice-card` enforces **`min-height: 44px`** (`48px–54px` for primary drill choices) with `8px` minimum vertical spacing to eliminate fat-finger mis-taps on budget Android screens.

### Collapsing Strategy
- Horizontal desktop tab bars collapse into a single-row scrollable or 3-column full-width segmented strip (`[DRILL] [X-RAY] [CHALLENGE]`) under `720px`.
- Multi-column Verdict Ticket (`stub` + `body`) stacks `stub` horizontally on top under `520px`.
- Tilted poster cards reduce rotation to `0deg` inside narrow `360px` drill viewports to guarantee zero edge clipping.

---

## Known Gaps
- **Light/Dark Theme Switch:** BaitCheck intentionally fixes its high-contrast alternating Ink/Newsprint palette rather than offering a user-toggled dark/light preference.
- **Audio & Voice Availability:** WebAudio synthesis timing and `window.speechSynthesis` Hindi voice availability vary across Android OEMs and muted iOS Safari; visual captions (`{typography.body-lg}`) serve as the guaranteed primary channel.
- **Custom Animation Curves:** Exact millisecond easing durations for the split-flap flip and call-ring pulse are defined in implementation CSS (`public/styles.css`) rather than YAML tokens.
