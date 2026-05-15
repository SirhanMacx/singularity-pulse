# Singularity Pulse — Evolution Log

Append-only log of how the newsletter is evolving. Each daily fire MUST read this file (whole thing, or last 14 entries — whichever is shorter), then append a fresh entry as part of Step 11.5.

## Entry format

```
## YYYY-MM-DD · Issue #N

**Read yesterday's issue and the feedback events (last 24h)?** [yes/no — list URLs of feedback signal received]

**One thing I changed today**: <what concrete editorial/format/source decision was different>
**Why**: <reader signal OR self-retrospective insight>

**One experiment I'm trying**: <small, safe variation. E.g. "longer top-signal hero quote," "split benchmark wars into 3 tables instead of 2," "lead with a question," etc.>
**Hypothesis**: <what good looks like>
**How I'll know it worked**: <observable signal — feedback taps, engagement-section visits inferred from "deeper" reactions>

**One thing I'm retiring or de-emphasizing**: <what stopped working>
**Why**: <evidence>

**Watch-for next issue**: <a 1-line predictive note for tomorrow's fire to evaluate>
```

Keep entries SHORT (~150 words each). The log is a learning archive, not an essay collection.

If yesterday's issue produced zero feedback events AND your self-retrospective finds nothing to change, write a "steady-state" entry that names what's working and explicitly chooses to not change anything. Stability is a valid choice — don't fiddle for fiddling's sake.

---

## 2026-05-14 · Issue #3 · [claude] · manual-morning

**Read yesterday's issue + dialogue + feedback**: Issue #2 morning ran TOP SIGNAL on Anthropic agents + memory ceiling (SP-Index 58→59). Codex's afternoon fire added F.03 livestream + DeepMind Magic Pointer, bumped to 60, invented the `endurance-bar` SVG primitive, and explicitly DIDN'T move Country-of-Geniuses — disagreeing with my morning -1. No reader feedback events overnight (cron still not registered).

**Carry-forward from yesterday's watch-for**: (a) Did Codex respond to the Country-of-Geniuses framing push? YES — declined to move it, framing the memory wall as "still solvable at high cost." Good editorial signal. (b) Afternoon evidence on muse-spark identity or Anthropic preview pricing? Codex chose F.03 livestream as the bigger fact — also valid. (c) Did the Anthropic-GA-in-60d prediction get challenged? No, still open.

**One thing I changed today**: Reversed yesterday's -1 on Country-of-Geniuses, lifted it +2 today (24→26). Codex's framing was the better read; the memory wall is solvable IF you have the compute substrate, and Meta just announced the compute substrate. Documented the reversal explicitly in the dialogue entry so the back-and-forth shows up in the thread.

**One experiment I tried**: First prediction resolution. p-2026-05-12-003 (muse-spark public in 7d @0.65) resolved HIT at day 2 — Meta named the model "Muse Spark" under Superintelligence Labs (not Llama-line per se). I'm scoring as HIT because the prediction's spirit cleanly resolved, but flagged the brand-mismatch caveat in the rationale so claude's 1/1 calibration doesn't quietly inflate as more resolutions land. First scored prediction in the ledger.

**One thing I retired today**: De-emphasized the Anthropic-agents-preview frame from yesterday's TOP SIGNAL. Today's news is bigger (Meta capex + Superintelligence Labs branding) and shifts the curve narrative from "agent productization at the wall" to "compute substrate to brute-force-solve the wall."

**Watch-for tomorrow's Codex afternoon (today's 3:30 PM)**: (a) Does xAI respond to Meta's capex within the 14-day window (new prediction @70%)? (b) Any pre-Monday Google I/O leaks shifting Omni timing or branding? (c) Does Codex push back on any of the 5 uniform-up countdown moves today? Same-day disagreement >5pp will render both numbers — would be the first such rendering.

**Voice self-assessment**: Cut ~30%. One use of "brutal" preserved from yesterday's voice. Caught "shift the lab-race rhetoric" before commit — overcooked, replaced with "escalated." Numbers-over-adjectives held throughout.

**proposed-for-weekly**: None today. Spec wasn't mutated; Codex's `endurance-bar` SVG primitive should be promoted in style-guide.md when the weekly meta-cron runs (Sunday).

---

## 2026-05-14 · Issue #3 · [codex] · manual-afternoon-second-pass

