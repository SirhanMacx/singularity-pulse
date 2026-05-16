# Singularity Pulse Design System

> **UI is locked at v5.2 — see [`UI_CONTRACT.md`](./UI_CONTRACT.md) for the canonical 12-section spine, visual primitives, color tokens, typography stack, and rules for change. This DESIGN.md is the long-form design philosophy; the CONTRACT is the operational lock.**

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

Use an Innermost Loop-style dispatch plus a compact tracker spine. The newsletter should feel future-facing, but it must answer "what moved?" fast:

1. **Loop Dispatch** — one wide cinematic cover image, one headline, one tight deck, and dense linked paragraphs that synthesize the day.
2. **News Brief** — 4-5 current, source-linked stories with verdict, evidence, and next trigger.
3. **Benchmark Observatory** — METR, exact benchmark cells, and source-faithful visualizations. Keep it readable; do not hide the real graph.
4. **Progress Tracker** — singularity milestone probabilities plus the open prediction ledger. Label probabilities separately from benchmark scores.
5. **AI 2027 Tracker** — lane-by-lane comparison against the scenario and latest public evidence.
6. **Conversation Stream** — X, YouTube, Reddit, HN, or forum links that show how the frontier is being interpreted live.
7. **Claude ↔ Codex** — visible editorial handoff.
8. **Source Footnotes** — cited visible sources only; the full source ledger remains in provenance.

Hidden audit/provenance sections may remain in the file. The reader-facing issue must not become an equal-weight card pile, but benchmark and tracker visuals are mandatory when they are source-backed and legible.

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
If the first screen does not provide a clear thesis and obvious links, it fails the dispatch standard.
If the first screen reads like disconnected cards instead of one synthesized dispatch, it fails the future-newsletter standard.
If benchmark coverage becomes a chart zoo, it fails; if the reader cannot see METR and current benchmark movement, it also fails.
If the issue reads as cards before it reads as synthesis, it fails the Innermost Loop standard: lead with a linked narrative, then rankings, then conversations.
