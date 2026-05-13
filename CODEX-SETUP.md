# Singularity Pulse — Codex Setup Guide

This is a two-agent, two-fire newsletter. Claude runs the **Morning Pulse** at 7:30 AM ET. Codex runs the **Afternoon Pulse** at 3:30 PM ET. Both agents read the same spec, both write to the same date-stamped HTML, both are allowed to mutate the spec under the rules in `.config/orchestrator-prompt.md`.

This file is the wiring guide for getting the Codex side stood up.

## Read these in order (Codex's first run will read them too)

1. **`VISION.md`** at the repo root — the editorial soul. The 8 singularity dimensions, the curve-impact thesis, the voice target, the two-agent philosophy. **Read this first every fire.** If anything elsewhere contradicts the vision, the vision wins.
2. **`.config/orchestrator-prompt.md`** — the shared daily workflow that both agents run (Step 0–11). Covers sourcing, recency gating, the Singularity Pulse Index computation, curve-impact tagging, evolution-log requirements.
3. **`.config/orchestrator-afternoon.md`** — the afternoon-specific extension. This is the canonical Codex workflow. Read what Claude wrote this morning, pick an editorial play (REVISE / ADD / AMPLIFY / CHART / STRUCTURE), recompute the SP-Index, sign with the Codex byline.
4. **`.config/style-guide.md`** — voice rules, recency gate, curve-impact tagging spec, chart primitives (inline SVG sparklines, bar charts, annotated screenshots, pull quotes).
5. **`.config/sources.yml`** — what to pull from. Twitter handles, subreddits, lab blogs, RSS, YouTube channels, leaderboards, robotics OEMs, adjacent-frontier URLs.
6. **`.config/evolution-log.md`** and **`.config/meta-evolution-log.md`** — running learning archives. Codex reads them before every fire, appends new entries on the way out.

## What Codex needs (capabilities)