**Read issue + dialogue + feedback**: Yes — started from Claude's 3:10 PM update after resolving the stale local Codex rebase conflict. No reader feedback events available locally. User direction was explicit: re-evaluate after the Codex update, capture online discussion, and improve UX/visuals because some graphs were hard to read.

**One thing I changed today**: Added the missing online-discussion layer around the Codex enterprise promo. The r/codex / r/ClaudeCode signal is not adoption proof, but it shows migration interest and quota anxiety — the real bottleneck for all-day coding agents.

**One experiment I tried**: Restored Futures Console inside today's live issue and added a compact discussion-pulse visual. Hypothesis: quiet/market-structure afternoons still feel useful if they show concrete watch triggers and community texture.

**One thing I retired/de-emphasized**: De-emphasized the idea that the Codex promo should move the SP-Index again today. It is distribution signal until OpenAI publishes uptake, seats, or usage-hours.

**Watch-for tomorrow**: Did anyone receive promo approvals, enterprise seat counts, or visible Codex usage deltas? If yes, release velocity can move. If not, treat today's discussion as market texture only.

**Voice self-assessment**: Kept the correction direct; improved product quality instead of padding news.

**proposed-for-weekly**: Promote chart-readability rules (larger labels, heavier strokes, "what to see" captions) into the default scoreboard spec if tomorrow's issue keeps them.

---

## 2026-05-14 · Issue #3 · [codex] · benchmark-clarity-fix

**Read issue + dialogue + feedback**: User explicitly said the edition was unimpressive: scoring unclear, benchmarks missing, METR time horizon should be central, news/media links need to rotate with each push, and the product should visualize the singularity.

**One thing I changed today**: Added a Benchmark Compass with one uniform 0-100 scoring vocabulary, explicit weights, raw benchmark values, normalized scores, and METR as the lead autonomy graph.

**One experiment I tried**: Interactive METR graph with 50%, 80%, and "show both" states. Hypothesis: the reader will understand autonomy better from reliability curves than from another paragraph about agents.

**One thing I retired/de-emphasized**: De-emphasized using the SP-Index as the only "where are we?" number. SP-Index is daily curve movement; Benchmark Compass is capability state.

**Watch-for tomorrow**: Update METR from primary source first, then refresh GPQA / ARC-AGI-2 / SWE / FrontierMath / open-frontier rows. If sources do not change, explicitly mark them rolling-state.

**Voice self-assessment**: This is more product than prose; the issue now explains its own scoring.

**proposed-for-weekly**: Make Benchmark Compass mandatory in every issue and audit whether the weights need tuning after 7 days.

---

## 2026-05-14 · Issue #3 · [codex] · above-fold-metr-fix

**Read issue + feedback**: User still could not see the METR graph or benchmark visualizations. Live GitHub Pages did contain them, but they were buried after the scoreboard/source flow and therefore failed as UX.

**One thing I changed today**: Added an above-the-fold Frontier Observatory with the METR time-horizon graph, reliability toggles, Benchmark Compass score, and normalized benchmark chips before the SP-Index.

**One experiment I tried**: Treat METR as the page’s front-door visual, not a later section. Hypothesis: if the reader opens the issue, the autonomy horizon is visible within the first screen.

**One thing I retired/de-emphasized**: Retired burying benchmarks after the scoreboard. Future template now renders Benchmark Compass immediately after the issue brief.

**Watch-for tomorrow**: If the reader still says it feels the same, the next fix is not another chart; it is a full visual system redesign.

---

## 2026-05-13 · Issue #2 · [claude] · manual-morning

**Read yesterday's issue and feedback events**: yes — Issue #1 sat at canonical SP-Index 58 / Jon's Pulse 56 with the v8 dry-run seed dialogue entry to Codex. No feedback events overnight (cron not yet registered means the audience surface is still just Jon). Carried forward yesterday's "watch-for": (a) did Thinking Machines post again within 7 days? — no (still just the one), (b) any feedback events overnight? — none, (c) was 17-25 min length too long? — unanswered without feedback signal.

**One thing I changed today**: TOP SIGNAL reframed away from "lab profile" (Thinking Machines on day 1) to "convergent evidence" (Anthropic ships at the exact wall two independent papers just measured). Pairing a product move with a benchmark drop is editorially stronger than either alone, and it surfaces the curve-impact dimensions cleanly.

