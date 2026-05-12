# Singularity Pulse — Editorial Style Guide

## Voice

Karpathy-meets-Stratechery. Direct, opinionated, technically literate, but readable in the morning before coffee fully hits. Treat the reader as a smart generalist who follows AI but doesn't need ALL the context spelled out. Trust them.

**Yes**: "GPT-5.2 takes the SWE-bench crown — 84.3% verified, up from 78% in October. The autonomy curve is bending faster than the compute curve, which is the actually-interesting part."

**No**: "In a groundbreaking announcement that has sent shockwaves through the AI community, OpenAI today unveiled their latest model..."

## Rules

1. **Cut 30% of the first draft.** Always. The thing that feels almost too brief is usually right.
2. **Strong verbs, no adverbs.** "Shipped" beats "successfully released." "Cracked" beats "managed to achieve."
3. **Numbers over adjectives.** "32k context → 1M context" beats "much larger context window."
4. **No hype clichés.** Banned phrases: "in a stunning development," "game-changing," "revolutionary," "the future is now," "AI is taking over," "experts say." Just say what happened.
5. **Lead with the verb.** "Anthropic shipped..." "Google announced..." "Karpathy argues..."
6. **Source links inline.** Never "[source]" at the end. Hyperlink the relevant noun: "[Anthropic shipped](url) Claude 4.7..."
7. **Quote sparingly.** A direct researcher quote should earn its keep. One per section max.
8. **No "we" or "us."** Not a newsletter from a team. Singular, observant voice.
9. **One image per issue.** The TOP SIGNAL hero. Don't pad with stock visuals.

## Section-by-section direction

### 🔥 TOP SIGNAL (2–3 paragraphs, ~300 words)

The most important development of the past 24 hours. Structure:

- **Paragraph 1**: What happened. Concrete details, numbers, who/what/when.
- **Paragraph 2**: Why it matters. The actual insight — what does this reveal about the trajectory? What pattern does it confirm or break?
- **Paragraph 3** (optional): What to watch. Specific next thing — next benchmark, next release, next move.

Pick the single most decision-relevant story. If two are tied, prefer the one with implications for capability ceiling over the one with implications for market position.

### ⚡ THE STACK (4–6 items, ~50 words each)

Punchy roundup. Each item:
- **Bold lead**: a verb-led headline.
- **Body**: 2–3 sentences. What, with one why-it-matters beat.
- **Inline link** to source.

Mix: model releases, benchmark results, paper highlights worth less than full PAPERS treatment, lab announcements, policy moves, market moves, infrastructure (chips/datacenters/compute).

### 📜 PAPERS WORTH KNOWING (2–3 papers, ~80 words each)

Per paper:
- **Title** (linked to arXiv abstract).
- **Plain-English what-it-says**: one sentence.
- **Why-you-care**: one sentence. The actual contribution, not the abstract's claim.
- **Authors + institution** in parentheses at end.

Skip incremental work. Look for: new capability demonstration, surprising negative result, novel architecture or training recipe, alignment-relevant findings, anything Karpathy or LeCun retweets.

### 💬 VOICES (2–3 items, ~40 words each)

Tweets/threads worth pasting in. For each:
- Quote the most-substantive line as blockquote.
- Attribute: handle + 1-line context.
- Link to the original.

Prefer signal over hot takes. A researcher's measured analysis beats a pundit's confident prediction.

### 🧬 ADJACENT FRONTIER (1–2 items, ~60 words each)

The non-AI singularity-curve stuff. BCI, longevity, robotics, space, biotech. Same punchy roundup format as THE STACK but with a "how this bends the curve" framing in each take.

Don't force it. If today's adjacent news is genuinely meh, write ONE item and move on. Better short than padded.

### 📊 PROGRESS METERS

Render as a clean table or stat block:

```
COMPUTE          previous → today (Δ)
BENCHMARKS       per-bench best score this month
RELEASES         model releases in last 30 days: N (vs prior 30: M)
PAPERS           arXiv cs.AI submissions yesterday: N (7-day avg: M)
```

Pull from `.config/progress.json`. Update it as part of this run. Deltas displayed with arrows: ↑ ↓ →.

### 🔮 ON THE HORIZON (1 item, ~80 words)

One genuinely speculative item. "If X continues, then Y in roughly 6-18 months." Argue from current trends, not vibes. This is where the writer earns the read.

### 🎯 WORTH WATCHING (1 item, ~30 words)

One specific dated thing. "Anthropic dev day Tuesday." "ICML deadline Friday." "Sora 2 expected this week." Just a heads-up. No prose padding.

## HTML rendering notes

- Section emoji are part of the section header — render at 1.4× size, no animation.
- TOP SIGNAL gets a hero image: full-bleed at the top, caption underneath in 12px italic.
- PROGRESS METERS gets a monospace font block — Menlo or SF Mono.
- All external links open in same tab (mobile Safari quirk — new-tab is annoying on iPhone).
- Source attribution at the bottom: "Compiled from N sources at 7:30 AM ET, May 12 2026."

## Dedupe rule

Before writing, read `.config/seen-stories.json`. If a story (matched by URL hash or near-duplicate headline) appeared in the last 3 issues, SKIP it unless something materially new has happened. New benchmark score on same model = new story. Same lab releasing the same model with a press tour = not a new story.

## Self-check before commit

- [ ] Did I cut 30%?
- [ ] Any hype clichés? Strike them.
- [ ] TOP SIGNAL: does paragraph 2 actually say something non-obvious?
- [ ] PROGRESS METERS: did I update progress.json?
- [ ] Did I read seen-stories.json and skip repeats?
- [ ] Hero image actually loads (test the URL)?
- [ ] Would I be excited to open this on my phone tomorrow?
