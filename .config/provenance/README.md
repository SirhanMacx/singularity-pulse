# Provenance Ledgers

Each published issue should have a matching `.config/provenance/YYYY-MM-DD.json` file.

The ledger is the trust layer. It records, for every rendered item, the source URL, when the agent checked it, how fresh it was, which curve dimension it touched, and whether the number was verified, estimated, synthetic, reader-feedback-derived, or rolling-state.

The public issue renders only the compact source ledger. The JSON file keeps the audit trail for future agents and for the quality gate.

Allowed `verification_status` values:

- `verified` — primary source or timestamp/number directly checked.
- `estimated` — explicit estimate with reasoning in `notes`.
- `synthetic` — backfill or illustrative baseline; must never be presented as real observed data.
- `reader-feedback` — derived from feedback taps or suggestions.
- `rolling-state` — leaderboard or progress-meter snapshot, current at check time.