1. **A Codex frontend** with task-scheduling support — the OpenAI Codex CLI, the OpenAI Agents SDK, or any harness that can fire a prompt on a cron.
2. **Auth for these resources** (same stack as Claude side):
   - `gh` CLI authed as a GitHub identity with push access to `SirhanMacx/singularity-pulse`
   - `curl` for arXiv API, lab blogs, RSS, ntfy POSTs
   - Web-fetch / web-search for HN, lab-blog scrapes, leaderboard pulls
   - Optional: Twitter/Reddit/YouTube reading capability (Codex's own browser tooling works fine — the spec is tool-agnostic)
3. **A scheduled-task config** firing at `30 15 * * *` America/New_York (3:30 PM ET). The exact mechanism depends on which Codex harness you're using.

## Two pieces Codex needs that are NOT in the public repo

These are kept local for security — anyone who has them can spam your iPhone:

- **`NTFY_TOPIC=singularity-pulse-jon-XXXXXXXXXXXX`** — outbound push topic. Set this in Codex's local task config.
- **`FEEDBACK_TOPIC=singularity-pulse-feedback-XXXXXXXXXXXX`** — reader-reaction topic. Also local.

Both values are visible on the Claude side at `~/.claude/scheduled-tasks/singularity-pulse-afternoon/SKILL.md` (the local canonical version of the afternoon prompt — has the actual topic strings filled in). Copy those values into Codex's task config.

(Note: the FEEDBACK_TOPIC is already exposed in the rendered HTML's inline feedback widget JS, so it's effectively public. The NTFY_TOPIC for outbound notifications is the only truly-sensitive one.)

## File hierarchy at a glance

```
singularity-pulse/  (repo root)
├── VISION.md                       ← THE SOUL. Read every fire.
├── CODEX-SETUP.md                  ← This file. Wiring instructions.
├── README.md                       ← What the project is, public.
├── today.html                      ← Always today's issue. Stable URL for ntfy Click.
├── index.html                      ← Redirects to today.html.
├── archive.html                    ← Rolling TOC of every past issue.
├── 2026-MM-DD.html                 ← One per day.
└── .config/
    ├── orchestrator-prompt.md      ← Shared daily workflow (both agents)
    ├── orchestrator-afternoon.md   ← Codex-specific extension
    ├── style-guide.md              ← Voice + chart primitives
    ├── sources.yml                 ← What to pull from
    ├── html-template.html          ← Base template w/ inline CSS
    ├── progress.json               ← Running scoreboard (SP-Index, benchmarks, releases)
    ├── seen-stories.json           ← 14-day dedupe ledger
    ├── evolution-log.md            ← Daily learning entries (both agents append)
    ├── meta-evolution-log.md       ← Weekly + as-needed spec mutations
    └── run-log.jsonl               ← Per-fire append-only history with self-grades
```

## How a Codex afternoon fire works (summary)

(See `.config/orchestrator-afternoon.md` for the full workflow with copy-pastable bash.)

1. Pull repo. Read VISION.md, today's morning issue, Claude's run-log + evolution-log entries from today, last 8 hours of reader feedback events.
2. Pull afternoon-fresh signal (last 8 hours since the 7:30 AM Claude fire). Apply the same hard recency gate as the morning prompt.
3. Pick an editorial play: REVISE a morning take, ADD new items, AMPLIFY a story that grew, CHART something visually, or STRUCTURE (add a new section).
4. Recompute the Singularity Pulse Index with afternoon data. If it moved >2 points, surface the delta.
5. Update today's HTML. Append `by Codex · 3:30 PM ET` byline to the masthead. Sign every new item/revision/chart with HTML comments.
6. Update state files (progress.json, seen-stories.json, run-log.jsonl, evolution-log.md, meta-evolution-log.md if any spec mutation).
7. Commit with `[codex]` tag. Push.
8. Fire afternoon ntfy push (skip if quiet — no padding to justify the cron).

## Anti-thrash rules (both agents)

These live in `.config/orchestrator-prompt.md`. Both agents must follow them or the newsletter destabilizes:

1. **Sign every commit** with `[claude]` or `[codex]` in the commit message body or author.
2. **24-hour cooldown on undoing the other agent.** Claude removed a section this morning? Codex can't restore it today. Wait for tomorrow morning.
3. **Subtractions need 14-day signal.** Sources / sections retired only after 14 days of zero/empty data.
4. **Additions are liberal.** Each agent can add freely. If the other agent uses your addition tomorrow, it sticks.
5. **Voice changes need 2-week signal.** No whimsical voice rewrites.
6. **Reader `suggest` feedback always trumps agent opinions on ties.**
7. **Every spec mutation is reversible** — BEFORE values logged in `meta-evolution-log.md`.

## Different voice, same product

The newsletter benefits from two editorial sensibilities, but the *product* is one daily issue, signed by both. Two ntfy pushes per day (morning + afternoon if material), one daily URL, one ongoing evolution log with entries signed by both agents.

When the two agents disagree about a story's framing, that disagreement should be visible in the issue itself — Claude's morning take stays, Codex's afternoon revision marker (`<span class="revised">revised</span>`) sits next to it, and both stand. The reader gets to see the actual editorial conversation.

## How to remove Codex if it stops working out

Just stop firing the afternoon cron. The morning Claude fire stands alone — the architecture degrades gracefully. The meta-evolution-log will show whether the two-agent period produced better signal or just noise.

## Suggested first-run sanity check

Before scheduling the cron:

1. Manually fire one afternoon run end-to-end. Verify the issue updates, both bylines appear in the masthead, the SP-Index recomputes, the ntfy push lands on the iPhone.
2. Open the published `today.html` on a phone. Tap a `Go deeper on this tomorrow →` link in a section Codex contributed. Verify the feedback event lands in the feedback topic.
3. Check `git log` — confirm the commit is signed `[codex]` and the author shows Codex.
4. Read `evolution-log.md` and `run-log.jsonl` — confirm the Codex entries follow the format.

If all four pass, schedule the cron and let it run.

## When in doubt

Re-read `VISION.md`. The newsletter has one editorial question for every decision: **how does this bend the curve?** If the answer is "it doesn't," cut. If the answer is "I'm not sure," that's also a cut.
