# Singularity Pulse — Meta-Evolution Log

Where the **spec itself** evolves to keep up with changing times. Distinct from `evolution-log.md` (daily editorial adjustments). This log captures structural changes: sources added/removed, sections promoted/retired, benchmarks tracked/dropped, voice targets shifted.

The weekly meta-cron (`singularity-pulse-meta`, fires Sunday 6:00 PM ET) runs the audit and writes an entry here. Daily agents may now make reversible spec mutations under the anti-thrash rules in `orchestrator-prompt.md`; the weekly task consolidates those changes, audits drift, and restores anything that moved too fast.

## Why a separate weekly loop

The daily loop has two jobs: (a) ship today's issue, (b) note one small editorial adjustment for tomorrow. It may also add small reversible spec improvements when the day's evidence calls for them.

The weekly loop has one job: **make sure the newsletter is still in the right shape for the world it covers.** AI moves fast — new labs emerge, old voices go quiet, new benchmarks supplant old ones, the line between robotics and "AI" blurs further. The spec written today won't fit a year from now. The weekly review is the periodic check-in that catches drift and turns daily experiments into durable practice only when the evidence supports them.

## Entry format

```
## YYYY-MM-DD · Week N · Meta-Review

**Audit window**: last 7 daily issues (#N–#M), N feedback events, N daily evolution-log entries.

**Sources added**:
- handle/URL · why · first sighting that triggered the add

**Sources removed**:
- handle/URL · why · 14-day zero-signal stretch confirmed?

**Sections changed**:
- promoted/retired/renamed: <details>

**Benchmarks added/dropped**:
- name · why

**Voice / style-guide updates**:
- <description>

**Reader-suggested gaps the agent hasn't filled yet** (carry-forward list):
- <items from `suggest` feedback that don't have a spec change yet>

**Bet for the coming week**:
- <one prediction about what the AI landscape will surface that the current spec might miss>
```

## Hard rules for spec mutations

1. **Be conservative on subtractions.** Never delete a source or retire a section without 14 days of consistent zero-signal data. Silent ≠ dead.
2. **Be liberal on additions.** Better to track too many sources and curate aggressively than to miss an emerging lab.
3. **No rapid voice flips.** Voice/style-guide changes need 2 weeks of consistent reader signal before getting locked in.
4. **Every mutation is reversible.** Every spec change in this log must include the old value, so future-you can revert in one commit if it doesn't pan out.
5. **The reader's `suggest` notes always win ties.** If the agent's audit says "remove section X" but a reader suggested expanding section X within the audit window, the reader signal trumps.

## Source-discovery prompts (the agent runs these every Sunday)

The agent should look for emerging sources to add, not just audit existing ones:

1. **New labs**: Has a new AI lab been mentioned in HN/Reddit/Twitter 5+ times in the audit window? Look at the latest YC batch, latest Anthropic/OpenAI alumni splinter launches.
2. **Rising voices on X**: Are there X handles being retweeted by the existing tracked researchers more than 3x in the audit window? Those are candidates.
3. **New YouTube channels**: AI-content channels crossing 100k subscribers in the audit window.
4. **New benchmarks**: Has a benchmark been cited 10+ times across this week's papers? Track it.
5. **New leaderboards**: Has a new ranking site emerged with research-credibility (not just SEO)?
6. **Cross-domain emergence**: Is something previously "adjacent" (e.g., longevity) now overlapping enough with core AI to merit a promotion?

## What to retire (audit checklist)

- **A source** with 14+ days of zero signal → propose retirement
- **A section** with 14+ days of `📭 quiet` → propose retirement OR merge into adjacent section
- **A benchmark** no longer tracked by any frontier lab in the audit window → drop
- **A YouTube channel** that hasn't posted in 60 days → drop
- **A voice target** ("Karpathy-meets-Stratechery") that no longer fits — only after 2+ weeks of feedback suggesting voice mismatch

