# Singularity Pulse — Editorial Style Guide

## Editorial north star (read this first)

**Singularity Pulse exists to track the singularity trajectory, not AI generally.** Every editorial decision filters through one question: **how does this bend the curve?**

The curve has eight measurable dimensions; the **Singularity Pulse Index** (top of every issue) is the composite. An item earns space only if it moves at least one of these:

1. **🧠 Autonomy horizon** — how long a task an AI can complete unassisted (METR 50%/80% task length). Currently ~1h, doubling ~5.7 months.
2. **⚡ Compute frontier** — largest training run announced, datacenter buildouts, FLOPs scale.
3. **📈 Capability SOTA** — composite of frontier benchmarks (GPQA-D, ARC-AGI-2, SWE-bench-Pro, FrontierMath, MMLU).
4. **🤖 Embodied deployment** — humanoid units in production, robotics foundation-model commercial revenue.
5. **🧬 BCI / human-AI bandwidth** — patients implanted, electrode count, signal fidelity.
6. **🔬 AI-doing-science** — autonomous discoveries (AlphaEvolve, GNoME-class), AI-as-co-author papers, automated R&D.
7. **📚 Frontier release velocity** — how fast labs ship at the frontier (releases per 30d).
8. **🌐 Open-frontier proximity** — gap between open-weight best and frontier closed best.

**An item that doesn't move any of these is not Singularity Pulse content, regardless of HN traffic.** "Anthropic launched legal plugins" is application-layer news, not curve news. Cut.

## Curve-impact tagging (every narrative item)

Every item in TOP SIGNAL, THE STACK, LEAKS, PAPERS, ROBOTICS, and ADJACENT FRONTIER carries an inline curve-impact badge:

- `<span class="impact high">High</span>` — concretely moves at least one of the 8 dimensions with a verifiable number. Belongs in TOP SIGNAL or front of STACK.
- `<span class="impact medium">Med</span>` — credibly relevant to a dimension but incremental, or has structural implications without a clear metric move. Most STACK items.
- `<span class="impact low">Low</span>` — surfaced because of community signal (HN front page, viral tweet) but doesn't move the curve. Use sparingly. If everything's Low, you've drifted off-thesis — cut harder, ship shorter.

If you can't tag an item, it doesn't belong in the issue.

**TOP SIGNAL must be High-impact.** No exceptions. If today has no High-impact item, ship a quiet day notice and lead with the strongest Med.

## Trust layer (provenance, freshness, estimates)

Every rendered claim should be auditable. The issue must render a compact source ledger near the top and write the full ledger to `.config/provenance/YYYY-MM-DD.json`.

Use these labels consistently:

- `verified` — primary source or timestamp/number directly checked.
- `estimated` — a reasoned estimate; the prose must say it is estimated.
- `synthetic` — chart backfill or illustrative baseline; never frame it as observed history.
- `reader-feedback` — derived from feedback taps or suggestions.
- `rolling-state` — current leaderboard/progress-meter snapshot.

If a number is estimated or synthetic, the badge is not optional. Trust beats drama.

## Agent disagreement

The two-agent system only matters if disagreement is visible and specific. Each issue should include an `Agent disagreement` block:

- If Claude and Codex disagree, show both frames and the evidence that created the split.
- If they agree, state the assumption the second agent tested.
- Do not invent disagreement for theater. "No material disagreement yet" is acceptable on quiet days.

## Prediction-first reading

Predictions are the durable value of the project. The top of the Predictions section should act like a tiny market board: top live bets, confidence, movement since last update, and next resolution date. Daily news earns attention partly by how it changes a probability.

## Futures Console

The Futures Console is the issue's forward radar. It sits immediately after the Singularity Pulse Index and before TOP SIGNAL. Its job is to make even quiet mornings useful by showing what could move the curve next.

It is not a speculation blog. Every card needs a dated window, curve dimension, thesis, trigger, confidence meter, and evidence link. Good cards say "what would change my mind"; weak cards say "something might happen soon." Cut weak cards.

