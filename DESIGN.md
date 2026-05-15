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

1. **Future Deck** — a compact command deck with today’s curve, the reliability gap, Jon’s priority lane, and one illustrative observatory asset.
2. **Personal Singularity Lens** — renders Jon’s explicit weights from `reader-profile.json`; do not rewrite them automatically.
3. **Issue Brief** — two small cards: what changed and trust posture.
4. **SP-Index / Jon’s Pulse** — daily curve movement, not a benchmark composite.
5. **Source Ledger** — visible, specific, and honest about unavailable channels.
6. **Benchmark Observatory** — source-faithful benchmark panels. Raw values first; composites only after audited normalization.
7. **News Sections** — Top Signal, Stack, Leaks, Bench Wars, Voices, Videos, Papers, Robotics, Adjacent.
8. **Predictions / Countdowns / Dialogue** — accountability and agent disagreement.

## Benchmark Rules

- No invented trend lines.
- No projection unless explicitly labeled forecast and separated from source data.
- No “amalgamated score” until all included rows have primary source URLs, dates, raw values, and a written normalization formula.
- METR Time Horizon plots must use primary METR data and show p50 and p80 separately.
- The METR caveat must be visible when values exceed the current reliable measurement range.

## Quality Bar

If the issue could be mistaken for a Substack template, it fails.
If a chart requires trust without source traceability, it fails.
If the reader cannot tell what moved today within 15 seconds, it fails.
If a visual is impressive but not useful, it fails.
