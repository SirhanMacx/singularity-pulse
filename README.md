# Singularity Pulse

A daily editorial digest of AI and adjacent-singularity progress. Built for one reader, published at 7:30 AM ET every morning.

## What's here

- `today.html` — latest issue. Bookmark `https://sirhanmacx.github.io/singularity-pulse/` for the stable "always today" URL.
- `archive.html` — rolling table of contents of every past issue.
- `YYYY-MM-DD.html` — one file per day, permalink stable.
- `.config/` — editorial state. Sources, style guide, template, scoreboard, dedupe ledger.

## How it works

A scheduled task fires daily at 7:30 AM ET. It:

1. Pulls fresh signal from Twitter, Reddit, Hacker News, arXiv (cs.AI/LG/CL), and a curated set of lab blogs and RSS feeds — all listed in `.config/sources.yml`.
2. Curates the haul down to eight sections per `.config/style-guide.md`.
3. Renders `YYYY-MM-DD.html` from `.config/html-template.html`.
4. Updates `today.html`, `archive.html`, the progress scoreboard, and the dedupe ledger.
5. Commits and pushes here.
6. Pushes a notification to the ntfy.sh topic in `.config/ntfy-topic.txt`.

## Editing

- **Change voice or section list** → edit `.config/style-guide.md`. Next morning's issue reflects it.
- **Add or drop a source** → edit `.config/sources.yml`.
- **Update the layout** → edit `.config/html-template.html`.
- **Reset the dedupe ledger** → empty the `stories` array in `.config/seen-stories.json`.

## Privacy

This repo is public so GitHub Pages can serve it without a paid plan, but `robots.txt` blocks indexing and the URL is functionally unguessable. Anyone with the link can read; no one without it can find it.