Render from `.config/futures-console.json`:

```html
<div class="future-grid">
  <article class="future-card primary">
    <p class="future-kicker">24h · 🤖 embodied deployment · active</p>
    <h3 class="future-title">Figure F.03 endurance evidence</h3>
    <p class="future-body">The stream matters if it exposes intervention rate, recovery behavior, or task diversity.</p>
    <p class="future-trigger"><strong>Trigger:</strong> human-intervention count or hours logged changes the embodied score.</p>
    <div class="future-meter"><span class="fm-label">conf</span><span class="fm-track"><span class="fm-fill" style="width:62%"></span></span><span class="fm-value">62%</span></div>
  </article>
</div>
<div class="watch-rail"><span class="watch-pill">Google I/O May 19-20</span></div>
```

## Chart primitives (both agents use these — feel free to invent more)

The newsletter should feel **alive**. When a story is better told visually, build it inline with SVG. No external chart libraries. iOS Safari renders all of this natively. Sign each chart with an HTML comment naming the agent and time.

### Sparkline — trend over time

Use for: Singularity Index trajectory, benchmark score progression, FLOPs ramp.

```html
<span class="sparkline">
  <svg viewBox="0 0 120 32" preserveAspectRatio="none">
    <!-- baseline-fill polygon under the line -->
    <path class="fill" d="M0,28 L20,24 L40,22 L60,18 L80,15 L100,10 L120,8 L120,32 L0,32 Z" />
    <path class="line" d="M0,28 L20,24 L40,22 L60,18 L80,15 L100,10 L120,8" />
    <circle cx="120" cy="8" r="2.5" />
  </svg>
</span>
```

X-axis is time (left = oldest, right = today). Y-axis points 0–32 (inverted: y=0 is top, y=32 is bottom). Map data values: `y = 32 - normalized * 32`. The final dot marks today's value.

### Inline bar chart — comparison

Use for: LMArena Elo gaps, fleet sizes by manufacturer, model release counts by lab.

```html
<div class="chart">
  <p class="chart-title">Releases per 30d, by lab</p>
  <svg class="bar-chart" viewBox="0 0 320 140" preserveAspectRatio="xMinYMin meet">
    <!-- per bar: 4 elements (label, bar, dim track, value) -->
    <text x="0" y="22" class="label">OpenAI</text>
    <rect class="bar dim" x="80" y="10" width="220" height="14" rx="2" />
    <rect class="bar" x="80" y="10" width="180" height="14" rx="2" />
    <text x="265" y="22" class="value">3</text>

    <text x="0" y="52" class="label">Anthropic</text>
    <rect class="bar dim" x="80" y="40" width="220" height="14" rx="2" />
    <rect class="bar" x="80" y="40" width="120" height="14" rx="2" />
    <text x="205" y="52" class="value">2</text>

    <text x="0" y="82" class="label">DeepMind</text>
    <rect class="bar dim" x="80" y="70" width="220" height="14" rx="2" />
    <rect class="bar" x="80" y="70" width="180" height="14" rx="2" />
    <text x="265" y="82" class="value">3</text>
  </svg>
  <p class="chart-caption">May 2026 · LMArena + lab-blog confirmed releases</p>
</div>
```

Scale bars proportionally to the max value. Keep ≤6 bars per chart (mobile readability).

### Annotated screenshot

Use for: leaked UI strings, lab-blog hero shots that need a callout.

```html
<figure class="hero">
  <img src="HERO_URL" alt="...">
  <figcaption>Caption with the specific element pointed to. Image: <a>source</a>. <span class="ago">yesterday 6am</span></figcaption>
</figure>
```

Don't over-engineer the annotation — text caption pointing at "second line from top" beats a hand-drawn arrow you don't have time to position.

### Pull quote

Use for: standalone memorable line that should stop the reader's scroll.

```html
<blockquote class="voice" style="font-size:22px; line-height:1.4; border-left-width:5px;">
  "A country of geniuses in a datacenter within a year or two."
  <span class="attribution">— Dario Amodei</span>
</blockquote>
```

