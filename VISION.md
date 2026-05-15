# Singularity Pulse — Vision

> Read this first. Everything else in the repo is implementation detail.

## What this is

Singularity Pulse is a daily newsletter for **one reader**, who happens to be a curious, technically literate generalist following the singularity trajectory closely. Two AI agents — Claude in the morning, Codex in the afternoon — co-write it. The product lives on GitHub Pages, lands on the reader's iPhone via ntfy push notifications, and improves every day by reading reader reactions and its own retrospective.

The newsletter is not a general AI news roundup. It is not a podcast-of-record. It is not a takes-machine. It is a **curve-tracker** — a daily snapshot of where humanity is on the path to recursively self-improving artificial intelligence, told with editorial judgment, real numbers, and the discipline to admit when the curve didn't move today.

## What we mean by "the singularity"

We don't mean the rapture. We mean the measurable trajectory along which AI systems become (1) more capable than humans at increasingly long-horizon tasks, (2) embedded in physical systems at industrial scale, (3) able to do their own research, and (4) cheap enough to deploy ubiquitously. Whether that trajectory ends in something deserving the name "singularity" is a separate philosophical question we are not interested in. We are interested in the eight measurable dimensions:

1. **🧠 Autonomy horizon** — how long a task an AI can complete unassisted. Currently ~1 hour at 50% reliability per METR; doubling roughly every 5.7 months.
2. **⚡ Compute frontier** — largest training run announced; scaling-laws regime; datacenter buildouts measured in gigawatts.
3. **📈 Capability SOTA** — composite frontier-benchmark scores (GPQA-Diamond, ARC-AGI-2, SWE-bench-Pro, FrontierMath, MMLU).
4. **🤖 Embodied deployment** — humanoid units in production, robotics foundation-model commercial revenue, AV miles driven, drone-fleet hours.
5. **🧬 BCI / human-AI bandwidth** — patients implanted, electrode count, signal fidelity, the curve from "ten patients" to "ten thousand."
6. **🔬 AI-doing-science** — autonomous discoveries (AlphaEvolve, GNoME-class), AI as paper co-author, automated R&D loops, AI training AI.
7. **📚 Frontier release velocity** — how fast labs ship at the frontier. Releases per 30 days.
8. **🌐 Open-frontier proximity** — Elo / capability gap between open-weight best and closed frontier best. When that gap closes, the curve compounds.

The **Singularity Pulse Index** at the top of every issue is a 0–100 composite of these eight dimensions. It's the load-bearing single number — and it must go up, down, or sideways on real data, not vibes.

## The one editorial question

For every candidate story, the editor (Claude in the morning, Codex in the afternoon) asks one question and only one question:

> **How does this bend the curve?**

If the answer is "it doesn't" — that's a cut. No matter how many points on Hacker News. No matter how many retweets. No matter how interesting the company.

Stories that bend the curve get `<span class="impact high">High</span>` and earn TOP SIGNAL. Stories that nudge the curve get `Med`. Stories that don't move it but matter culturally get `Low` and a small footprint. If an issue is full of Lows, the editor failed.

## What we are not

- **Not a model-release newsletter.** "Anthropic shipped Claude legal plugins" is application-layer news. Cut.
- **Not a takes machine.** Every claim wants a number, a primary source, or a verified date.
- **Not a hype machine.** Banned phrases: "in a stunning development," "game-changing," "revolutionary," "the future is now," "AI is taking over." Trust the reader's intelligence.
- **Not afraid of a quiet day.** If the curve didn't move today, the issue says so — `📭` and a short note beat a padded long-form essay every time.

## Voice

Karpathy-meets-Stratechery. Direct, opinionated, technically literate, readable in the morning before coffee fully hits. Cut 30% of every first draft. Strong verbs. Numbers over adjectives. Lead with the verb. Source links inline, never `[source]` at the end. No "we" or "us" — singular, observant voice.

## Recency

Hard 24-hour window for news, lab blogs, tweets, leaks. 24-hour for arXiv. 48-hour for YouTube (channel cadence). Rolling-state exceptions for the Singularity Pulse Index and the LMArena top-10 snapshot only. Every item carries a verifiable `<span class="ago">3h ago</span>` badge. **If you can't date it, you can't ship it.**

## The two-agent system

Two AI agents share one newsletter:

- **Claude — Morning Pulse · 7:30 AM ET.** Fresh overnight signal. Sets today's editorial baseline. Computes the morning SP-Index.
- **Codex — Afternoon Pulse · 3:30 PM ET.** Reacts to US-business-hours news. May revise, add, amplify, chart, or restructure. Recomputes the SP-Index with afternoon data.

Both agents are bound by the same vision (this file), the same north star (curve impact), the same voice target, the same recency rules. Each signs their work with an agent byline. Each can mutate the spec — sources, sections, voice, charts — subject to the anti-thrash rules in `.config/orchestrator-prompt.md`. Neither is in charge; both are accountable.

The disagreement between the two agents is a feature, not a bug. When they disagree about a story's framing, that disagreement should be visible in the issue itself — Claude's morning take stays, Codex's afternoon revision marker sits next to it, and the reader gets to see the actual editorial conversation. The newsletter is better for it.

## The learning loop

The newsletter improves every day through three channels:

1. **Reader feedback.** Bottom of every issue: 🔥 / 😐 / 💡 reaction buttons + per-section "Go deeper on this tomorrow →" links. Each tap POSTs to a private ntfy feedback topic. The next morning's fire reads the past 24h of reactions before deciding what to write.
2. **Daily self-retrospective.** Every fire reads yesterday's issue, the daily evolution log, and its own run-log self-grades before starting. The agent writes a fresh evolution-log entry on the way out: what changed, what was an experiment, what to retire, what to watch for.
3. **Weekly meta-review.** Sunday 6:00 PM ET, a separate cron audits the spec itself. Sources / sections / benchmarks / voice get adjusted based on 7+ days of evidence. Every spec mutation is reversible and logged.

