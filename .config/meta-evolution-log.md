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
