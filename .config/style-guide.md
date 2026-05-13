# Singularity Pulse — Editorial Style Guide

## Voice

Karpathy-meets-Stratechery. Direct, opinionated, technically literate, but readable in the morning before coffee fully hits. Treat the reader as a smart generalist who follows AI but doesn't need ALL the context spelled out. Trust them.

**Yes**: "GPT-5.2 takes the SWE-bench crown — 84.3% verified, up from 78% in October. The autonomy curve is bending faster than the compute curve, which is the actually-interesting part."

**No**: "In a groundbreaking announcement that has sent shockwaves through the AI community, OpenAI today unveiled their latest model..."

## Rules

1. **Cut 30% of the first draft.** Always.
2. **Strong verbs, no adverbs.** "Shipped" beats "successfully released."
3. **Numbers over adjectives.** "32k → 1M context" beats "much larger context window."
4. **No hype clichés.** Banned: "in a stunning development," "game-changing," "revolutionary," "the future is now," "AI is taking over," "experts say."
5. **Lead with the verb.** "Anthropic shipped..." "Google announced..." "Karpathy argues..."
6. **Source links inline.** Never "[source]" at the end. Hyperlink the relevant noun: "[Anthropic shipped](url) Claude 4.7..."
7. **Quote sparingly.** One per section max.
8. **No "we" or "us."** Singular, observant voice.
9. **One hero image per issue.** TOP SIGNAL gets it. Don't pad with stock visuals.

## Sections (in this order — 11 sections total, ~15-22 min total read)

### 🔥 TOP SIGNAL (2–3 paragraphs, ~300 words)
Most important development of the past 24 hours. P1: what happened (concrete, numbers). P2: why it matters (the real insight). P3 (optional): what to watch next. Picks ONE hero image — verify the URL returns 200 before locking.

### ⚡ THE STACK (4–6 items, ~50 words each)
Punchy secondary roundup. Each: verb-led `<h3>` headline + 2–3 sentence take + inline source link. Mix releases, benchmarks, lab moves, policy moves, market moves, infrastructure.

### 🕵️ LEAKS & RUMORS (2–4 cards)
NEW SECTION. Pull from `sources.yml > twitter_rumor_accounts` (testingcatalog, apples_jimmy, btibor91, kimmonismus, etc.), LMArena anonymous-model appearances, leaked system prompts, UI-string sleuthing, code-name surfacing in product copy. Each card:
- `<span class="leak-tag">TAG</span>` — one of: `Confirmed-by-leak` · `Stealth-launched` · `Roadmap` · `Codename` · `Speculation`
- Headline (verb-led)
- 2-3 sentences with link to the source post

If today's leak haul is thin, ship 1-2 cards and move on. Better short than padded.

### 📈 BENCHMARK WARS (1-3 tables)
NEW SECTION. Always include:
1. **LMArena Text Leaderboard top 10** (table) — rank, model, org, Elo. Gold/silver/bronze styling on top 3.
2. **This week's SOTA shifts** (table) — benchmark, leader, score, note. Cover ARC-AGI-2, GPQA-Diamond, SWE-bench-Verified, SWE-bench-Pro, Terminal-Bench, UK AISI Cyber, WildClawBench, MMLU, FrontierMath, AIME — whichever moved this week.

End with a 1-line italic caveat about CI overlap / vote-count vs rank when relevant.

### 💬 VOICES (3-5 items)
Tweets/threads. Render TWO formats:
1. **Embedded tweets** (`<blockquote class="twitter-tweet">`) — use this when you have a real, verifiable tweet URL with status ID. The widgets.js script (already in template) transforms these into rendered tweet cards on load.
2. **Plain blockquote** (`<blockquote class="voice">`) — fallback for paraphrased / multi-source / non-Twitter quotes.

Aim for 2-3 embedded + 1-2 plain. Mix labs (Amodei/Hassabis/Altman) with researchers (Karpathy/Sutskever/LeCun) with curators (Jack Clark / AI Explained / swyx). Prefer measured analysis over hot takes.

### 🎬 TRENDING VIDEOS (2-3 YouTube embeds)
NEW SECTION. Pull from `sources.yml > youtube_channels`. Embed as:
```html
<div class="video">
  <div class="frame-wrap"><iframe src="https://www.youtube.com/embed/VIDEO_ID" loading="lazy" allowfullscreen></iframe></div>
  <div class="vmeta"><p class="vtitle">Title</p><p class="vbody">1-2 sentence what-and-why.</p></div>
</div>
```
Pick videos from this week. Prefer Dwarkesh long-form interviews, AI Explained explainer drops, Two Minute Papers research summaries, MLST deep-dives. Verify video IDs return 200 (no embed-disabled videos).

### 📜 PAPERS WORTH KNOWING (2–3 picks)
arXiv picks from cs.AI/cs.LG/cs.CL, last 24h. Per paper:
- Title (linked to arXiv abstract)
- Plain-English what-it-says (one sentence)
- Why-you-care (one sentence — the real contribution, not the abstract's claim)
- Authors + institution + date

Skip incremental work. Look for new capability demos, surprising negatives, novel architectures, alignment findings, anything Karpathy or LeCun retweets.

### 🧬 ADJACENT FRONTIER (1–2 items)
BCI / longevity / robotics / space / biotech. Same punchy roundup format as STACK. Framing: how-this-bends-the-curve. Don't force it — better one good item than two padded ones.

### 📊 PROGRESS METERS (10-15 rows)
Monospace rows in `.meters`. Pull from `progress.json`. Each row: label + value + delta arrow.
- ARC-AGI-2 SOTA, GPQA-Diamond SOTA, SWE-bench Verified/Pro SOTA, Terminal-Bench, UK AISI Cyber
- LMArena top Elo, Releases last 30d, Cyber-attack range cleared, Stealth-on-Arena
- arXiv volume (yesterday vs 7d avg)

Arrows: ↑ (gain), ↓ (loss), → (flat). Color via `.delta-up` / `.delta-down` / `.delta-flat`.

### 🔮 ON THE HORIZON (~80 words)
One speculative forward-look grounded in current trends. "If X continues, then Y in roughly 6-18 months." Argue from data, not vibes.

### 🎯 WORTH WATCHING (~30 words)
One specific dated thing. "Google I/O May 19-20." "Anthropic dev day Tuesday." Just a heads-up.

## Dedupe

Before locking a story, check `seen-stories.json`. If URL or near-duplicate headline appeared in last 3 issues AND nothing materially new — skip.

## Self-check before commit

- [ ] Did I cut 30%?
- [ ] Any hype clichés? Strike them.
- [ ] TOP SIGNAL P2 says something non-obvious?
- [ ] LEAKS & RUMORS: every claim has a source link? Tags applied correctly?
- [ ] BENCHMARK WARS: leaderboard data fresh (<24h)? CI caveat included if rank ≠ vote-quality?
- [ ] VOICES: at least 2 embedded tweets with real status IDs? widgets.js script present?
- [ ] TRENDING VIDEOS: every video ID verified 200? Embed allowed?
- [ ] PAPERS: each has plain-English summary that's NOT just the abstract?
- [ ] PROGRESS METERS updated in `progress.json`?
- [ ] Read `seen-stories.json`, skipped repeats?
- [ ] Hero image actually loads (URL HEAD returned 200)?
- [ ] Would I be excited to open this on my phone tomorrow morning?
