# Weekly Curve Report Spec

The weekly report is not a recap. It answers one question:

> Did the singularity curve actually move this week?

The Sunday meta task should generate or refresh `weekly-curve-report.html` after the source/spec audit. Use `npm run weekly:curve-report` as the baseline renderer, then edit the prose if the week has a real thesis.

Required blocks:

1. **Curve Read** — one paragraph saying whether the SP-Index moved materially and which component drove it.
2. **Strongest Evidence** — 3 bullets, each with a source and verification status.
3. **Weakest Evidence / Noise** — 2 bullets naming over-covered or low-signal items.
4. **Agent Disagreement** — one visible Claude vs. Codex framing disagreement if one occurred.
5. **Prediction Movement** — due predictions resolved, confidence changes, and countdown probability moves.
6. **Source Yield** — best sources by rendered signal, noisy sources, candidates to add/drop.

Hard rule: if the answer is "the curve did not move," say that plainly. A quiet week report is better than a padded one.