## Watch list — emerging signals to track for promotion

(The agent updates this every week with names/topics it's noticing but not yet promoting.)

- Thinking Machines Lab — promoted to first-class watch May 12 2026 after their first research post in 8 months. If they ship product, promote @miramurati to first-class voice and add their blog as a lab_blog.
- Reka, Liquid AI, Adept successors — small labs to watch
- "Spatial intelligence" / World Labs — Fei-Fei Li's thesis. Currently in robotics.foundation_models; may deserve its own subsection if it lands a major paper.
- AI-safety institute evals (UK AISI, US CAISI, Singapore IMDA) — these are emerging as benchmark replacements for in-lab ones.

---

## 2026-05-12 · Week 1 · Meta-Review (seed entry)

**Audit window**: Issue #1 only (today's dry run). No 7-day history yet.

**Sources added**: (initial seed already in sources.yml — see commit history)

**Sources removed**: none.

**Sections established**: 12-section template (Top Signal · Stack · Leaks · Bench Wars · Voices · Videos · Papers · Robotics · Adjacent · Progress Meters · Horizon · Watching).

**Benchmarks tracked at launch**: MMLU, GPQA-Diamond, ARC-AGI, ARC-AGI-2, SWE-bench-Verified, SWE-bench-Pro, Terminal-Bench-2.0, METR-autonomy-horizon, FrontierMath, AIME-2025, WildClawBench, UK-AISI-Expert-Cyber.

**Voice target**: Karpathy-meets-Stratechery. Cut 30%. No hype clichés. Numbers over adjectives.

**Reader-suggested gaps**: none yet — no feedback events. First real Sunday review will have signal.

**Bet for the coming week**: Google I/O (May 19–20) will surface Gemini Omni and Gemini 4. Expect a flood of 24h-fresh material on May 19. Also bet: Thinking Machines posts again within 7 days now that they've broken silence. If so, promote @miramurati to first-class voice.

**One thing established about the meta-loop itself**: The weekly cron is separate from daily. Daily runs are bounded around the issue but may make small reversible spec mutations. Weekly runs audit, consolidate, and correct those mutations.

## 2026-05-13 · Week 1 · Daily Spec Mutation [codex]

**Audit window**: Issue #1 dry-run baseline plus user direction to make the project more interesting and trustworthy.

**Sources added**: none.

**Sources removed**: none.

**Sections changed**: Added three reusable trust/interest surfaces to the issue template: `What changed`, `Source ledger`, and `Agent disagreement`; promoted the Predictions section with a `Prediction market` lead-in.

**Benchmarks added/dropped**: none.

**Voice / style-guide updates**: Added trust-layer rules for `verified`, `estimated`, `synthetic`, `reader-feedback`, and `rolling-state`; added explicit guidance that disagreement must be real and specific.

**Reader-suggested gaps**: The project needed more trust and less self-referential agent theater.

**Bet for the coming week**: The source ledger will catch more quality issues than prose review because stale/estimated/synthetic claims become visible before publication.

## 2026-05-14 · Week 1 · Daily Spec Mutation [codex]

**Audit window**: Issue #2 plus reader escalation that the newsletter needs a stronger foundation before the next morning fire.

**Sources added**: none.

**Sources removed**: none.

**Sections changed**: Added a reusable `Futures Console` section between the Singularity Pulse Index and TOP SIGNAL. BEFORE: the template jumped from the index/source-ledger zone into narrative sections, leaving predictions scattered across Horizon, Worth Watching, and Countdowns. AFTER: near-term radar gets a dedicated section, nav anchor, HTML placeholder, CSS primitive, and `.config/futures-console.json` state file.

**Benchmarks added/dropped**: none.

**Voice / style-guide updates**: Added rules that the Futures Console must include a dated window, curve dimension, thesis, trigger, confidence meter, and evidence link. It is explicitly a radar, not a rumor dump.

**Reader-suggested gaps**: The reader wanted the product to feel more futuristic, more useful on quiet days, and less dependent on whether a single breaking-news item exists.

**Bet for the coming week**: The Futures Console will make morning editions feel more alive because Claude can show live watchpoints and concrete movement triggers before prose curation starts.

## 2026-05-14 · Week 1 · Daily Spec Mutation [codex] · visual readability pass

**Audit window**: Issue #3 plus reader complaint that some graphs are hard to read and the afternoon edition should capture online discussion after the Codex update.

**Sources added**: none to `sources.yml`.

**Sources removed**: none.

**Sections changed**: Added a reusable `Online discussion pulse` primitive for compact community-signal readouts. BEFORE: online discourse had to be squeezed into prose or VOICES. AFTER: a three-card visual can separate primary fact, community mood, and curve read without pretending discussion equals verified adoption.

**Benchmarks added/dropped**: none.

**Voice / style-guide updates**: Template chart defaults now use larger SVG label text, heavier line strokes, stronger gridlines, and larger chart display height. BEFORE: `.v81-bigchart` labels were 8-10px and lines were 2px. AFTER: labels are 10-12px with text stroke, lines are 3px, and charts render taller on phone.

**Reader-suggested gaps**: The reader explicitly named hard-to-read graphs and wanted more online discussion / UX polish as part of the afternoon fire.

**Bet for the coming week**: Readability improvements will matter more than adding more charts; one legible chart plus a clear "what to see" caption beats eight tiny graphics.

## 2026-05-14 · Week 1 · Daily Spec Mutation [codex] · Benchmark Compass

**Audit window**: Reader complaint after the Codex afternoon pass: scoring was unclear and inconsistent; benchmarks and METR time horizon were not visible enough; the newsletter should visualize the singularity rather than just narrate it.

**Sources added**: none to `sources.yml`; added `.config/benchmark-dashboard.json` as a canonical benchmark state file.

**Sources removed**: none.

**Sections changed**: Added `Benchmark Compass` after SCOREBOARD. BEFORE: Benchmark Wars mixed leaderboard tables with prose, while SP-Index, countdown probabilities, and prediction confidences used different score vocabularies. AFTER: source-faithful benchmark plots with raw values, source dates, scale labels, and caveats. A 0-100 composite was attempted, then paused after reader feedback because the source rows and normalization were not yet audited enough.

**Benchmarks added/dropped**: Promoted METR Time Horizon 1.1 to first-class benchmark dashboard input using `https://metr.org/assets/benchmark_results_1_1.yaml`. Dropped the interim composite weights until GPQA / ARC-AGI-2 / SWE / FrontierMath / open-frontier rows are refreshed from primary sources.

**Voice / style-guide updates**: Added uniform score bands: early, threshold, frontier, rupture, post-human. Agents must label whether a number is a benchmark score, probability, or SP-Index value.

**Reader-suggested gaps**: The reader specifically wanted METR time horizon, an amalgamation of benchmarks, clearer scoring, interactive graphs, and more singularity visualization.

**Bet for the coming week**: The Benchmark Compass will reduce confusion only if it is boringly accurate first. Add the next visualization one benchmark at a time from primary data, not from project-state snapshots.

## 2026-05-14 · Week 1 · Daily Spec Mutation [codex] · v9 Future Terminal

**Audit window**: Reader rejected the patched visual direction as low-quality and asked to revisit from the top: "newsletter from the future," personalized, interactive/holographic, benchmark-rich, and singularity-tracking.

**Sources added**: Added `DESIGN.md` as the visual/product standard. Added `assets/generated/singularity-observatory-holo.svg` as labeled illustrative UI art.

**Sources removed**: none.

**Sections changed**: Added `Future Deck`, `Personal Singularity Lens`, and `design protocol` modules before the normal issue brief. Renamed the garbage "Benchmark Compass" framing to `Benchmark Observatory`.

**Benchmarks added/dropped**: No new benchmark rows yet. Hard rule added: future benchmark visualizations are added one at a time only after primary-source audit.

**Voice / style-guide updates**: The issue should feel like a private future intelligence terminal, not a generic newsletter. Illustrative art must be labeled as art; data visuals must stay source-faithful.

**Reader-suggested gaps**: Holographic/future UI, personalization, more benchmark visualizations, and a cleaner path to singularity tracking remain active priorities.

**Bet for the coming week**: The next successful iteration will come from a disciplined dashboard system, not more prose or louder glow.

## 2026-05-14 · Week 1 · Daily Spec Mutation [codex] · v9.1 Condensed Spine

**Audit window**: Reader said the future-terminal reset was improving but still too much. Requested a strict newsletter sequence: news, benchmarks with progress, AI 2027 comparison, YouTube/X/Reddit, Claude/Codex conversation, then source footnotes that change each push.

**Sources added**: Added AI 2027 primary/source expectations to the issue spine: `https://ai-2027.com/ai-2027.pdf`, AI Futures launch/update posts, and live AI 2027 discussion/media surfaces as footnote candidates.

**Sources removed**: none from source config; visible top source ledger is de-emphasized in favor of bottom footnotes.

**Sections changed**: BEFORE: visible issue sprawled across Future Deck, Jon Lens, protocol cards, SP-Index, Futures Console, Source Ledger, Scoreboard, Stack, Leaks, Videos, Papers, Robotics, Adjacent, etc. AFTER: visible flow is `News Brief` → `Benchmark Observatory` → `AI 2027 Tracker` → `YouTube / X / Reddit` → `Claude ↔ Codex` → `Source Footnotes`. Old sections may remain hidden for audit compatibility.

**Benchmarks added/dropped**: No new benchmark rows. Added the rule that Benchmark Observatory must include a progress sentence before tables.

**Voice / style-guide updates**: Added condensed-spine, AI 2027 Tracker, and bottom-footnote rotation rules to `DESIGN.md`, style guide, morning orchestrator, and afternoon orchestrator.

**Reader-suggested gaps**: The reader wanted less volume, clearer source handling, an AI 2027 comparison, and fresher YouTube/X/Reddit surfaces.

**Bet for the coming week**: Shorter issues will feel more authoritative because every visible module has a job. If a section cannot fit into the spine, it probably belongs in footnotes or hidden audit state.

## 2026-05-15 · Week 1 · Spec Mutation [codex] · v10 Data-First Newsletter Spine

**Audit window**: Reader rejected the current product as not a real newsletter: insufficient actual links, weak news story mechanics, unclear benchmark data, and a tracker that felt decorative.

**Sources added**: Added `data/issues/YYYY-MM-DD.json` as the canonical issue content layer and `data/trackers/benchmark-registry.json` as the benchmark lane registry. These are local data/source contracts, not new external feeds.

**Sources removed**: none.

**Sections changed**: BEFORE: agents could hand-shape rendered HTML and then backfill provenance. AFTER: agents write source-backed story objects first, render the visible spine from JSON, and let the renderer produce dated HTML, `today.html`, and provenance.

**Benchmarks added/dropped**: Added benchmark lane statuses: `live-primary`, `source-linked`, `queued-primary-audit`, and `tracked-nonstandard`. Composite scoring remains paused until exact primary rows and normalization rules exist.

**Voice / style-guide updates**: Added the rule that a real newsletter starts with actual linked stories, then benchmark evidence, then AI 2027 lane comparison, then social/media discussion.

**Reader-suggested gaps**: Actual links, actual news stories, real data visualizations, and a trustworthy tracker toward the singularity.

**Bet for the coming week**: The renderer and source schema will prevent cosmetic fixes from outrunning evidence. Claude should edit issue JSON tomorrow, not raw HTML.
