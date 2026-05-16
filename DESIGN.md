# Singularity Pulse Design System

## Product Standard

Singularity Pulse should feel like a private intelligence terminal from 2030, not a generic newsletter. The reader opens it to answer one question: **where is the curve bending today?**

The interface has three jobs:

1. **Orient fast** — the first screen shows the curve state, Jon’s personal weighting, and the day’s strongest signal.
2. **Prove claims** — benchmarks and charts must be traceable to primary sources, dated, caveated, and visually labeled.
3. **Reward exploration** — richer visuals, media, dialogue, and predictions should make the issue feel alive without burying the prose.

## Visual Language

- **Background**: deep-space black/blue with subtle neon gradients; avoid beige paper unless deliberately rendering archive material.
- **Cards**: glassy dark panels, thin cyan borders, restrained glow. Glow is emphasis, not decoration.
- **Typography**: Fraunces for big editorial identity; Inter for prose; JetBrains Mono for data, timestamps, source status, and labels.
- **Motion/interaction**: prefer native `details` disclosure, anchor jumps, tabs, and SVG hover/tap affordances. Avoid fragile JS unless it adds real value.
- **Generated/illustrative art**: allowed only when labeled as art. It must never imply benchmark evidence.

## Required Issue Architecture

Use a condensed spine. The newsletter should feel future-facing, but it must read in minutes:

1. **Command Deck** — above-the-fold delta, SP-Index, Jon Pulse, proximity estimate, confidence, next watch, and direct actions.
2. **Signal Brief** — 3-4 punchy curve-moving items with Brief / Evidence / Forecast view toggles.
3. **Benchmark Cockpit** — source-faithful Benchmark Observatory with lane filters and “changed / unchanged / needs audit” labels.
4. **AI 2027 Tracker + Forecast Radar** — compare observed evidence to the scenario, then show the next triggers that would move tomorrow’s curve.
5. **YouTube / X / Reddit** — one compact media/social tray. Rotate links every material push.
6. **Claude ↔ Codex** — short editorial handoff between agents.
7. **Source Footnotes** — all visible sources live at the bottom as numbered footnotes. The footnotes change every material push unless a source remains the live evidence spine.

Hidden audit/provenance sections may remain in the file, but the reader-facing issue must follow the spine above.

## Benchmark Rules

- No invented trend lines.
- No projection unless explicitly labeled forecast and separated from source data.
- No “amalgamated score” until all included rows have primary source URLs, dates, raw values, and a written normalization formula.
- METR Time Horizon plots must use primary METR data and show p50 and p80 separately.
- The METR caveat must be visible when values exceed the current reliable measurement range.
- Every benchmark panel needs a progress sentence: “what moved since last issue?” If nothing moved, say so and keep it short.
- When multiple benchmark families appear, render `benchmark_panel.matrix`: model/system, benchmark, exact value, eval/source date, caveat, and `source_ids`. Do not imply one amalgamated score unless the normalization formula is audited.

## AI 2027 Tracker Rules

- Treat AI 2027 as a scenario forecast, not settled prophecy.
- Always compare three things: original scenario milestone, latest AI Futures revision, and today’s observed evidence.
- Separate capabilities, geopolitics, robotics, and alignment. Do not mark “on track” globally when only one lane is moving.
- Cite the AI 2027 primary PDF/website and the latest model/update source whenever this section appears.

## Source Footnote Rules

- Put all reader-facing sources in bottom footnotes.
- Rotate the footnote set on every material push; if the exact same source stays, explain why it remains central.
- Keep source footnotes short. They are evidence rails, not a second article.

## Quality Bar

If the issue could be mistaken for a Substack template, it fails.
If a chart requires trust without source traceability, it fails.
If the reader cannot tell what moved today within 15 seconds, it fails. The lead story and source chips must be visible on the first screen.
If a visual is impressive but not useful, it fails.
If the first screen does not provide a next watch or action, it fails the command-center standard.
