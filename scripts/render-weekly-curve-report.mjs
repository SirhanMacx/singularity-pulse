#!/usr/bin/env node
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const progress = JSON.parse(readFileSync(join(root, '.config/progress.json'), 'utf8'));
const predictions = JSON.parse(readFileSync(join(root, '.config/predictions.json'), 'utf8'));
const sourcePerf = existsSync(join(root, '.config/source-performance.json'))
  ? JSON.parse(readFileSync(join(root, '.config/source-performance.json'), 'utf8'))
  : { sources: [] };

const history = progress.sp_index?.history_30d || [];
const latest = history.at(-1);
const first = history.find((p) => !p.synthetic) || history[0];
const delta = latest && first ? latest.score - first.score : 0;
const openPredictions = (predictions.predictions || []).filter((p) => p.status === 'open');
const topSources = [...(sourcePerf.sources || [])]
  .sort((a, b) => (b.rendered_items_14d || 0) - (a.rendered_items_14d || 0))
  .slice(0, 8);

const rows = topSources.map((s) => `
      <tr>
        <td>${escapeHtml(s.id || s.url || s.handle || 'unknown')}</td>
        <td>${s.rendered_items_14d || 0}</td>
        <td>${s.signal_score || 0}</td>
        <td>${escapeHtml(s.status || 'watch')}</td>
      </tr>`).join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Singularity Pulse — Weekly Curve Report</title>
<style>
body{margin:0;background:#fafaf7;color:#1a1a1a;font:16px/1.6 -apple-system,BlinkMacSystemFont,Inter,sans-serif}
.wrap{max-width:760px;margin:0 auto;padding:28px 20px 72px}
h1,h2{font-family:Georgia,serif;line-height:1.1} h1{font-size:38px} h2{margin-top:36px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.kpi{border:1px solid #e5e5e0;background:#fff;border-radius:8px;padding:14px}
.num{font-size:34px;font-weight:800;color:#c2410c}.muted{color:#5a5a5a;font-size:13px}
table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #e5e5e0;padding:8px;text-align:left}th{font-size:12px;color:#5a5a5a;text-transform:uppercase}
</style>
</head>
<body><main class="wrap">
<p><a href="./">← Today</a></p>
<h1>Weekly Curve Report</h1>
<p class="muted">Generated from local repo state. This page answers one question: did the singularity curve actually move this week?</p>
<section class="kpis">
  <div class="kpi"><div class="num">${latest?.score ?? 'n/a'}</div><div class="muted">Current SP-Index</div></div>
  <div class="kpi"><div class="num">${formatDelta(delta)}</div><div class="muted">Change over available week/window</div></div>
  <div class="kpi"><div class="num">${openPredictions.length}</div><div class="muted">Open predictions</div></div>
  <div class="kpi"><div class="num">${topSources.reduce((sum, s) => sum + (s.rendered_items_14d || 0), 0)}</div><div class="muted">Rendered source hits tracked</div></div>
</section>
<h2>Curve Read</h2>
<p>${delta > 1 ? 'The curve moved up on the tracked window. The next issue should identify the component that drove the move and separate verified movement from synthetic backfill.' : 'The tracked window does not yet show a material move. Short issues and explicit quiet-day framing should beat padding.'}</p>
<h2>Prediction Ledger</h2>
<p>${openPredictions.length} open predictions remain live. The weekly meta fire should resolve due items before changing the source list.</p>
<h2>Source Yield</h2>
<table><thead><tr><th>Source</th><th>Rendered</th><th>Signal</th><th>Status</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No source-performance data yet.</td></tr>'}</tbody></table>
</main></body></html>`;

writeFileSync(join(root, 'weekly-curve-report.html'), html);
console.log('Wrote weekly-curve-report.html');

function formatDelta(n) {
  if (!Number.isFinite(n)) return 'n/a';
  if (n > 0) return `+${n}`;
  return String(n);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
