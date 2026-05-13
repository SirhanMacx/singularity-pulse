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