Use sparingly. One pull-quote max per issue.

### Inventing new primitives

If neither sparkline nor bar chart fits, invent. Add a new CSS rule to `html-template.html` (signed with agent + time in a comment) and use it inline. Examples worth building when the day calls for them:

- **Compute-ramp chart** — log-scale FLOPs on a stair-step
- **Geographic deployment map** — SVG world map highlighting humanoid-factory locations
- **Network diagram** — labs + their compute partners as connected nodes
- **Bench-Wars heatmap** — model × benchmark grid with cell colors

Don't add chart types you won't actually use today. Add when needed, document in `meta-evolution-log.md`.

## Voice

Karpathy-meets-Stratechery. Direct, opinionated, technically literate, but readable in the morning before coffee fully hits. Treat the reader as a smart generalist who follows AI but doesn't need ALL the context spelled out. Trust them.

**Yes**: "GPT-5.2 takes the SWE-bench crown — 84.3% verified, up from 78% in October. The autonomy curve is bending faster than the compute curve, which is the actually-interesting part."

**No**: "In a groundbreaking announcement that has sent shockwaves through the AI community, OpenAI today unveiled their latest model..."

## Rules

0. **HARD RECENCY RULE — last 24 hours, no exceptions.** Every news item, tweet, video, leak, rumor, and paper MUST have a publish date within the last 24 hours from your run time. If you cannot verify a date within 24h, the item gets cut. No "May 2026" vagueness, no "earlier this month," no cumulative-since-launch metrics passed off as news. The only acceptable exceptions: **PROGRESS METERS** (rolling state snapshot — current LMArena rank is "current" even if the score was set 2 days ago) and **BENCHMARK WARS table 1: LMArena top 10** (same — it's a now-state snapshot, not a story). Everything else: 24h or it's out.

   Render a recency badge on every item: `<span class="ago">3h ago</span>` or `yesterday 8pm`. The reader must SEE freshness. If you can't put a badge on it, you can't ship it.

1. **Cut 30% of the first draft.** Always.
2. **Strong verbs, no adverbs.** "Shipped" beats "successfully released."
3. **Numbers over adjectives.** "32k → 1M context" beats "much larger context window."
4. **No hype clichés.** Banned: "in a stunning development," "game-changing," "revolutionary," "the future is now," "AI is taking over," "experts say."
5. **Lead with the verb.** "Anthropic shipped..." "Google announced..." "Karpathy argues..."
6. **Source links inline.** Never "[source]" at the end. Hyperlink the relevant noun: "[Anthropic shipped](url) Claude 4.7..."
7. **Quote sparingly.** One per section max.
8. **No "we" or "us."** Singular, observant voice.
9. **One hero image per issue.** TOP SIGNAL gets it. Don't pad with stock visuals.

## Recency enforcement (every item, every section)

For each candidate item, verify the publish date BEFORE writing the take:

- **arXiv papers** — `published` field in API response. Must be within 24h of run time.
- **Lab blog posts** — date in URL or post header. Cut if older than 24h.
- **News articles** — published date in metadata or article header. Verify it's the *original* publish, not the last-modified.
- **Tweets** — open the status URL, confirm the timestamp. Tweets older than 24h DO NOT EMBED — find a fresher take from same researcher or skip.
- **YouTube videos** — upload date must be within last 48h (channels don't post daily; 48h is the soft ceiling for "trending"). Older = skip.
- **Leaks/rumors** — original sighting must be within 24h. If the rumor is older but resurfaced with new evidence today, cite the new evidence and date.
- **Reddit/HN posts** — submission timestamp.

**If today is genuinely slow** and you can't fill all 12 sections with fresh content: SHIP A SHORTER ISSUE. Drop empty sections explicitly with a 1-line "📭 Quiet day on X — nothing within 24h worth surfacing." Skip empty sections entirely is also fine. Padding with stale items is forbidden.

**If a story is genuinely huge** and you reasonably expect the reader to want context the date-cut excludes (e.g., today's news is "Anthropic releases Mythos v2" and the reader hasn't heard of v1): you may include ONE contextual link out-of-window per issue, labeled `<span class="context">context</span>` and explicitly flagged in the prose. Use sparingly — once per issue, only when the new story is genuinely unparseable without it.

## Sections (in this order — 13 blocks total, ~17-25 min read)

### 🌀 SINGULARITY PULSE INDEX (top of every issue, always)
A composite 0–100 metric tracking the eight curve dimensions, rendered as a big number with delta vs. last issue and vs. 30 days. The eight component readouts sit underneath in a grid. Data comes from `progress.json > sp_index`. The agent updates the index in Step 4.0 of the daily orchestrator before any narrative writing — the index is computed FROM today's findings, so the editorial then flows around what moved.

Component normalization (each scored 0–100, then weighted sum):
- 🧠 Autonomy horizon: log scale, minutes. 60m ≈ 50, 240m ≈ 75, 1440m ≈ 100. Weight: 0.20.
- ⚡ Compute frontier: log10 FLOPs. 1e26 ≈ 50, 1e27 ≈ 70, 1e28 ≈ 90. Weight: 0.15.
- 📈 Capability SOTA composite: average of normalized top scores across GPQA/ARC-AGI-2/SWE-bench-Pro/FrontierMath. Weight: 0.20.
- 🤖 Embodied units rolling-30d: log scale. 1k ≈ 40, 10k ≈ 65, 100k ≈ 90. Weight: 0.10.
- 🧬 BCI cumulative patients: log scale. 50 ≈ 40, 500 ≈ 65, 5000 ≈ 90. Weight: 0.05.
- 🔬 AI-doing-science events in window: count. Weight: 0.10.
- 📚 Frontier release velocity (releases per 30d): count. 5 ≈ 60, 10 ≈ 80. Weight: 0.10.
- 🌐 Open-frontier proximity (Elo gap, smaller=better): 200 ≈ 30, 50 ≈ 70, 0 ≈ 100. Weight: 0.10.

Display per component: emoji + label + raw value + Δ vs last issue. Big composite at the top.

### 🧭 FUTURES CONSOLE (2–4 cards + watch rail)
Forward radar from `.config/futures-console.json`. Each card states the window, curve dimension, thesis, trigger, confidence, and evidence link. This section should make the reader feel oriented before the narrative starts: what is live, what would move the SP-Index, and what can be ignored until evidence lands.

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

### 🤖 ROBOTICS (2–4 items)
NEW SECTION. Embodied AI is the second curve of the singularity — track it as first-class signal. Pull from `sources.yml > robotics` (humanoid_companies, foundation_models, research_labs, autonomy). Mix:
- **Humanoid company news** (Figure, Tesla Optimus, 1X, Boston Dynamics Atlas, Unitree, UBTech, Agility Digit, Apptronik, Sanctuary) — production milestones, factory pilots, hour counts, fleet deployments.
- **Foundation model drops** (Physical Intelligence π-series, Skild Brain, NVIDIA GR00T, DeepMind RT-line, World Labs spatial) — these are the "GPT moment" for embodied AI.
- **Scale signal** — units shipped, units deployed, $/unit, factory capacity, revenue. Robotics moves on industrial-scale numbers; report them.

Each item: verb-led `<h3>` headline + 2-3 sentence take + inline source link. Same `.stack-item` shape as THE STACK. If a single robotics story is huge (e.g., a new foundation model release), give it a 4-5 sentence treatment.

If today's robotics haul has nothing worth lifting, ship one item or skip the section entirely. Don't pad.

### 🧬 ADJACENT FRONTIER (1–2 items)
BCI / longevity / space / biotech. (Robotics moved to its own section above.) Same punchy roundup format as STACK. Framing: how-this-bends-the-curve. Don't force it — better one good item than two padded ones.

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
- [ ] FUTURES CONSOLE: every card has a trigger, confidence, and evidence link?
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
