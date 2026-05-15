# Singularity Pulse — Chart Suite (v8.1, redesigned May 14 2026)

Charts are first-class daily content. The v8.1 redesign cut the previous 8-chart dense scoreboard down to **3 readable blocks** in this fixed order. Every chart must carry **axis labels, today's value highlighted, and a one-line "🔎 What to see" caption** explaining the editorial read.

The redesign was triggered by reader feedback (May 14): "graphs are impossible to read and I'm not sure what they are saying." The fix is fewer, bigger, labeled, captioned.

## Render order in the 📊 SCOREBOARD section

1. **4-up stat-card grid** (`.v81-stats` → 4× `.v81-stat`)
   - Card 1: 🌀 SP-Index canonical (number + delta + sub-label)
   - Card 2: 🪞 Jon's Pulse (green-glow, same shape)
   - Card 3: 🎯 Predictions (claude/codex hit-rate fraction + 1-line context)
   - Card 4: ⚡ Headline metric of the day — whichever single number best summarizes today's TOP SIGNAL (Meta capex, OpenAI ARR, METR autonomy minutes, etc.). This card rotates daily.

2. **Benchmark Compass + METR lab** (`.benchmark-compass` / `.metr-lab`)
   - Renders immediately after the issue brief, before the SP-Index/source ledger. METR must be visible above the fold, not buried after the scoreboard.
   - Shows one uniform 0-100 benchmark composite with visible formula.
   - METR time horizon is first-class and interactive: 50% horizon, 80% horizon, show both.
   - Must include raw values alongside normalized scores. Never show a benchmark composite without its weights.
   - METR caveat is mandatory when the public suite saturates above a threshold.

3. **SP-Index 30-day trajectory** (`.v81-bigchart`)
   - SVG ~320×150, line + fill + today-dot with glow
   - Y-axis: 0–100 scale with gridlines at 40/50/60/70
   - X-axis: 30-day range with Apr-X / mid-month / today labels
   - Event ticks for any 1–3 significant inflection points in the window
   - Today's value rendered as a big label
   - Caption: 🔎 **What to see:** [the editorial read in one sentence]

4. **One headline-relevant secondary chart** (`.v81-bigchart`)
   - Pick the chart that best supports today's TOP SIGNAL. Options:
     - **⚡ Compute frontier ramp** (log10 FLOPs stair-step, 180-day window) — for compute / capex / scale stories
     - **📈 Capability climb** (4 benchmark lines, 30-day window) — for benchmark / model-release stories
     - **🤖 Embodied units cumulative + 30d flow** — for robotics stories
     - **🧠 Autonomy horizon ramp** (METR minutes, 180-day) — for agent / memory stories
     - **🌐 Open-frontier Elo gap** (single line tracking closed-vs-open delta) — for open-weight stories
   - Same standard: axis labels, today highlighted, 🔎 caption.

That's it. **3 blocks total.** Less is more legible.

## Hard rules for every chart

1. **Axis labels are mandatory.** No naked sparklines without context.
2. **Today's value gets a glowing dot + a numeric label.** `bc-dot-today` class.
3. **Every chart has a 🔎 "What to see" caption.** One sentence. Names the editorial read. Names what to watch next.
4. **No more than 4 series in one chart.** Above that, split into two charts or use stat-cards.
5. **All inline SVG.** No external libraries. iOS Safari renders all of this natively.
6. **Sign with HTML comment.** `<!-- chart by [claude|codex] at [time] -->`

## Visual language (v8.1 futuristic polish)

- **Dot-grid background** on the SCOREBOARD section: `background-image: radial-gradient(circle, var(--rule) 0.8px, transparent 0.8px); background-size: 18px 18px;`
- **Glow on key numbers**: `text-shadow: 0 0 24px rgba(194,65,12,0.28);` (orange in light, brighter orange in dark)
- **Section accent rail**: vertical gradient bar to the left of every h2 — `h2.section::before` with `linear-gradient(180deg, var(--accent) 0%, transparent 100%)`
- **Chart line glow**: `filter: drop-shadow(0 0 3px rgba(194,65,12,0.4))` on `.bc-line`
- **Monospace + tabular-nums** for all data, large display
- **UI chip primitive**: `.ui-chip` for small inline meta-tags (use sparingly)

## Hero image rotation — MANDATORY (added v8.1)

The same hero image must NOT appear in two issues in a row. Every fire selects a fresh image tied to that day's TOP SIGNAL. Workflow:

1. After selecting the TOP SIGNAL, search Wikimedia Commons for a thematically-relevant photo. Categories that tend to yield good frontier-AI imagery:
   - **Data centers** — `Category:Data_centers`, `Category:Server_rooms`
   - **Semiconductors** — `Category:Integrated_circuit_die_photographs`, `Category:Photolithography`
   - **Robotics** — `Category:Humanoid_robots`, `Category:Industrial_robots`
   - **Neural networks** — `Category:Artificial_neural_networks`
   - **Compute hardware** — `Category:Supercomputers`, `Category:Graphics_processing_units`
   - **BCI** — `Category:Brain%E2%80%93computer_interfaces`
   - **Space** — `Category:Astrophotography`, for "cosmic-scale" framing (use sparingly)
2. Get the direct `upload.wikimedia.org/wikipedia/commons/...` URL of the original-resolution version.
3. Verify with WebFetch (HEAD-equivalent) that the URL returns 200 before locking it in. If 200 is rate-limited (Wikimedia sometimes returns 429 from the agent), use a different known-stable image rather than guess.
4. Write a caption that explicitly ties the image to today's TOP SIGNAL — not a generic description. The caption is what makes the image feel curated rather than stock.
5. Check the past 7 daily issues to ensure the URL hasn't appeared recently. Diversity is the point.

If absolutely no fresh hero is verifiable on a given fire (rare): omit the hero section entirely with a 1-line note (`📷 Hero pending — fresh image queued for tomorrow's fire.`). Reusing yesterday's hero is forbidden.

## Charts retired in v8.1 (kept for posterity, not rendered)

These rendered in v8 day 1 but proved unreadable per reader feedback:
- 3-up SP-Index sparkline trio (30d / 90d / 365d) — too cramped, the 90d and 365d were both synthetic
- 8-mini component sparkline grid — tiny, no scale context, color/value reading impossible at thumbnail size
- LMArena Elo race multi-line (top 5 labs) — overlapping labels, lines too close to distinguish
- 4-bench climb overlay — needed a legend off to the side, didn't fit
- Release timeline dot-row — clustering of releases made it unreadable
- Embodied stack (cumulative area + flow bars) — confused two metrics in one frame
- BCI patients curve — looked like the embodied chart, easy to mix up

All eight remain available as `.v81-bigchart`-compatible options for SPECIAL editions or per-section deep-dives, but they are NOT rendered in the default scoreboard.

## Inventing new chart types

Same rules as before: add the CSS class to `html-template.html`, document the data source in `progress.json`, sign with an HTML comment. New for v8.1: also document the 🔎 caption template — what the chart is FOR editorially, not just what it shows.
