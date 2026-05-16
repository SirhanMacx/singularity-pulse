# UI CONTRACT — Singularity Pulse

**Status:** LOCKED at v5.2 (commit `a4381cb`, 2026-05-16 Sat 12:35 PM ET)
**Approved by reader (Jon):** *"Yes this is it. Can you add a file to the network to cement this UI and only change it if there is some compelling reason to?"*

This file is read by both agents (Claude AM + Codex PM) before every fire. Treat it as law unless the reader explicitly overrides.

---

## 1. The 12-section canonical spine (in order)

| # | Section | id / class | What it is | Why it earns its space |
|---|---------|------------|------------|------------------------|
| 1 | Masthead | `header.masthead` | Title + date + agent byline + TOC | Identifies the publication |
| 2 | Issue plate | `.issue-plate` | `ISSUE #N · DATE · SKIM-MIN · STREAK · BRIER` | Magazine-style daily artifact anchor |
| 3 | Score gauges | `.gauge-grid` | SP-Index ring · Jon's Pulse ring · Brier stadium · Cadence streak | Hero numbers, alive-not-static |
| 4 | Loop dispatch lead | `section.loop-dispatch` | Accelerando-voice 3-4 paragraph lead with hero image | The story of the day, in confident prose |
| 5 | Named Tape | `.named-tape` | 5+ insider X items + 20-handle daily rotation | What the AI community is *actually* discussing |
| 6 | Leaderboard | `.lb-section` (`#benchmark-compass`) | 4-card Current Leaders strip → horizontal bar chart → METR trend → ranked table | The verified state of the frontier |
| 7 | Scoreboard 2027 | `.scoreboard-2027` | 6 AI-Futures milestones with status pills + evidence links | Predicted-vs-actual accountability |
| 8 | Open Ledger | `.open-ledger` | Resolving / Live / Just Resolved + Brier scatter at small n | Public prediction-tracking |
| 9 | Link Stream | `.media-discussion` | Fresh X / YouTube / Reddit cards | Discussion-layer signal |
| 10 | Tech Tales | `.tech-tales` | 150-300w Stross-voiced fiction coda + "Things that inspired this" | The Accelerando promise, made literal |
| 11 | Sources & methodology | `.source-footnotes` | Footnotes for cited evidence only | Falsifiability |
| 12 | Receipts Ledger | `.receipts-ledger` | 6 running falsifiable counters | Quiet rigor |

Hidden (CSS-controlled by `body.condensed-pulse accelerando-pulse loop-pulse`):
- Legacy v4-and-earlier sections (`.top-signal`, `.stack`, `.leaks`, `.bench-wars`, `.countdowns`, `.predictions`, `.voices`, `.videos`, `.papers`, `.robotics`, `.adjacent`, `.progress`, `.horizon-wrap`, `.watching-wrap`, `.dialogue-footer`, `.jon-lens`, `.design-protocol`, `.morning-brief`, `.sp-index`, `.futures-console`, `.editorial-disagreement` non-conversation, `.scoreboard`, `.hero`, `.news-brief-condensed`, `.ai-2027-watch`, `.forecast-radar`, `.agent-conversation`)

These hidden sections remain in the rendered HTML for backward-compat but do not display.

---

## 2. Visual primitives (LOCKED)

**Colors** — single source of truth in `:root`:
```
--bg: #020617
--fg: #E8EEF7        (NOT cyan-tinted)
--muted: #94A3B8
--very-muted: #5B6B82
--accent: #7CF7FF    (cyan, signature)
--accent-2: #C084FC  (purple, secondary)
--accent-3: #34D399  (green, positive)
--negative: #FB7185
--warning: #FBBF24
--rule: rgba(148,163,184,0.14)
```

**Score-zone palette** (used by gauges):
- < 25 — `#3D7BFF` (cold blue)
- 25–49 — `#00C2A8` (teal)
- 50–74 — `#F5D547` (amber) *← SP-Index currently here*
- 75–89 — `#FF8A3D` (orange)
- 90+ — `#FF3D5A` (red)

**Lab-color palette** (used by leaderboard bars):
- Anthropic — `#A78BFA` (purple)
- OpenAI — `#34D399` (green)
- Google — `#FBBF24` (amber)
- DeepSeek — `#7CF7FF` (cyan)
- Meta — `#F472B6` (pink)
- xAI — `#FB7185` (rose)

**Typography stack**:
- Display: `Fraunces` (weights 400/600/800, opsz variable)
- Sans: `Inter` (with feature settings `ss01`, `cv11`)
- Mono / data: `JetBrains Mono` (tabular-nums on all numeric classes)

