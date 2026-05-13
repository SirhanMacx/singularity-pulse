# Singularity Pulse — Adding the Afternoon Codex Fire

This is a two-agent, two-fire newsletter. Claude runs the morning fire at 7:30 AM ET. Codex runs the afternoon fire at 3:30 PM ET. Both agents read the same spec in `.config/`, both write to the same date-stamped HTML, both are allowed to mutate the spec under the rules in `orchestrator-prompt.md`.

This file documents what Codex needs to be wired up.

## What Codex needs

1. **OpenAI Codex CLI installed** (or whichever Codex frontend you're using). The orchestrator instructions are model-agnostic — no Claude-specific tool names baked in.
2. **Auth for these resources**, the same as the Claude side:
   - `gh` CLI authed as a GitHub identity with push access to `SirhanMacx/singularity-pulse`
   - `curl` (for arXiv, lab blogs, RSS, ntfy POSTs)
   - Web-fetch / web-search capability for HN, lab-blog scrapes, leaderboard pulls
   - Optional: agent-reach equivalent for Twitter/Reddit/YouTube (Codex's own browser tooling works fine)
3. **A scheduled-task config** that fires the afternoon prompt at `30 15 * * *` America/New_York. Exact mechanism depends on Codex's scheduler.

## The prompt Codex runs

Stored locally (not in the public repo, for security — same as Claude's morning SKILL.md):

`~/.codex/scheduled-tasks/singularity-pulse-afternoon/PROMPT.md` (or wherever Codex stores task prompts)

The Claude-side SKILL.md at `~/.claude/scheduled-tasks/singularity-pulse-afternoon/SKILL.md` is the canonical version. Copy-paste it into Codex's equivalent. The runtime constants (NTFY_TOPIC, FEEDBACK_TOPIC, REPO, PUBLIC_URL) are already in there.

Set `AGENT=codex` in the runtime constants block so commits, evolution-log entries, and run-log entries are signed correctly.

## What Codex does each afternoon (summary)

1. Pulls the repo, reads what Claude wrote this morning + Claude's run-log + reader feedback events from the last 8 hours.
2. Pulls afternoon-fresh signal (last 8 hours since the morning fire).
3. Picks an editorial play: **REVISE** a morning take, **ADD** new items, **AMPLIFY** a story that grew, **CHART** something visually, or **STRUCTURE** (add a new section).
4. Recomputes the Singularity Pulse Index with afternoon data.
5. Updates today's `YYYY-MM-DD.html` and `today.html`. Appends a `by Codex · 3:30 PM ET` byline to the masthead.
6. Updates state files (`progress.json`, `seen-stories.json`, `run-log.jsonl`, `evolution-log.md`, and `meta-evolution-log.md` if it mutated the spec).
7. Commits with `[codex]` tag in the commit message body.
8. Fires the afternoon ntfy push (different framing from morning — "what changed since coffee").

## Hard rules so the two agents don't thrash

These live in `.config/orchestrator-prompt.md` — both agents read them every fire:

1. **Sign every commit** — `[claude]` or `[codex]` in the commit message body OR commit author.
2. **24-hour cooldown on undoing the other agent.** If Claude removed a section this morning, Codex can't add it back today. Wait for tomorrow morning.
3. **Subtractions need 14-day signal.** Removing a source or section needs 14 days of zero/empty signal. Same as before.
4. **Additions are liberal.** Either agent can add freely. If the other agent uses the addition tomorrow, it sticks.
5. **Voice changes need 2-week signal.** No whimsical voice rewrites.
6. **Reader `suggest` feedback always trumps agent opinions on ties.**
7. **Every spec mutation is reversible** — BEFORE values logged in `meta-evolution-log.md`.

## Suggested afternoon vibe (for the prompt's editorial flavor)

The morning fire is **establishing** — what landed overnight, what shape today takes. The afternoon fire is **reactive** — what landed during US business hours that the morning missed.

Good afternoon angles:
- Anthropic/OpenAI/DeepMind blog posts that landed mid-day
- Late-day arXiv submissions (the cutoff for "today's papers" shifts during the day)
- Stock-market reactions to morning AI news
- Researcher Twitter takes that emerged after morning coffee
- Conference / event news (most announcements happen 1-4 PM ET)

If the afternoon is quiet — fire a brief "📭 Index unchanged · no material moves" update and skip the ntfy. Don't manufacture content to justify the cron.

## Different voice, same product

The newsletter benefits from two editorial sensibilities, but the *product* is one daily issue, signed by both. Two ntfy pushes per day (morning + afternoon if material), one daily URL, one ongoing evolution log with entries signed by both agents.

When the two agents disagree about a story's framing, that disagreement should be visible in the issue itself — Claude's morning take stays, Codex's afternoon revision marker (`<span class="revised">`) sits next to it, and both stand. The reader gets to see the actual editorial conversation.

## How to remove Codex if it stops working out

Just stop firing the afternoon cron. The morning Claude fire stands alone — the architecture degrades gracefully. The meta-evolution-log will show whether the two-agent period produced better signal or just noise.
