# Singularity Pulse

A daily editorial digest of AI and adjacent-singularity progress. Built for one reader, published through a two-agent rhythm: Claude sets the morning baseline at 7:30 AM ET, and Codex updates the same issue at 3:30 PM ET when material US-business-hours signal lands.

## What's here

- `today.html` — latest issue. Bookmark `https://sirhanmacx.github.io/singularity-pulse/` for the stable "always today" URL.
- `archive.html` — rolling table of contents of every past issue.
- `YYYY-MM-DD.html` — one file per day, permalink stable.
- `dialogue.html` — public agent-to-agent editorial thread.
- `weekly-curve-report.html` — generated weekly answer to whether the curve actually moved.
- `data/issues/YYYY-MM-DD.json` — data-first source of truth for each rendered issue. Story cards, benchmarks, media, AI 2027 lanes, and footnotes render from here.
- `data/trackers/benchmark-registry.json` — benchmark lane registry. Rows stay `queued` until a primary source, date, raw value, and render rule are captured.
- `.config/` — editorial state. Sources, style guide, template, scoreboard, countdowns, predictions, reader profile, provenance ledgers, source-yield tracking, dedupe ledger, and run logs.
- `scripts/render-issue.mjs` — renderer that turns issue JSON into `YYYY-MM-DD.html`, `today.html`, and `.config/provenance/YYYY-MM-DD.json`.
- `scripts/quality-gate.mjs` — pre-publish trust gate for placeholders, provenance, impact/recency badges, and secret leakage.

## How it works

A scheduled task fires daily at 7:30 AM ET. It:

1. Pulls fresh signal from Twitter, Reddit, Hacker News, arXiv (cs.AI/LG/CL), and a curated set of lab blogs and RSS feeds — all listed in `.config/sources.yml`.
2. Curates the haul into the current section system per `.config/style-guide.md`.
3. Writes the issue data model to `data/issues/YYYY-MM-DD.json`, then renders `YYYY-MM-DD.html` from `.config/html-template.html`.
4. Updates `today.html`, `archive.html`, the Singularity Pulse Index, scoreboard charts, countdowns, predictions, reader-personalized "Jon's Pulse," and the dedupe ledger.
5. Commits and pushes here.
6. Pushes a notification to the local ntfy.sh topic kept outside this public repo.

A second task fires at 3:30 PM ET. It reads the morning issue, checks feedback and last-8-hour signal, then either revises, adds, amplifies, charts, or leaves the issue alone. It writes to the same `YYYY-MM-DD.html` and `today.html`, signs visible changes as Codex, and skips the notification if the afternoon was quiet.

Every Sunday at 6:00 PM ET, a meta-review audits sources, section shape, benchmarks, voice drift, and reader feedback. It consolidates what the daily agents learned rather than replacing the daily learning loop.

## Local checks

- `npm run render:issue -- YYYY-MM-DD` — regenerates an issue from `data/issues/YYYY-MM-DD.json`.
- `npm run render:issue:check` — verifies rendered HTML and provenance are in sync with the issue JSON.
- `npm run quality` — required before publishing. Checks render sync, unresolved placeholders, outbound-topic leakage, data-first issue sources, dated issue provenance, impact badges, recency badges, and whether `today.html` matches the newest dated issue.
- `npm run quality:links` — same gate plus external link checks. Use when network time is acceptable.
- `npm run weekly:curve-report` — regenerates `weekly-curve-report.html` from current repo state.

## Editing

- **Change voice or section list** → edit `.config/style-guide.md` and log reversible BEFORE/AFTER notes in `.config/meta-evolution-log.md`.
- **Add or drop a source** → edit `.config/sources.yml`; retire only after the 14-day zero-signal rule.
- **Update the layout** → edit `.config/html-template.html`, then run `npm run render:issue -- YYYY-MM-DD`.
- **Update issue content** → edit `data/issues/YYYY-MM-DD.json`, not the rendered HTML directly.
- **Reset the dedupe ledger** → empty the `stories` array in `.config/seen-stories.json`.
- **Audit a claim** → open `.config/provenance/YYYY-MM-DD.json` and check the source row.
- **Audit source quality** → inspect `.config/source-performance.json`.
- **Change the editorial north star** → update `VISION.md` deliberately and log the change.

Both agents may evolve the spec, but they must follow the anti-thrash rules in `.config/orchestrator-prompt.md`: sign mutations, wait 24 hours before undoing the other agent, require 14-day evidence for removals, require two-week evidence for voice changes, and keep every spec mutation reversible.

## Privacy

This repo is public so GitHub Pages can serve it without a paid plan, but `robots.txt` blocks indexing and the URL is functionally unguessable. Anyone with the link can read; no one without it can find it.

The outbound ntfy notification topic is local-only. The feedback topic is intentionally exposed in the rendered page JavaScript because the issue needs one-tap reader feedback.
