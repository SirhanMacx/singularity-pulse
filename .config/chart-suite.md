# Singularity Pulse — Chart Suite (canonical daily delivery)

Charts are first-class daily content as of v8. Every fire renders the full suite below in a dedicated `📊 SCOREBOARD` section that sits between the Singularity Pulse Index and TOP SIGNAL.

All renders are **inline SVG**. No external chart libraries. Each chart pulls from a named `progress.json` field documented below. New chart types may be added by either agent (signed `<!-- chart by [claude|codex] at [time] -->`); existing types retire only after 14 days of zero use.

## The canonical suite (day-one)

| # | Chart class | Data source | viewBox | Purpose |
|---|---|---|---|---|
| 1 | `chart-sparkline-trio` | `sp_index.history_30d` + `_90d` + `_365d` | 320×80 each, 3 inline | SP-Index trajectory at three time horizons |
| 2 | `chart-component-grid` | `sp_index.component_histories_30d` | 8 mini sparklines, ~80×24 each, 4-col grid | Per-dimension curve bend/flatten |
| 3 | `chart-elo-race` | `lmarena_history_30d.snapshots` | 320×180 | Top 5 frontier labs Elo over 30d, one line per lab |
| 4 | `chart-bench-climbs` | `benchmark_history_30d` | 320×180 | 4 benchmarks (GPQA, ARC-AGI-2, SWE-bench-Pro, FrontierMath) climbing over 30d |
| 5 | `chart-release-timeline` | `releases_timeline_90d` | 320×140 | Dot per release, x-axis last 90d, color per lab |
| 6 | `chart-compute-stair` | `compute_history_180d.steps` | 320×140 | Log10 FLOPs stair-step over 180d |
| 7 | `chart-embodied-stack` | `embodied_history_30d.snapshots` | 320×140 | Cumulative humanoid units (filled area) + 30d-flow bar overlay |
| 8 | `chart-bci-curve` | `bci_history_90d.snapshots` | 320×120 | Cumulative BCI patients across all programs |
| 9 | `prediction-market` | `predictions.json` | HTML rows | Top live bets, confidence, movement, next resolution date |

Each chart carries:
- A `<p class="chart-title">` (e.g., `SP-INDEX · 30 DAYS`)
- The SVG with appropriate `viewBox` and `preserveAspectRatio`
- A `<p class="chart-caption">` (e.g., `synthetic backfill before May 12 · real data starts May 13`)
- An HTML comment signature: `<!-- chart by [agent] at [time] -->`

## SVG conventions

- **Axes**: usually implicit. Date ranges in caption. Y-axis scale labeled at extremes only.
- **Synthetic data points**: rendered at 0.5 opacity OR with a dashed stroke for the segment ending at the last synthetic point. Always called out in the caption.
- **Color**: stroke uses `var(--accent)` for single-series charts. Multi-series (Elo race, benchmarks): use a small per-lab palette below.
- **Mobile**: viewBox-based, width 100% in CSS, height auto. Test on iOS Safari before commit.

## Multi-series palette

For Elo race, benchmark stack, release timeline (color-per-lab):

| Lab | Hex |
|---|---|
| Anthropic | `#c2410c` (matches `--accent`) |
| Google | `#2563eb` |
| OpenAI | `#059669` |
| Meta | `#7c3aed` |
| xAI | `#0891b2` |
| DeepSeek | `#db2777` |
| Z.AI | `#f59e0b` |
| Other / unknown | `var(--muted)` |

For benchmark stack:

| Benchmark | Hex |
|---|---|
| GPQA-Diamond | `#c2410c` |
| ARC-AGI-2 | `#2563eb` |
| SWE-bench-Pro | `#059669` |
| FrontierMath | `#7c3aed` |

## When to add a new chart type

If a story is better told visually and neither sparkline / bar-chart / race / timeline / stack / curve fits, invent. Add the new CSS class to `html-template.html`, add the new entry to this table, document the data source path in `progress.json`. Sign with HTML comment. Note the addition in `meta-evolution-log.md`.

Examples worth building when the day calls for them:
- **chart-geo-deploy** — SVG world map highlighting humanoid-factory locations
- **chart-lab-network** — nodes + edges showing lab/compute-partner relationships
- **chart-bench-heatmap** — model × benchmark grid with cell colors
- **chart-pred-cal** — predictions calibration curve (confidence band × hit rate) per agent
- **prediction-market** — compact live-bet board at top of Predictions; already part of v8.1 template

## When to retire a chart

After 14 days of "rendered but referenced by no narrative item in any issue" — i.e., the chart was eye-candy not editorial signal. Move to `chart-suite-retired.md` (this file's archive) with date and reason.

## Render order in the SCOREBOARD section

Always render in this order so the reader's eye flows from composite → components → competition → capability → cadence → scale → embodied → BCI:

1. SP-Index sparkline trio (composite at three horizons)
2. Component grid (8 dimensions at a glance)
3. Elo race (lab competition)
4. Benchmark climbs (capability)
5. Release timeline (cadence)
6. Compute stair (scale)
7. Embodied stacked (robotics)
8. BCI curve (human-AI bandwidth)
9. Prediction market (inside Predictions, not Scoreboard)

The afternoon Codex fire may reorder if afternoon news materially shifts emphasis — note the reorder in the evolution-log.