**One experiment I tried**: Wrote a dialogue entry that explicitly invites Codex to disagree on a specific countdown probability (Country-of-Geniuses, which I lifted DOWN 1pp). If Codex pushes back with a +1pp reading, the rendered ⏳ section will show both numbers — first real test of the "disagreement is editorial signal" hard rule from VISION.md.

**One thing I retired today**: De-emphasized LMArena Elo race as the lead-frame this week. Anthropic's positional lead on the leaderboard isn't where their real lead is — agent-productization stack matters more this cycle. The chart still renders; the Bench Wars text just doesn't lead with it.

**Watch-for tomorrow morning's Codex afternoon entry**: (a) Does Codex respond to the Country-of-Geniuses framing push-back? (b) Any afternoon evidence on Meta's muse-spark identity or on Anthropic preview pricing? (c) Did the new prediction (Anthropic GA in 60d, 50%) get challenged by Codex's afternoon read?

**Voice self-assessment**: Cut roughly 25% from first draft (target 30%; missed by a hair). One borderline hype phrase ("brutal" describing the memory benchmark numbers) — kept it because the data actually warrants the word. No banned phrases. Numbers-over-adjectives held.

**proposed-for-weekly**: None today. The spec didn't need mutation; this issue just used it.

---

## 2026-05-13 · Issue #2 · [codex] · manual-afternoon

**Read yesterday's issue and feedback events**: yes — re-read the morning Issue #2 and checked feedback events for the last 8h (none). The key constraint today is recency without padding: add only what actually changed since coffee.

**One thing I changed today**: treated Figure’s public F.03 livestream as a curve-moving embodied-deployment datapoint and filled the empty Videos/Robotics surfaces with it (plus a small “endurance bar” SVG). Also added a primary-source Adjacent item from DeepMind (Magic Pointer) so the afternoon update isn’t mono-topic.

**One experiment I'm trying**: promote “unedited time” as a first-class reliability signal for robotics (boring stream = good). Hypothesis: readers will trust long continuous feeds more than hypey clips. How I’ll know: more `deeper:robotics` taps and fewer `suggest:` notes asking for “real robotics evidence.”

**One thing I'm retiring or de-emphasizing**: the reflex to declare 📭 quiet just because the tracked RSS feeds didn’t pop. The afternoon fire can still improve the artifact (visuals, trust ledger, the dialogue thread) as long as it stays honest and sourced.

**Watch-for next issue**: whether Figure keeps the stream running long enough to surface real intervention patterns (frequency + failure recovery), and whether the Magic Pointer concept gets a concrete rollout detail beyond “starting today.”

**Voice self-assessment**: kept it tight; resisted hype language; made the “boring is good” point once and stopped.

---

## 2026-05-12 · Issue #1 (seed)

**Read yesterday's issue and feedback events**: N/A — this is the first issue.

**Things established with Issue #1**:
- 12-section template (Top Signal · Stack · Leaks · Bench Wars · Voices · Videos · Papers · Robotics · Adjacent · Meters · Horizon · Watching)
- Editorial voice anchored at "Karpathy-meets-Stratechery" — direct, opinionated, numbers-over-adjectives
- Hero image: glasswing butterfly (Wikimedia) for Project Glasswing top-signal
- Voices section uses Twitter widgets.js for tweet card embeds; falls back to plain blockquote
- Bench Wars uses two tables: LMArena top-10 + this-week SOTA shifts
- Feedback widget added: 3 overall reactions + per-section "go deeper" links → ntfy feedback topic

**Watch-for Issue #2**:
1. Did the Twitter widgets.js cards actually render in iOS Safari, or did they stay as fallback blockquotes? (Critical UX call — if fallback wins, simplify the voices section.)
2. Are any feedback events fired overnight? If yes, what sections drew reactions?
3. Is the 17–25 min length too long for a 7:30 AM read? First-issue retention signal will tell.

**One experiment for Issue #2**: Issue #1 had the TOP SIGNAL hero image inset at full bleed. For Issue #2, try a smaller right-floated image to test whether shorter visual hierarchy reads better on phone. Revert if it looks cramped.

**Style anchor**: cut 30% of every first draft. Strong verbs. No "in a stunning development."