**Mobile floors** (≤520px):
- Body: 16px (iOS form-zoom threshold)
- Hero: 36px / letter-spacing -0.04em
- Container padding: 16px 14px
- Card padding: 14px

**Chart primitives** (no chart library — pure SVG):
- Horizontal bar chart (leaderboard) — gradient fills, leader-highlighted, lab-colored
- METR Time Horizon trend (log-y, frontier rolling-max line + gradient area fill, slate dots for non-frontier)
- Apple-Activity-Rings radial gauge (SP-Index, Jon's Pulse)
- Stadium bar with target tick (Brier)
- Dot-grid streak with pulsing last dot (cadence)
- Calibration scatter (small-n predictions ledger)

---

## 3. Editorial voice rules (LOCKED)

**Voice**: Accelerando-dense. Stross-style. Short clauses. Present continuous. World-building specificity. No editorial "we." No "swipe →". No "Per Agent N". No "Verifier flagged". No "card carousel". No tour-guide narration of the UI.

**The grep-and-kill list** — these phrases must NEVER appear in rendered copy:
- `swipe`, `scroll through`, `tap to`, `click to`
- `Per Agent`, `Verifier (Agent N)`, `our model`, `the system`
- `Manifold-style`, `scroll-snap`, `card carousel`, `pill`, `above-the-fold`
- `each card`, `each row`, `the section below`, `as you'll see`
- `Jon ran N parallel agents`, `Synthesized into vN`
- `we'll be tracking`, `see below`, `the following`

Machinery belongs in the colophon, footnotes, and `.config/` artifacts — never in body copy.

---

## 4. What may change WITHOUT this contract being updated

These are normal daily fire mutations and need no special review:

- **Content**: news items, named-tape items, source rows, scoreboard rows, predictions
- **Data**: `data/issues/YYYY-MM-DD.json` — issues add freely
- **Numbers**: SP-Index, Brier, countdowns, METR data points
- **Tech Tales body** — a new ~200-word fiction coda per fire
- **Loop-dispatch lead** — new prose, same voice
- **Receipts ledger values** — daily updates
- **CSS color tokens** — single-hex swaps for seasonal themes (clear in commit message)

---

## 5. What REQUIRES reader approval before merging

These are structural changes. They have caused regressions before. Don't ship without explicit go-ahead in the conversation thread:

1. Adding, removing, or reordering any of the 12 spine sections
2. Replacing a visual primitive (e.g. bar chart → scatter, ring → bar)
3. Changing the body class set (`condensed-pulse accelerando-pulse loop-pulse`)
4. Rewriting `scripts/render-issue.mjs` structurally
5. Rewriting `.config/html-template.html` structurally
6. Introducing a chart library or large JS dep
7. Renaming any of the locked section headers (Named Tape, Open Ledger, Tech Tales, etc.)
8. Changing the magazine-masthead format
9. Modifying the score-zone or lab-color palette
10. Adding meta-commentary back into the body copy

If you're about to do any of these, **post in the conversation thread first** and wait for an explicit "yes" from the reader.

---

## 6. Failure modes already encountered (don't repeat)

**Codex 23dbad6 ("Rebuild Singularity Pulse tracker spine")** — silently rewrote 1,184 lines of HTML, reverted "Swipe right →", reshuffled layout, lost the polished spine. Reverted in `3361f80`.

**Claude v5 (`adcf6ae`)** — claimed to "rebuild leaderboard + score gauges" but accidentally DROPPED 5 of the 8 polished v4 sections (Named Tape, Scoreboard 2027, Open Ledger, Tech Tales, Receipts Ledger). Caught by reader; fixed in `a4381cb` (this version).

**Claude v5.1 uPlot scatter (`4c6bb89`)** — added a 50KB canvas chart library that produced an illegible scatter at iPhone size. Reverted in same v5.2 pass, replaced with pure SVG horizontal bar chart + METR trend.

---

## 7. Process: how to propose a change to this contract

1. Read the current contract.
2. Identify which sections / primitives / rules the change touches.
3. Articulate a *compelling* reason: a real reader complaint, a measurable improvement, a structural bug, a new section that earns its space.
4. Post the proposal in the conversation thread before touching code.
5. Wait for explicit reader approval.
6. If approved: implement, update this file with a new "Approved by reader" line and date, bump the version (v5.2 → v5.3), commit with `[ui-contract]` tag in the message.

---

## 8. Versioning

| Version | Date | Commit | Reader approval | What changed |
|---------|------|--------|-----------------|--------------|
| v5.2 | 2026-05-16 | `a4381cb` | *"Yes this is it."* | Restored v4 spine + v5.1 bar chart + METR trend + gauges + Codex tape cherry-pick |

---

*— Last touched by Claude · 2026-05-16 12:50 PM ET*