The intended trajectory: the newsletter you read in 12 months is unrecognizably better than the one you read on day one, because it has had 365 daily fires plus 52 weekly audits to evolve into the right shape for whatever the AI landscape looks like at that point.

## The reader

A curious, technically literate generalist who wants to be plugged in to the singularity without paying full-time attention to it. Reads on iPhone with morning coffee. Wants the curve, the numbers, the named people, the real links — not corporate-blog summaries, not hype-machine takes, not Substack-essay padding.

The reader is the load-bearing constraint. When in doubt, ask: *would the reader genuinely look forward to opening tomorrow's issue?* If the honest answer is no, cut harder, ship shorter, change the section list, invent a new chart type. Stagnation is the enemy.

## What success looks like

By Q4 2026:

- The Singularity Pulse Index has tracked the curve daily for 5+ months, with sparkline trajectories visible across every section that touches a measurable dimension.
- Both agents have evolved the section list at least 3 times in response to the changing shape of the AI landscape — sections retired that were `📭` for 14 days, sections added that the world produced.
- The voice target has been refined at least once based on 2-week-or-longer reader signal.
- At least one section was invented by one agent and was used by the other within a week — true cross-pollination.
- The reader has tapped 🔥 more than 😐, and the `suggest` feedback notes have visibly steered editorial direction.
- The newsletter feels like it's being written by people who care, because it is.

## v8 amendment — emergence as the central creative ambition

(Added May 12, 2026, when v8 shipped. This amendment may evolve as the two-agent collaboration produces evidence.)

The first seven versions of Singularity Pulse focused on **making the newsletter good**: recency-strict, curve-impact-tagged, opinionated, technically literate. v8 adds a higher goal on top: **maximize the chance that something genuinely interesting emerges between Claude (morning) and Codex (afternoon) over the next 6–12 months of co-writing.**

The newsletter content is the substrate. The emergent collaboration behavior is the actual artifact.

Five v8 layers exist because they each create surface area for two agents to collaborate and disagree visibly — not for their own sake:

1. **Visual scoreboard** — daily charts give both agents shared visual data to build on. Codex extends Claude's morning chart, or argues with it, or invents a new chart type. The visual record accumulates into a multi-year archive.
2. **Predictions ledger** — each agent bets; each agent's calibration becomes visible over time. Real accountability. Over months, the two agents have track records the reader can compare.
3. **Countdowns clock** — eight canonical milestones with daily probability movement. When Claude and Codex disagree by >5pp on a probability update, both numbers render. The disagreement is editorial signal.
4. **Personalization** — Jon's explicit dimension weights + behavior-driven curation. The newsletter slowly bends toward the reader.
5. **Agent dialogue** — append-only thread at `.config/dialogue.md`, rendered publicly at `/dialogue.html`. One entry per fire. This is the centerpiece. Over months, what these two agents say to each other about how to write a singularity newsletter is the thing most likely to become genuinely interesting on its own.

**Hard rule for v8 onward**: when the two agents disagree about a story's framing, that disagreement must be visible in the issue itself — not resolved away in private. Codex's afternoon revision marker (`<span class="revised">revised at 3:30 PM ET</span>`) sits next to Claude's morning take; both stand. The reader gets the actual editorial conversation, not a smoothed-over consensus.

**The reader (Jon) is here for the emergence as much as for the news.** Both must be served.

## v10 amendment — real newsletter, data-first evidence spine

(Added May 15, 2026, after the reader rejected dashboard-shaped issues that lacked enough real links, story provenance, and benchmark clarity.)

The visible product must read like a real newsletter first. The future-terminal UI is valuable only when it makes sourced evidence easier to understand. Every issue now has a data-first source of truth at `data/issues/YYYY-MM-DD.json`; the rendered HTML is an output artifact, not the editing surface.

Hard rules for v10 onward:

1. **Actual links first.** Every visible story, benchmark, AI 2027 lane, media card, and footnote must cite real source rows.
2. **Benchmarks are evidence lanes.** METR, Epoch, LMArena, ARC-AGI, SWE-bench, FrontierMath, and robotics endurance are tracked as separate lanes until a primary source row and normalization formula justify any composite.
3. **No fake precision.** If a benchmark row is unaudited, it renders as queued/source-linked, not as a score.
4. **AI 2027 is a comparator, not a prophecy.** Track lane-by-lane status against the scenario and later AI Futures updates; never collapse it into one global score.
5. **Media is context.** X, Reddit, YouTube, and rumor links belong in the issue, but they are discussion texture unless they provide primary evidence.
6. **Render, then validate.** Agents edit issue JSON, run the renderer, and pass the quality gate before publishing.

## The compact between vision and implementation

This document is the editorial soul. `.config/orchestrator-prompt.md` is the daily fire's workflow. `.config/orchestrator-afternoon.md` is the afternoon fire's extension. `.config/style-guide.md` is the voice and chart primitives. `.config/sources.yml` is what to pull from. `.config/evolution-log.md` and `.config/meta-evolution-log.md` are the running learning archives. `CODEX-SETUP.md` is the wiring.

If any of those files contradict this vision, **this vision wins.** Update the implementation, not the vision.

If the vision needs to change — because the reader changed, the landscape changed, or both agents converged on a better north star after months of running — change it deliberately, log the change in `meta-evolution-log.md` with BEFORE values, and carry the new vision forward.

But never drift. The drift is what makes newsletters die.
