#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const dateArg = args.find((arg) => !arg.startsWith('--'));
const issueDir = join(root, 'data/issues');

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function readJson(path, fallback = null) {
  const full = join(root, path);
  if (!existsSync(full)) return fallback;
  return JSON.parse(readFileSync(full, 'utf8'));
}

function write(path, text) {
  const full = join(root, path);
  mkdirSync(join(full, '..'), { recursive: true });
  writeFileSync(full, text);
}

function html(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function attr(value) {
  return html(value).replaceAll("'", '&#39;');
}

function slug(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function issueFiles() {
  if (!existsSync(issueDir)) return [];
  return readdirSync(issueDir)
    .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .sort();
}

function latestIssueDate() {
  const files = issueFiles();
  if (!files.length) throw new Error('No data/issues/YYYY-MM-DD.json files found');
  return basename(files.at(-1), '.json');
}

function validateIssue(issue, issuePath) {
  const errors = [];
  const sourceIds = new Set((issue.sources || []).map((source) => source.id));
  const statuses = new Set(['verified', 'estimated', 'synthetic', 'reader-feedback', 'rolling-state']);

  if (issue.schema_version !== 1) errors.push('schema_version must be 1');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(issue.issue_date || '')) errors.push('issue_date must be YYYY-MM-DD');
  if (!Array.isArray(issue.sources) || issue.sources.length < 6) errors.push('sources must include at least 6 rows');

  for (const [index, source] of (issue.sources || []).entries()) {
    for (const field of ['id', 'title', 'publisher', 'url', 'fetched_at', 'freshness', 'verification_status']) {
      if (!source[field]) errors.push(`sources[${index}] missing ${field}`);
    }
    if (source.id && !/^[a-z0-9-]+$/.test(source.id)) errors.push(`sources[${index}] id must be kebab-case`);
    if (source.url && !/^(https?:\/\/|\.\/)/.test(source.url)) errors.push(`sources[${index}] url must be http(s) or a local ./ path`);
    if (source.verification_status && !statuses.has(source.verification_status)) {
      errors.push(`sources[${index}] invalid verification_status ${source.verification_status}`);
    }
  }

  function requireSourceIds(section, items) {
    for (const [index, item] of (items || []).entries()) {
      if (!Array.isArray(item.source_ids) || !item.source_ids.length) {
        errors.push(`${section}[${index}] missing source_ids`);
        continue;
      }
      for (const sourceId of item.source_ids) {
        if (!sourceIds.has(sourceId)) errors.push(`${section}[${index}] references missing source ${sourceId}`);
      }
    }
  }

  requireSourceIds('news', issue.news);
  requireSourceIds('ai_2027', issue.ai_2027);
  requireSourceIds('media', issue.media);
  requireSourceIds('loop_dispatch.paragraphs', issue.loop_dispatch?.paragraphs);
  requireSourceIds('forecast_radar', issue.forecast_radar);
  requireSourceIds('tracker.sp_index.components', issue.tracker?.sp_index?.components);
  requireSourceIds('benchmark_panel.metrics', issue.benchmark_panel?.metrics);
  requireSourceIds('benchmark_panel.matrix', issue.benchmark_panel?.matrix);
  requireSourceIds('benchmark_panel.compilation.axes', issue.benchmark_panel?.compilation?.axes);
  if (!Array.isArray(issue.benchmark_panel?.source_ids) || !issue.benchmark_panel.source_ids.length) {
    errors.push('benchmark_panel missing source_ids');
  } else {
    for (const sourceId of issue.benchmark_panel.source_ids) {
      if (!sourceIds.has(sourceId)) errors.push(`benchmark_panel references missing source ${sourceId}`);
    }
  }
  for (const sourceId of issue.benchmark_panel?.compilation?.source_ids || []) {
    if (!sourceIds.has(sourceId)) errors.push(`benchmark_panel.compilation references missing source ${sourceId}`);
  }

  if (errors.length) {
    throw new Error(`${issuePath}\n- ${errors.join('\n- ')}`);
  }
}

function buildSourceTools(issue) {
  const sourceMap = new Map(issue.sources.map((source) => [source.id, source]));
  const footnoteIds = [];

  function addFootnotes(sourceIds = []) {
    for (const sourceId of sourceIds) {
      if (!sourceMap.has(sourceId)) continue;
      if (!footnoteIds.includes(sourceId)) footnoteIds.push(sourceId);
    }
  }

  for (const item of issue.news || []) addFootnotes(item.source_ids);
  addFootnotes(issue.loop_dispatch?.source_ids);
  for (const paragraph of issue.loop_dispatch?.paragraphs || []) addFootnotes(paragraph.source_ids);
  addFootnotes(issue.benchmark_panel?.source_ids);
  for (const metric of issue.benchmark_panel?.metrics || []) addFootnotes(metric.source_ids);
  addFootnotes(issue.benchmark_panel?.compilation?.source_ids);
  for (const axis of issue.benchmark_panel?.compilation?.axes || []) addFootnotes(axis.source_ids);
  for (const item of issue.ai_2027 || []) addFootnotes(item.source_ids);
  for (const item of issue.forecast_radar || []) addFootnotes(item.source_ids);
  for (const item of issue.media || []) addFootnotes(item.source_ids);

  const numberById = new Map(footnoteIds.map((id, index) => [id, index + 1]));

  function cites(sourceIds = []) {
    const anchors = sourceIds
      .filter((sourceId) => numberById.has(sourceId))
      .map((sourceId) => `<a href="#fn-${attr(sourceId)}">${numberById.get(sourceId)}</a>`);
    return anchors.length ? `<sup class="source-cites">${anchors.join('')}</sup>` : '';
  }

  function sourceLink(sourceId) {
    const source = sourceMap.get(sourceId);
    if (!source) return '';
    return `<a href="${attr(source.url)}">${html(source.publisher)}</a>`;
  }

  return { sourceMap, footnoteIds, cites, sourceLink };
}

function impactClass(impact) {
  return impact === 'high' ? 'high' : impact === 'medium' ? 'medium' : 'low';
}

function renderBylines(issue) {
  return (issue.agents || [])
    .map((agent) => `<span class="agent-byline ${attr(agent.class || slug(agent.name))}">${html(agent.label)}</span>`)
    .join('\n    ');
}

function renderTopSourceChips(item, tools) {
  return (item.source_ids || [])
    .map((sourceId, index) => {
      const source = tools.sourceMap.get(sourceId);
      if (!source) return '';
      return `<span class="source-chip"><span>${index + 1}</span><a href="${attr(source.url)}">${html(source.publisher)}</a><span>${html(source.freshness)}</span></span>`;
    })
    .filter(Boolean)
    .join('\n      ');
}

function renderBriefingReadouts(issue, tools) {
  const tracker = issue.tracker?.sp_index || {};
  const metrics = issue.benchmark_panel?.metrics || [];
  const p50 = metrics.find((metric) => /p50/i.test(metric.label));
  const p80 = metrics.find((metric) => /p80/i.test(metric.label));
  const aiLane = (issue.ai_2027 || []).find((lane) => /autonomy/i.test(lane.lane)) || issue.ai_2027?.[0];
  const readouts = [
    { key: 'SP-Index', value: tracker.score, note: `${tracker.delta_label || 'flat'} · evidence-only index` },
    { key: 'METR p50', value: p50?.sub?.split('·')[0]?.trim() || p50?.value || 'queued', note: p50 ? `${p50.value} raw · caveated` : 'No source row' },
    { key: 'METR p80', value: p80?.sub || p80?.value || 'queued', note: p80 ? `${p80.value} raw reliability threshold` : 'No source row' },
    { key: 'AI 2027 lane', value: aiLane?.status || 'unresolved', note: aiLane ? aiLane.lane : 'No lane evidence' }
  ];

  return readouts
    .map((readout) => `<div class="instrument-card">
  <div class="instrument-k">${html(readout.key)}</div>
  <div class="instrument-v">${html(readout.value)}</div>
  <div class="instrument-note">${html(readout.note)}</div>
</div>`)
    .join('\n');
}

function renderCommandDeck(issue, tools) {
  const tracker = issue.tracker?.sp_index || {};
  const deck = issue.command_deck || {};
  const topItem = issue.news?.[0] || {};
  const topSource = tools.sourceMap.get(topItem.source_ids?.[0]);
  const metrics = [
    {
      label: 'SP-Index',
      value: tracker.score,
      note: `${tracker.delta_label || 'flat'} · ${tracker.date_short || ''}`,
      status: tracker.delta_dir || 'flat'
    },
    {
      label: 'Jon Pulse',
      value: tracker.jon_score,
      note: `${tracker.jon_delta_label || 'flat'} · robotics-weighted`,
      status: tracker.jon_delta_dir || 'flat'
    },
    {
      label: 'Proximity',
      value: issue.benchmark_panel?.compilation?.label || `${tracker.score || '—'}/100`,
      note: issue.benchmark_panel?.compilation?.confidence || 'evidence index',
      status: 'frontier'
    },
    {
      label: 'Sources',
      value: issue.source_count,
      note: 'visible footnotes',
      status: 'verified'
    }
  ];
  const chips = (deck.chips || [])
    .map((chip) => `<span class="command-chip ${attr(chip.tone || 'neutral')}">${html(chip.label)} <strong>${html(chip.value)}</strong></span>`)
    .join('\n      ');
  const metricCards = metrics
    .map((metric) => `<div class="command-metric ${attr(metric.status)}">
  <span>${html(metric.label)}</span>
  <strong>${html(metric.value)}</strong>
  <em>${html(metric.note)}</em>
</div>`)
    .join('\n');

  return `<section class="command-deck" id="command" aria-label="Singularity Pulse command center">
  <div class="command-grid">
    <article class="command-primary">
      <div class="command-kicker">${html(deck.kicker || 'Command center · what moved')}</div>
      <h2>${html(deck.headline || topItem.title || 'No lead signal selected')}</h2>
      <p class="command-delta">${html(deck.delta || issue.summary?.what_changed || topItem.summary || '')}</p>
      <div class="command-chips">
        ${chips || renderTopSourceChips(topItem, tools)}
      </div>
      <div class="command-actions">
        <a class="command-action primary" href="${attr(deck.primary_action_url || topSource?.url || '#news-brief')}">${html(deck.primary_action_label || 'Open lead evidence')}</a>
        <a class="command-action" href="${attr(deck.secondary_action_url || '#benchmark-compass')}">${html(deck.secondary_action_label || 'Open benchmark cockpit')}</a>
      </div>
    </article>
    <figure class="command-visual">
      <!-- codex visual layer: generated interface art, not source evidence -->
      <img src="${attr(deck.visual_url || './assets/generated/pulse-command-horizon-2026-05-15.jpg')}" alt="${attr(deck.visual_alt || 'Futuristic benchmark cockpit with holographic 3D towers and a central proximity gauge')}">
      <figcaption>${html(deck.visual_caption || 'Generated by Codex for this issue · illustrative UI layer, not benchmark evidence')}</figcaption>
      <div class="visual-prediction" aria-label="Final Singularity Pulse proximity prediction">
        <span>final read</span>
        <strong>${html(issue.benchmark_panel?.compilation?.label || `${tracker.score || '—'}/100`)}</strong>
      </div>
    </figure>
    <aside class="command-side">
      <div class="command-verdict">
        <span>Codex verdict</span>
        <strong>${html(deck.verdict || issue.benchmark_panel?.compilation?.verdict || topItem.why_it_matters || '')}</strong>
      </div>
      <div class="command-metrics">${metricCards}</div>
      <div class="command-watch"><span>Next watch</span><p>${html(deck.next_watch || 'Watch for one source-backed benchmark lane that actually moves the curve.')}</p></div>
    </aside>
  </div>
</section>`;
}

function renderInlineRuns(runs = [], tools) {
  return runs
    .map((run) => {
      if (run.source_id) {
        const source = tools.sourceMap.get(run.source_id);
        const href = source?.url || run.url || '#footnotes';
        return `<a href="${attr(href)}">${html(run.text)}</a>`;
      }
      return html(run.text);
    })
    .join('');
}

function renderLoopDispatch(issue, tools) {
  const dispatch = issue.loop_dispatch;
  if (!dispatch) return renderCommandDeck(issue, tools);
  const paragraphBlocks = (dispatch.paragraphs || [])
    .map((paragraph) => `<p>${renderInlineRuns(paragraph.runs || [{ text: paragraph.text || '' }], tools)} ${tools.cites(paragraph.source_ids)}</p>`);
  const visibleParagraphs = paragraphBlocks.slice(0, 1).join('\n');
  const hiddenParagraphs = paragraphBlocks.slice(1);
  const extraDispatch = hiddenParagraphs.length
    ? `<details class="dispatch-more"><summary>Open full linked dispatch · ${hiddenParagraphs.length} more receipts</summary>${hiddenParagraphs.join('\n')}</details>`
    : '';
  const chips = (dispatch.chips || [])
    .map((chip) => `<span class="loop-chip">${html(chip.label)} <strong>${html(chip.value)}</strong></span>`)
    .join('\n      ');
  return `<section class="loop-dispatch" id="command" aria-label="Singularity Pulse loop dispatch">
  <figure class="loop-hero">
    <img src="${attr(dispatch.hero_url || './assets/generated/innermost-loop-event-horizon-2026-05-15.jpg')}" alt="${attr(dispatch.hero_alt || 'Futuristic event-horizon over datacenter hero image')}">
    <figcaption>${html(dispatch.hero_caption || 'Generated visual layer · source links live in the copy below')}</figcaption>
  </figure>
  <article class="loop-copy">
    <div class="loop-kicker">${html(dispatch.kicker || 'Inner loop dispatch')}</div>
    <h2>${html(dispatch.headline || 'The curve is a story again.')}</h2>
    <p class="loop-dek">${html(dispatch.dek || '')}</p>
    <div class="loop-chip-row">
      ${chips}
    </div>
    <div class="loop-body">
      ${visibleParagraphs}
      ${extraDispatch}
    </div>
    <p class="loop-close">${html(dispatch.closing_line || '')}</p>
  </article>
</section>`;
}

function renderSignalControls() {
  return `<div class="signal-controls" role="tablist" aria-label="Signal view mode">
  <button type="button" class="signal-toggle active" data-signal-view="brief" role="tab" aria-selected="true">Brief</button>
  <button type="button" class="signal-toggle" data-signal-view="evidence" role="tab" aria-selected="false">Evidence</button>
  <button type="button" class="signal-toggle" data-signal-view="forecast" role="tab" aria-selected="false">Forecast</button>
</div>`;
}

function renderNews(issue, tools) {
  const cards = (issue.news || []).slice(0, 5);
  return (cards.length ? cards : issue.news || [])
    .map((item) => {
      const firstSource = item.source_ids?.[0];
      const source = firstSource ? tools.sourceMap.get(firstSource) : null;
      const title = source ? `<a href="${attr(source.url)}">${html(item.title)}</a>` : html(item.title);
      const tapUrl = item.tap_url || source?.url || '#footnotes';
      return `<article class="brief-card compact story-card" data-impact="${attr(item.impact || 'low')}" data-lane="${attr(slug(item.lane || 'signal'))}">
  <div class="compact-k"><span class="impact ${impactClass(item.impact)}">${html(item.impact || 'low')}</span>${html(item.lane)} <span class="ago">${html(item.freshness)}</span></div>
  <h3>${title} ${tools.cites(item.source_ids)}</h3>
  <p class="story-verdict"><strong>Verdict:</strong> ${html(item.verdict || item.summary)}</p>
  <p class="story-summary">${html(item.summary)}</p>
  <p class="story-evidence"><strong>Evidence:</strong> ${html(item.evidence || item.why_it_matters || 'Source-linked; see footnotes.')}</p>
  <p class="story-forecast"><strong>Watch:</strong> ${html(item.tap_next || item.why_it_matters || 'No next trigger supplied.')}</p>
  <a class="story-tap" href="${attr(tapUrl)}">${html(item.tap_label || 'Open source →')}</a>
</article>`;
    })
    .join('\n');
}

function renderReceiptsLedger(issue) {
  const ledger = issue.receipts_ledger;
  if (!ledger?.items?.length) return '';
  const last = ledger.last_resolved;
  const rows = ledger.items
    .map((item) => `<div class="receipt-cell">
  <div class="receipt-k">${html(item.label)}</div>
  <div class="receipt-v">${html(item.value)}</div>
  <div class="receipt-d">${html(item.delta || '')}</div>
  <div class="receipt-source">${html(item.source || '')}</div>
</div>`)
    .join('\n');
  return `<section class="foundation-ledger" id="ledger" aria-label="Numbers that moved">
  <div class="foundation-head">
    <div><p class="chart-eyebrow">${html(ledger.section_kicker || 'running numbers')}</p><h2>${html(ledger.section_title || 'The Ledger')}</h2></div>
    ${last?.evidence_url ? `<a class="ledger-link" href="${attr(last.evidence_url)}">last resolved →</a>` : ''}
  </div>
  <div class="receipt-grid">${rows}</div>
  ${last ? `<p class="receipt-resolved"><strong>Last resolved:</strong> ${html(last.outcome)} · ${html(last.claim)} <span>(${html(last.made_by || 'ledger')})</span></p>` : ''}
</section>`;
}

function renderSingularityCountdowns(issue) {
  const block = issue.singularity_countdowns;
  const cards = block?.cards || [];
  if (!cards.length) return '<p class="empty-section">No milestone clock supplied for this issue.</p>';
  return `<div class="tracker-intro">
  <p class="chart-eyebrow">${html(block.kicker || 'milestone probabilities')}</p>
  <h3>${html(block.headline || 'Singularity milestone clock')}</h3>
  <p>${html(block.summary || 'Each milestone keeps its own probability and evidence trail.')}</p>
</div>
<div class="milestone-grid">
${cards.slice(0, 8).map((card) => {
    const probability = clampScore(card.p_percent);
    const delta = Number(card.delta_pp || 0);
    const deltaClass = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
    return `<article class="milestone-card" style="--p:${probability / 100}">
  <div class="milestone-top"><span>${html(card.name)}</span><strong>${probability}%</strong></div>
  <div class="milestone-meter" aria-hidden="true"><span></span></div>
  <div class="milestone-meta"><span>${html(card.target_date || 'unresolved')}</span><span class="${deltaClass}">${delta > 0 ? '+' : ''}${html(delta)}pp</span></div>
  <p>${html(card.latest_evidence || card.tagline || '')}</p>
</article>`;
  }).join('\n')}
</div>`;
}

function renderOpenLedger(issue) {
  const ledger = issue.open_ledger;
  if (!ledger) return '<p class="empty-section">Prediction ledger unavailable for this issue.</p>';
  const resolving = ledger.resolving_this_week?.[0];
  const liveRows = (ledger.live_bets || []).slice(0, 4)
    .map((bet) => `<li><strong>${html(typeof bet.confidence === 'number' ? `${Math.round(bet.confidence * 100)}%` : bet.confidence)}</strong> ${html(bet.claim)} <span>${html(bet.days_to_resolve)}d</span></li>`)
    .join('\n');
  const resolvedRows = (ledger.just_resolved || []).slice(0, 3)
    .map((bet) => `<li><strong>${html(bet.outcome)}</strong> ${bet.evidence_url ? `<a href="${attr(bet.evidence_url)}">${html(bet.claim)}</a>` : html(bet.claim)}</li>`)
    .join('\n');
  return `<div class="open-ledger prediction-market">
  <div class="open-ledger-head">
    <div><p class="chart-eyebrow">${html(ledger.section_kicker || 'prediction ledger')}</p><h3>${html(ledger.section_title || 'Open Ledger')}</h3></div>
    <div class="brier-badge"><span>Brier</span><strong>${html(ledger.brier_index)}%</strong><em>n=${html(ledger.n_resolved)}</em></div>
  </div>
  <p>${html(ledger.summary || '')}</p>
  ${resolving ? `<div class="resolving-card"><span>resolves this week</span><strong>${html(Math.round(Number(resolving.confidence || 0) * 100))}%</strong><p>${html(resolving.claim)}</p></div>` : ''}
  <div class="open-ledger-cols">
    <div><h4>Live bets</h4><ul>${liveRows}</ul></div>
    <div><h4>Just resolved</h4><ul>${resolvedRows}</ul></div>
  </div>
  <p class="ledger-caveat">${html(ledger.calibration_note || 'Small sample; tracked as calibration, not truth.')}</p>
</div>`;
}

function renderNamedTape(issue) {
  const tape = issue.named_tape;
  if (!tape?.items?.length) return '';
  return `<div class="named-tape" aria-label="Insider source tape">
  <div class="named-tape-head"><p class="chart-eyebrow">${html(tape.section_kicker || 'insider tape')}</p><h3>${html(tape.section_title || 'Named Tape')}</h3></div>
  <div class="named-tape-grid">
    ${tape.items.slice(0, 5).map((item) => `<article>
      <a href="${attr(item.url)}">${html(item.handle)}</a>
      <span>${html(item.role)}</span>
      <p>${html(item.claim)}</p>
      <em>${html(item.cross_lab || '')}</em>
    </article>`).join('\n')}
  </div>
</div>`;
}

function renderComponents(issue, tools) {
  const components = issue.tracker?.sp_index?.components || [];
  return components
    .map((component) => `<div class="comp">
  <span class="ckey">${html(component.label)} ${tools.cites(component.source_ids)}</span>
  <span class="cval">${html(component.value)}</span>
  <span class="cdelta ${attr(component.dir || 'flat')}">${html(component.delta || '')}</span>
</div>`)
    .join('\n');
}

function dateToX(date, minTime, maxTime, left, width) {
  const time = new Date(`${date}T00:00:00Z`).getTime();
  if (maxTime === minTime) return left + width;
  return left + ((time - minTime) / (maxTime - minTime)) * width;
}

function logY(value, minLog, maxLog, top, height) {
  const logValue = Math.log10(Math.max(value, 0.01));
  if (maxLog === minLog) return top + height;
  return top + height - ((logValue - minLog) / (maxLog - minLog)) * height;
}

function linePath(points) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');
}

function renderMetrChart(series, issueDate) {
  const width = 900;
  const height = 340;
  const left = 78;
  const right = 60;
  const top = 28;
  const bottom = 64;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  const ordered = [...(series || [])].sort((a, b) => new Date(`${a.date}T00:00:00Z`).getTime() - new Date(`${b.date}T00:00:00Z`).getTime());
  if (!ordered.length) return '';

  const dates = ordered.map((point) => new Date(`${point.date}T00:00:00Z`).getTime());
  const minTime = Math.min(...dates);
  const maxTime = Math.max(...dates);
  const values = ordered.flatMap((point) => [point.p50_minutes, point.p80_minutes]).filter((value) => Number.isFinite(value) && value > 0);
  const minLog = Math.floor(Math.log10(Math.min(...values)));
  const maxLog = Math.ceil(Math.log10(Math.max(...values)));

  const yearTicks = ['2023-01-01', '2024-01-01', '2025-01-01', '2026-01-01'];
  const quarterTicks = [];
  for (const year of [2023, 2024, 2025, 2026]) {
    for (const [month, label] of [[4, 'Apr'], [7, 'Jul'], [10, 'Oct']]) {
      quarterTicks.push({ date: `${year}-${String(month).padStart(2, '0')}-01`, label });
    }
  }
  const decadeTicks = [1, 10, 100, 1000].filter((tick) => Math.log10(tick) >= minLog && Math.log10(tick) <= maxLog);
  const anchorTicks = [60, 1440].filter((tick) => Math.log10(tick) >= minLog && Math.log10(tick) <= maxLog);

  // Frontier rolling-max - the line stays at max-so-far when a newer model
  // scored lower than a predecessor, so no backward zigzag.
  const frontierP50 = [];
  const frontierP80 = [];
  let maxP50 = 0;
  let maxP80 = 0;
  for (const point of ordered) {
    if (point.p50_minutes > maxP50) { maxP50 = point.p50_minutes; frontierP50.push(point); }
    if (point.p80_minutes > maxP80) { maxP80 = point.p80_minutes; frontierP80.push(point); }
  }
  const caveatMinutes = 960;

  function linearY(valueMinutes, maxMinutes) {
    const clamped = Math.max(0, Math.min(valueMinutes, maxMinutes));
    if (maxMinutes <= 0) return top + chartHeight;
    return top + ((maxMinutes - clamped) / maxMinutes) * chartHeight;
  }

  function shortModel(model) {
    const text = String(model || '');
    if (/mythos/i.test(text)) return 'Mythos';
    return text.replace(/\s*\(.*?\)\s*/g, '').slice(0, 32);
  }

  const p50Log = ordered.map((point) => ({
    ...point,
    x: dateToX(point.date, minTime, maxTime, left, chartWidth),
    y: logY(point.p50_minutes, minLog, maxLog, top, chartHeight)
  }));
  const p50FrontLog = frontierP50.map((point) => ({
    ...point,
    x: dateToX(point.date, minTime, maxTime, left, chartWidth),
    y: logY(point.p50_minutes, minLog, maxLog, top, chartHeight)
  }));
  const p80FrontLog = frontierP80.map((point) => ({
    ...point,
    x: dateToX(point.date, minTime, maxTime, left, chartWidth),
    y: logY(point.p80_minutes, minLog, maxLog, top, chartHeight)
  }));
  const p80Log = ordered.map((point) => ({
    ...point,
    x: dateToX(point.date, minTime, maxTime, left, chartWidth),
    y: logY(point.p80_minutes, minLog, maxLog, top, chartHeight)
  }));

  const maxLinear = Math.max(1200, Math.ceil(Math.max(...values) / 240) * 240);
  const p50Linear = ordered.map((point) => ({
    ...point,
    x: dateToX(point.date, minTime, maxTime, left, chartWidth),
    y: linearY(point.p50_minutes, maxLinear)
  }));
  const p80Linear = ordered.map((point) => ({
    ...point,
    x: dateToX(point.date, minTime, maxTime, left, chartWidth),
    y: linearY(point.p80_minutes, maxLinear)
  }));

  const last = p50Log.at(-1);
  const y16Log = logY(caveatMinutes, minLog, maxLog, top, chartHeight);
  const y16Linear = linearY(caveatMinutes, maxLinear);

  const logFrame = `<div class="metr-chart-frame" data-scale="log">
  <div class="metr-chart-header">
    <span class="metr-scale-tag" style="background:rgba(124,247,255,0.10);color:var(--accent);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;padding:5px 12px;border-radius:999px;border:1px solid rgba(124,247,255,0.35);display:inline-block;margin-bottom:8px;font-weight:700;">CHART 1 — LOG SCALE</span>
    <p class="metr-axis-note" style="margin:0 0 8px;color:var(--muted);font-size:12px;font-family:'JetBrains Mono',monospace;line-height:1.4;">Y (left) = clean log decades — 1 min, 10 min, 100 min, 1000 min. Y (right) = small "= 1 hr" / "= 1 day" / "= 16 hr" anchors at their real log positions. Use this view for rate of progress.</p>
  </div>
  <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="METR Time Horizon - LOG scale - ${ordered.length} models, frontier rolling-max">
    ${y16Log > top ? `<rect class="metr-caveat-band" x="${left}" y="${top}" width="${chartWidth}" height="${(y16Log - top).toFixed(2)}" fill="rgba(245,158,11,0.05)" />\n    <text class="metr-axis" x="${left + 6}" y="${top + 14}" font-size="10" fill="#f59e0b">amber band - METR caveat: values above 16 hr unreliable</text>` : ''}
    ${decadeTicks.sort((a, b) => b - a).map((tick) => {
      const y = logY(tick, minLog, maxLog, top, chartHeight);
      return `<line class="metr-grid" x1="${left}" x2="${width - right}" y1="${y.toFixed(2)}" y2="${y.toFixed(2)}" stroke="var(--rule)" stroke-width="0.8" />` +
        `<text class="metr-axis" x="8" y="${(y + 3.5).toFixed(2)}" font-size="11" font-weight="700" fill="var(--muted)">${tick} min</text>`;
    }).join('\n    ')}
    ${anchorTicks.map((tick) => {
      const y = logY(tick, minLog, maxLog, top, chartHeight);
      const label = tick === 60 ? '= 1 hr' : tick === 1440 ? '= 1 day' : '';
      return `<line class="metr-grid" x1="${left}" x2="${width - right}" y1="${y.toFixed(2)}" y2="${y.toFixed(2)}" stroke="rgba(124,247,255,0.10)" stroke-dasharray="1 3" />` +
        `<text class="metr-axis" x="${width - right + 6}" y="${(y + 3.5).toFixed(2)}" font-size="10" fill="rgba(148,163,184,0.75)">${label}</text>`;
    }).join('\n    ')}
    <line class="metr-grid" x1="${left}" x2="${width - right}" y1="${y16Log.toFixed(2)}" y2="${y16Log.toFixed(2)}" stroke="#f59e0b" stroke-opacity="0.55" stroke-dasharray="3 3" /><text class="metr-axis" x="${width - right + 6}" y="${(y16Log + 3.5).toFixed(2)}" font-size="10" fill="#f59e0b" font-weight="700">= 16 hr</text>
    ${quarterTicks.map((q) => {
      const x = dateToX(q.date, minTime, maxTime, left, chartWidth);
      if (x < left + 4 || x > width - right - 4) return '';
      return `<line class="metr-grid" x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${top + chartHeight - 4}" y2="${top + chartHeight + 4}" stroke="rgba(124,247,255,0.20)" stroke-width="0.7" /><text class="metr-axis" x="${(x - 7).toFixed(1)}" y="${height - 30}" font-size="9" fill="rgba(148,163,184,0.65)">${q.label}</text>`;
    }).filter(Boolean).join('\n    ')}
    ${yearTicks.map((date) => {
      const x = dateToX(date, minTime, maxTime, left, chartWidth);
      return `<line class="metr-grid vertical" x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${top}" y2="${top + chartHeight}" stroke="var(--rule)" stroke-dasharray="2 3" /><text class="metr-axis" x="${(x - 14).toFixed(1)}" y="${height - 14}" font-size="12" font-weight="700">${date.slice(0, 4)}</text>`;
    }).join('\n    ')}
    <text class="metr-axis metr-axis-label" x="${(left + chartWidth / 2).toFixed(0)}" y="${height - 2}" text-anchor="middle" font-size="11" fill="var(--muted)" font-weight="600">x-axis: release date (linear) — bold = year, faint ticks = Apr/Jul/Oct</text>
    <path class="metr-line" d="${linePath(p50FrontLog)}" />
    <path class="metr-line p80-line" d="${linePath(p80FrontLog)}" />
    ${p50Log.map((point, index) => `<circle class="metr-dot" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${index === p50Log.length - 1 ? 4.5 : 2.8}"><title>${html(point.model)} - p50 ${point.p50_minutes.toFixed(2)} min (${html(point.date)})</title></circle>`).join('\n    ')}
    ${p80Log.map((point, index) => `<circle class="metr-dot p80-dot" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${index === p80Log.length - 1 ? 4.0 : 2.3}"><title>${html(point.model)} - p80 ${point.p80_minutes.toFixed(2)} min (${html(point.date)})</title></circle>`).join('\n    ')}
    <line class="metr-callout-line" x1="${last.x.toFixed(1)}" y1="${last.y.toFixed(1)}" x2="${Math.max(left + 120, last.x - 80).toFixed(1)}" y2="${Math.max(top + 18, last.y - 14).toFixed(1)}" stroke="var(--accent)" stroke-width="1" stroke-dasharray="2 2" opacity="0.7" />
    <text class="bc-value-label" x="${Math.max(left + 118, last.x - 82).toFixed(1)}" y="${Math.max(top + 16, last.y - 16).toFixed(1)}" text-anchor="end" font-size="11">${html(shortModel(last.model))} - ${last.p50_minutes.toFixed(2)} min (${(last.p50_minutes / 60).toFixed(2)} hr)</text>
  </svg>
</div>`;

  const linearTicks = [0, 240, 480, 720, 960, 1200].filter((tick) => tick <= maxLinear);
  const linearFrame = `<div class="metr-chart-spacer" style="height:16px;"></div>
<div class="metr-chart-frame" data-scale="linear">
  <div class="metr-chart-header">
    <span class="metr-scale-tag" style="background:rgba(192,132,252,0.12);color:var(--accent-2);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;padding:5px 12px;border-radius:999px;border:1px solid rgba(192,132,252,0.35);display:inline-block;margin-bottom:8px;font-weight:700;">CHART 2 — LINEAR SCALE</span>
    <p class="metr-axis-note" style="margin:0 0 8px;color:var(--muted);font-size:12px;font-family:'JetBrains Mono',monospace;line-height:1.4;">Y = minutes shown as hours — 0, 4 hr, 8 hr, 12 hr, 16 hr, 20 hr. Equal vertical distance = equal time. Use this view for magnitude of recent jump.</p>
  </div>
  <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="METR Time Horizon - LINEAR scale - same ${ordered.length} models">
    ${y16Linear > top ? `<rect class="metr-caveat-band" x="${left}" y="${top}" width="${chartWidth}" height="${(y16Linear - top).toFixed(2)}" fill="rgba(245,158,11,0.05)" />` : ''}
    ${linearTicks.map((tick) => {
      const y = linearY(tick, maxLinear);
      const label = tick === 0 ? '0' : `${Math.round(tick / 60)} hr`;
      return `<line class="metr-grid" x1="${left}" x2="${width - right}" y1="${y.toFixed(2)}" y2="${y.toFixed(2)}" stroke="var(--rule)" stroke-width="0.8" />` +
        `<text class="metr-axis" x="8" y="${(y + 3.5).toFixed(2)}" font-size="11" font-weight="700" fill="var(--muted)">${label}</text>`;
    }).join('\n    ')}
    <line class="metr-grid" x1="${left}" x2="${width - right}" y1="${y16Linear.toFixed(2)}" y2="${y16Linear.toFixed(2)}" stroke="#f59e0b" stroke-opacity="0.55" stroke-dasharray="3 3" /><text class="metr-axis" x="${width - right + 6}" y="${(y16Linear + 3.5).toFixed(2)}" font-size="10" fill="#f59e0b" font-weight="700">16 hr caveat</text>
    ${quarterTicks.map((q) => {
      const x = dateToX(q.date, minTime, maxTime, left, chartWidth);
      if (x < left + 4 || x > width - right - 4) return '';
      return `<line class="metr-grid" x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${top + chartHeight - 4}" y2="${top + chartHeight + 4}" stroke="rgba(124,247,255,0.20)" stroke-width="0.7" /><text class="metr-axis" x="${(x - 7).toFixed(1)}" y="${height - 30}" font-size="9" fill="rgba(148,163,184,0.65)">${q.label}</text>`;
    }).filter(Boolean).join('\n    ')}
    ${yearTicks.map((date) => {
      const x = dateToX(date, minTime, maxTime, left, chartWidth);
      return `<line class="metr-grid vertical" x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${top}" y2="${top + chartHeight}" stroke="var(--rule)" stroke-dasharray="2 3" /><text class="metr-axis" x="${(x - 14).toFixed(1)}" y="${height - 14}" font-size="12" font-weight="700">${date.slice(0, 4)}</text>`;
    }).join('\n    ')}
    <text class="metr-axis metr-axis-label" x="${(left + chartWidth / 2).toFixed(0)}" y="${height - 2}" text-anchor="middle" font-size="11" fill="var(--muted)" font-weight="600">x-axis: release date (linear) — bold = year, faint ticks = Apr/Jul/Oct</text>
    <path class="metr-line" d="${linePath(frontierP50.map(p => ({ ...p, x: dateToX(p.date, minTime, maxTime, left, chartWidth), y: linearY(p.p50_minutes, maxLinear) })))}" />
    <path class="metr-line p80-line" d="${linePath(frontierP80.map(p => ({ ...p, x: dateToX(p.date, minTime, maxTime, left, chartWidth), y: linearY(p.p80_minutes, maxLinear) })))}" />
    ${p50Linear.map((point, index) => `<circle class="metr-dot" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${index === p50Linear.length - 1 ? 4.5 : 2.8}"><title>${html(point.model)} - p50 ${point.p50_minutes.toFixed(2)} min (${html(point.date)})</title></circle>`).join('\n    ')}
    ${p80Linear.map((point, index) => `<circle class="metr-dot p80-dot" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${index === p80Linear.length - 1 ? 4.0 : 2.3}"><title>${html(point.model)} - p80 ${point.p80_minutes.toFixed(2)} min (${html(point.date)})</title></circle>`).join('\n    ')}
    <line class="metr-callout-line" x1="${p50Linear.at(-1).x.toFixed(1)}" y1="${p50Linear.at(-1).y.toFixed(1)}" x2="${Math.max(left + 160, p50Linear.at(-1).x - 60).toFixed(1)}" y2="${Math.max(top + 18, p50Linear.at(-1).y - 22).toFixed(1)}" stroke="var(--accent)" stroke-width="1" stroke-dasharray="2 2" opacity="0.7" />
    <text class="bc-value-label" x="${Math.max(left + 158, p50Linear.at(-1).x - 62).toFixed(1)}" y="${Math.max(top + 16, p50Linear.at(-1).y - 24).toFixed(1)}" text-anchor="end" font-size="11">${html(shortModel(p50Linear.at(-1).model))} - ${p50Linear.at(-1).p50_minutes.toFixed(2)} min p50 (${(p50Linear.at(-1).p50_minutes / 60).toFixed(2)} hr)</text>
  </svg>
</div>`;

  return `<div class="metr-lab tracker-chart">
  <div class="chart-deck-head">
    <div><p class="chart-eyebrow">METR Time Horizon 1.1 · ${ordered.length} models · verified ${html(issueDate)} · LOG + LINEAR pair</p><h3>How long can frontier agents work?</h3></div>
    <div class="chart-legend"><span class="legend-p50">p50 success</span><span class="legend-p80">p80 success</span></div>
  </div>
  <!-- chart by codex at implementation time — rendered from data/issues/${html(issueDate)}.json -->
  ${logFrame}
  ${linearFrame}
  <p class="metr-caption"><strong>How to read this:</strong> two views of the same ${ordered.length} METR-published models. <strong>Chart 1 (LOG):</strong> left Y axis = clean log decades (1 min, 10 min, 100 min, 1000 min — each decade is the same vertical distance). Right Y axis = small <em>= 1 hr</em>, <em>= 1 day</em>, <em>= 16 hr</em> anchor lines so you can translate. <strong>Chart 2 (LINEAR):</strong> Y axis = real minutes shown in hours (0, 4, 8, 12, 16, 20). Equal vertical distance = equal time. <strong>X axis (both):</strong> linear time — bold year labels at 2023-2026, faint Apr/Jul/Oct quarterly ticks so you can read intra-year release timing. The amber band on both = METR’s own caveat that measurements above 16 hr are unreliable. The frontier-rolling-max lines stay at max-so-far when a newer model scored lower than a predecessor (so the line never goes backward in either time or value).</p>
</div>`;
}

function renderBenchmarkMatrix(panel, tools) {
  const rows = panel.matrix || [];
  if (!rows.length) return '';
  return `<div class="benchmark-matrix-wrap">
  <div class="chart-deck-head">
    <div><p class="chart-eyebrow">Benchmark matrix · exact cells</p><h3>${html(panel.matrix_title || 'Current frontier cells')}</h3></div>
    <div class="tracker-status live-primary">source-linked</div>
  </div>
  <table class="benchmark-table benchmark-matrix source-backed">
    <thead><tr><th>Model / system</th><th>Benchmark</th><th>Value</th><th>Eval date</th><th>Read</th></tr></thead>
    <tbody>${rows.map((row) => `<tr>
  <td>${html(row.model)}</td>
  <td>${tools.cites(row.source_ids)} ${html(row.benchmark)}</td>
  <td class="score-cell">${html(row.value)}</td>
  <td>${html(row.eval_date || 'rolling')}</td>
  <td>${html(row.note || '')}</td>
</tr>`).join('\n')}</tbody>
  </table>
</div>`;
}

function clampScore(value) {
  const score = Number(value);
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, score));
}

function renderBenchmarkCompilation(panel, tools) {
  const compilation = panel.compilation;
  if (!compilation) return '';
  const axes = compilation.axes || [];
  const score = clampScore(compilation.score);
  const arc = ((score / 100) * 360).toFixed(1);
  const confidence = compilation.confidence || 'medium confidence';
  const rows = axes.map((axis) => {
    const axisScore = clampScore(axis.score);
    return `<div class="range-axis" data-bench-lane="${attr(slug(axis.lane || 'lane'))}" style="--axis:${(axisScore / 100).toFixed(3)}; --axis-score:${axisScore};">
  <div class="range-axis-meta">
    <span>${html(axis.lane)} <em>${html(axis.change_label || axis.changed_since_last || 'tracked')}</em></span>
    <strong>${html(axis.value)}</strong>
  </div>
  <div class="range-prism-track" aria-hidden="true"><span></span></div>
  <p>${html(axis.read || axis.note || '')} ${tools.cites(axis.source_ids)}</p>
</div>`;
  }).join('\n');
  const filterButtons = [
    { label: 'All', value: 'all' },
    ...axes.map((axis) => ({ label: axis.filter_label || axis.lane, value: slug(axis.lane || 'lane') }))
  ]
    .map((filter, index) => `<button type="button" class="bench-filter ${index === 0 ? 'active' : ''}" data-bench-filter="${attr(filter.value)}">${html(filter.label)}</button>`)
    .join('\n      ');

  return `<div class="rangefinder-panel" aria-label="3D benchmark compilation">
  <!-- compiled by codex at 6:35 PM ET — source-backed rangefinder -->
  <div class="rangefinder-copy">
    <p class="chart-eyebrow">3D benchmark compilation · SP-Index rangefinder</p>
    <h3>${html(compilation.headline || 'Singularity proximity rangefinder')}</h3>
    <p>${html(compilation.read || '')} ${tools.cites(compilation.source_ids)}</p>
    <p class="rangefinder-verdict"><strong>${html(compilation.verdict_label || 'Final number')}:</strong> ${html(compilation.verdict || '')}</p>
  </div>
  <div class="rangefinder-meter" style="--range-arc:${arc}deg;" role="img" aria-label="Singularity proximity ${score} out of 100">
    <div class="rangefinder-dial">
      <span class="rangefinder-score">${html(compilation.label || `${score}/100`)}</span>
      <span class="rangefinder-caption">${html(confidence)}</span>
    </div>
  </div>
  <div class="range-axis-stack">
    <div class="bench-filter-row" role="tablist" aria-label="Benchmark lane filters">
      ${filterButtons}
    </div>
    ${rows}
  </div>
</div>`;
}

function renderBenchmarkCockpitVisual(panel, tools) {
  const axes = panel.compilation?.axes || [];
  if (!axes.length) return '';
  const bars = axes.map((axis, index) => {
    const score = clampScore(axis.score);
    const x = 100 + index * 150;
    const topY = 308 - score * 2.15;
    const height = 308 - topY;
    const colors = ['#7cf7ff', '#c084fc', '#34d399', '#fbbf24', '#60a5fa'];
    const color = colors[index % colors.length];
    return `<g class="cockpit-bar" data-bench-lane="${attr(slug(axis.lane || 'lane'))}">
  <polygon points="${x},308 ${x + 54},288 ${x + 54},${topY} ${x},${topY + 20}" fill="${color}" opacity="0.24" stroke="${color}" />
  <polygon points="${x + 54},288 ${x + 88},304 ${x + 88},${topY + 16} ${x + 54},${topY}" fill="${color}" opacity="0.14" stroke="${color}" />
  <polygon points="${x},${topY + 20} ${x + 54},${topY} ${x + 88},${topY + 16} ${x + 34},${topY + 38}" fill="rgba(229,247,255,0.22)" stroke="${color}" />
  <text x="${x + 44}" y="${topY - 8}" text-anchor="middle" class="cockpit-value">${score}</text>
  <text x="${x + 44}" y="342" text-anchor="middle" class="cockpit-label">${html(axis.filter_label || axis.lane)}</text>
  <title>${html(axis.lane)} — ${html(axis.value)} — ${html(axis.read || '')}</title>
</g>`;
  }).join('\n');

  return `<div class="benchmark-cockpit-visual">
  <!-- benchmark cockpit by codex — source-backed SVG, no synthetic values -->
  <div class="cockpit-copy">
    <p class="chart-eyebrow">Benchmark cockpit · filtered evidence lanes</p>
    <h3>Stop reading tables first. Read the shape.</h3>
    <p>Each tower is a sourced evidence lane. Height is the lane’s current 0-100 proximity read; raw values and caveats stay below. ${tools.cites(panel.compilation?.source_ids || panel.source_ids || [])}</p>
  </div>
  <svg viewBox="0 0 900 390" role="img" aria-label="3D benchmark cockpit towers for current Singularity Pulse lanes">
    <defs>
      <radialGradient id="cockpitGlow" cx="50%" cy="45%" r="70%">
        <stop offset="0" stop-color="rgba(124,247,255,0.28)" />
        <stop offset="1" stop-color="rgba(2,6,23,0)" />
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="900" height="390" rx="28" fill="rgba(2,6,23,0.70)" />
    <ellipse cx="450" cy="310" rx="410" ry="78" fill="url(#cockpitGlow)" />
    <g opacity="0.22" stroke="rgba(124,247,255,0.75)" stroke-width="1">
      <path d="M50 312h800M110 278h680M170 244h560M230 210h440M290 176h320" />
      <path d="M450 92 70 350M450 92l380 258M450 92v258M450 92 260 350M450 92l190 258" />
    </g>
    <g transform="translate(0 0)">${bars}</g>
    <circle cx="450" cy="170" r="74" fill="rgba(2,6,23,0.76)" stroke="#7cf7ff" stroke-width="4" />
    <path d="M450 96a74 74 0 1 1-62 114" fill="none" stroke="#7cf7ff" stroke-width="9" stroke-linecap="round" />
    <path d="M450 96a74 74 0 0 1 68 103" fill="none" stroke="#c084fc" stroke-width="9" stroke-linecap="round" />
    <text x="450" y="164" text-anchor="middle" class="cockpit-small">FINAL READ</text>
    <text x="450" y="204" text-anchor="middle" class="cockpit-score">${html(panel.compilation?.label || '66/100')}</text>
  </svg>
</div>`;
}

function renderBenchmarkDashboard(issue, tools, registry) {
  const panel = issue.benchmark_panel || {};
  if (panel.mode === 'accelerando' || panel.mode === 'innermost-loop') {
    return renderAccelerandoModelBoard(panel, tools);
  }
  const cards = (panel.metrics || [])
    .map((metric) => `<div class="bench-card">
  <div class="bc-k">${html(metric.label)} ${tools.cites(metric.source_ids)}</div>
  <div class="bc-v">${html(metric.value)}</div>
  <div class="bc-note">${html(metric.sub)}</div>
</div>`)
    .join('\n');
  const sourceRows = (registry.benchmarks || [])
    .map((benchmark) => `<tr>
  <td><a href="${attr(benchmark.source_url)}">${html(benchmark.label)}</a></td>
  <td>${html(benchmark.lane.replaceAll('_', ' '))}</td>
  <td><span class="tracker-status ${attr(benchmark.status)}">${html(benchmark.status)}</span></td>
  <td>${html(benchmark.display_rule)}</td>
</tr>`)
    .join('\n');

  return `<div class="score-method"><strong>${html(panel.headline)}</strong> ${html(panel.method)} ${tools.cites(panel.source_ids)}</div>
${renderBenchmarkCockpitVisual(panel, tools)}
<div class="bench-grid">${cards}</div>
${renderBenchmarkCompilation(panel, tools)}
${renderMetrChart(panel.series || [], issue.issue_date)}
${renderBenchmarkMatrix(panel, tools)}
<details class="benchmark-detail" open>
  <summary>Tracked benchmark lanes</summary>
  <table class="benchmark-table source-backed">
    <thead><tr><th>Benchmark</th><th>Lane</th><th>Status</th><th>Render rule</th></tr></thead>
    <tbody>${sourceRows}</tbody>
  </table>
</details>`;
}

function renderAccelerandoModelBoard(panel, tools) {
  const wire = panel.latest_news || [];
  const rankings = panel.model_rankings || [];
  const wireCards = wire
    .map((item) => {
      const firstSource = tools.sourceMap.get(item.source_ids?.[0]);
      const title = firstSource ? `<a href="${attr(firstSource.url)}">${html(item.title)}</a>` : html(item.title);
      return `<article class="benchmark-wire-card">
  <div class="compact-k">${html(item.label || 'benchmark wire')} ${tools.cites(item.source_ids)}</div>
  <h3>${title}</h3>
  <p>${html(item.summary || '')}</p>
</article>`;
    })
    .join('\n');
  const rankingRows = rankings
    .map((row) => {
      const firstSource = tools.sourceMap.get(row.source_ids?.[0]);
      const model = firstSource ? `<a href="${attr(firstSource.url)}">${html(row.model)}</a>` : html(row.model);
      return `<li class="model-rank-row">
  <span class="rank-num">${html(row.rank)}</span>
  <span class="rank-model">${model}<em>${html(row.lane || '')}</em></span>
  <strong>${html(row.score || row.value || '')}</strong>
  <span class="rank-read">${html(row.read || '')} ${tools.cites(row.source_ids)}</span>
</li>`;
    })
    .join('\n');
  return `<div class="accelerando-model-board">
  <!-- accelerando model board by codex — slim rankings, source links intact -->
  <figure class="model-board-art">
    <img src="${attr(panel.rankings_asset_url || './assets/generated/accelerando-model-rankings-2026-05-15.jpg')}" alt="${attr(panel.rankings_asset_alt || 'Generated futuristic model rankings podium art')}">
    <figcaption>${html(panel.rankings_asset_caption || 'Generated visual layer · rankings below are source-linked')}</figcaption>
  </figure>
  <div class="benchmark-wire">
    <p class="chart-eyebrow">${html(panel.section_kicker || 'Benchmark wire')}</p>
    <h3>${html(panel.section_headline || 'Latest benchmark news, not benchmark sprawl.')}</h3>
    <p>${html(panel.section_summary || 'Keep the newest benchmark movement and a narrow model board. Cut the rest unless it changes the curve.')} ${tools.cites(panel.source_ids || [])}</p>
    <div class="wire-grid">${wireCards}</div>
  </div>
  <ol class="model-ranking-list">
    ${rankingRows}
  </ol>
</div>`;
}

function renderAi2027(issue, tools) {
  return (issue.ai_2027 || [])
    .map((lane) => `<article class="timeline-card primary">
  <div class="compact-k">${html(lane.lane)} · <span class="tracker-status ${attr(slug(lane.status))}">${html(lane.status)}</span> ${tools.cites(lane.source_ids)}</div>
  <h3>${html(lane.original)}</h3>
  <p><strong>Latest revision:</strong> ${html(lane.revision)}</p>
  <p><strong>Today’s evidence:</strong> ${html(lane.evidence)}</p>
</article>`)
    .join('\n');
}

function renderMedia(issue, tools) {
  return (issue.media || [])
    .map((item) => {
      const firstSource = tools.sourceMap.get(item.source_ids?.[0]);
      const title = firstSource ? `<a href="${attr(firstSource.url)}">${html(item.title)}</a>` : html(item.title);
      const label = item.classification || (/youtube/i.test(item.platform || '') ? 'Primary Footage' : /reddit/i.test(item.platform || '') ? 'Discussion' : /x/i.test(item.platform || '') ? 'Insider Tape' : 'Media');
      return `<article class="media-card">
  <div class="compact-k">${html(item.platform)} · ${html(label)} <span class="ago">${html(item.freshness)}</span> ${tools.cites(item.source_ids)}</div>
  <h3>${title}</h3>
  <p>${html(item.summary)}</p>
</article>`;
    })
    .join('\n');
}

function renderForecastRadar(issue, tools) {
  const items = issue.forecast_radar || [];
  if (!items.length) return '<p class="empty-section">No forecast radar cards supplied for this issue.</p>';
  return items
    .map((item) => `<article class="radar-card ${attr(item.tone || 'watch')}">
  <div class="compact-k">${html(item.window || 'watch')} · ${html(item.lane || 'frontier')} ${tools.cites(item.source_ids)}</div>
  <h3>${html(item.title)}</h3>
  <p><strong>Trigger:</strong> ${html(item.trigger || '')}</p>
  <p><strong>Read:</strong> ${html(item.read || '')}</p>
  <div class="radar-meta"><span>${html(item.confidence || 'medium confidence')}</span><span>${html(item.status || 'watching')}</span></div>
</article>`)
    .join('\n');
}

function renderConversation(issue) {
  return (issue.conversation || [])
    .map((item) => `<article class="conversation-card">
  <div class="compact-k">${html(item.agent)} · ${html(item.label)}</div>
  <h3>${html(item.agent === 'Codex' ? 'What changed' : 'What carried forward')}</h3>
  <p>${html(item.text)}</p>
</article>`)
    .join('\n');
}

function renderSourceLedger(issue) {
  return (issue.sources || [])
    .map((source) => `<div class="source-item">
  <div><div class="s-title"><a href="${attr(source.url)}">${html(source.title)}</a></div><div class="s-meta">${html(source.publisher)} · ${html(source.type)} · ${html(source.freshness)}</div></div>
  <span class="verify ${attr(source.verification_status)}">${html(source.verification_status)}</span>
</div>`)
    .join('\n');
}

function renderFootnotes(issue, tools) {
  return tools.footnoteIds
    .map((sourceId) => {
      const source = tools.sourceMap.get(sourceId);
      const note = String(source.note || source.notes || source.type || '').replace(/[.。]\s*$/, '');
      return `<li id="fn-${attr(source.id)}"><a href="${attr(source.url)}">${html(source.title)}</a> — ${html(source.publisher)} · ${html(source.freshness)} · ${html(note)}.</li>`;
    })
    .join('\n    ');
}

function renderScoreboard(issue, tools) {
  const tracker = issue.tracker?.sp_index || {};
  const points = [
    { label: 'SP-Index', value: tracker.score, sub: tracker.delta_label },
    { label: 'Jon’s Pulse', value: tracker.jon_score, sub: tracker.jon_delta_label },
    { label: 'Benchmark score', value: 'paused', sub: 'raw rows only' },
    { label: 'Source count', value: issue.source_count, sub: 'visible footnotes' }
  ];
  return `<div class="v81-stats">${points.map((point) => `<div class="v81-stat"><div class="st-label">${html(point.label)}</div><div class="st-value accent">${html(point.value)}</div><div class="st-sub">${html(point.sub)}</div></div>`).join('')}</div>
<p class="benchmark-note">Scoreboard kept compact. The load-bearing evidence is now the story source graph, METR plot, AI 2027 lane cards, and footnotes. ${tools.cites(issue.benchmark_panel?.source_ids || [])}</p>`;
}

function empty(label) {
  return `<p class="empty-section">📭 ${html(label)} now feeds the condensed newsletter spine instead of rendering as a separate section.</p>`;
}

function renderIssue(issue, registry) {
  validateIssue(issue, `data/issues/${issue.issue_date}.json`);
  const tools = buildSourceTools(issue);
  const tracker = issue.tracker.sp_index;
  const topItem = issue.news?.[0] || {};
  const topSource = tools.sourceMap.get(topItem.source_ids?.[0]);
  const latestClaude = [...(issue.conversation || [])].reverse().find((item) => item.agent === 'Claude') || issue.conversation?.[0];
  const latestCodex = [...(issue.conversation || [])].reverse().find((item) => item.agent === 'Codex') || issue.conversation?.[1];
  const replacements = {
    TITLE: issue.title,
    ISSUE_NUMBER: issue.issue_number,
    DATE_LONG: issue.date_long,
    AGENT_BYLINES: renderBylines(issue),
    SPI_SCORE: tracker.score,
    SPI_DELTA: tracker.delta_label,
    SPI_DELTA_DIR: tracker.delta_dir,
    SPI_DELTA_30D: tracker.delta_30d,
    SPI_DATE_SHORT: tracker.date_short,
    JONS_SCORE: tracker.jon_score,
    JONS_DELTA: tracker.jon_delta_label,
    JONS_DELTA_DIR: tracker.jon_delta_dir,
    SPI_COMPONENTS: renderComponents(issue, tools),
    TOP_BRIEFING_URL: topSource?.url || '#news-brief',
    TOP_BRIEFING_TITLE: topItem.title || 'No lead story selected',
    TOP_BRIEFING_SUMMARY: topItem.summary || 'No sourced lead story is available yet.',
    TOP_BRIEFING_WHY: topItem.why_it_matters || 'No curve read available.',
    TOP_SOURCE_CHIPS: renderTopSourceChips(topItem, tools),
    BRIEFING_READOUTS: renderBriefingReadouts(issue, tools),
    BODY_CLASSES: issue.layout === 'innermost-loop' ? 'condensed-pulse accelerando-pulse loop-pulse future-letter' : 'condensed-pulse accelerando-pulse future-letter',
    COMMAND_DECK_CONTENT: issue.layout === 'innermost-loop' ? renderLoopDispatch(issue, tools) : renderCommandDeck(issue, tools),
    FOUNDATION_LEDGER_CONTENT: renderReceiptsLedger(issue),
    SIGNAL_CONTROLS: renderSignalControls(),
    NEWS_BRIEF_CONTENT: renderNews(issue, tools),
    WHAT_CHANGED_CONTENT: issue.summary.what_changed,
    TRUST_POSTURE_CONTENT: issue.summary.trust_posture,
    FUTURES_CONSOLE_CONTENT: empty('Futures Console'),
    SOURCE_LEDGER_SUMMARY: `${tools.footnoteIds.length} cited footnotes · ${issue.sources.length} total source rows · ${issue.sources.filter((source) => source.verification_status === 'verified' || source.verification_status === 'rolling-state').length} verified/rolling · rendered from data/issues/${issue.issue_date}.json`,
    SOURCE_LEDGER_CONTENT: renderSourceLedger(issue),
    DISAGREEMENT_CONTENT: `<div class="dispute-grid"><div class="dispute-side claude"><div class="agent">Claude</div><p>${html(latestClaude?.text || 'No morning frame supplied.')}</p></div><div class="dispute-side codex"><div class="agent">Codex</div><p>${html(latestCodex?.text || 'No Codex frame supplied.')}</p></div></div>`,
    SCOREBOARD_CONTENT: renderScoreboard(issue, tools),
    BENCHMARK_SECTION_TITLE: issue.benchmark_panel?.section_title || (issue.layout === 'accelerando' ? 'Model Board' : 'Benchmark Observatory'),
    BENCHMARK_DASHBOARD_CONTENT: renderBenchmarkDashboard(issue, tools, registry),
    AI_2027_CONTENT: renderAi2027(issue, tools),
    FORECAST_RADAR_CONTENT: renderForecastRadar(issue, tools),
    MEDIA_DISCUSSION_CONTENT: renderMedia(issue, tools),
    NAMED_TAPE_CONTENT: renderNamedTape(issue),
    AGENT_CONVERSATION_CONTENT: renderConversation(issue),
    SOURCE_FOOTNOTES_CONTENT: renderFootnotes(issue, tools),
    HERO_IMAGE_BLOCK: '',
    TOP_SIGNAL_CONTENT: empty('Top Signal'),
    STACK_CONTENT: empty('Stack'),
    LEAKS_CONTENT: empty('Leaks & Rumors'),
    BENCH_WARS_CONTENT: empty('Benchmark Wars'),
    COUNTDOWNS_CONTENT: renderSingularityCountdowns(issue),
    PREDICTION_MARKET_CONTENT: renderOpenLedger(issue),
    PREDICTIONS_CONTENT: '',
    VOICES_CONTENT: empty('Voices'),
    VIDEOS_CONTENT: '',
    PAPERS_CONTENT: empty('Papers'),
    ROBOTICS_CONTENT: empty('Robotics'),
    ADJACENT_CONTENT: empty('Adjacent Frontier'),
    METERS_CONTENT: 'Data-first meters render from benchmark rows above.',
    HORIZON_CONTENT: 'Watch for benchmark rows that can be promoted from source-linked to live-primary.',
    WATCHING_CONTENT: 'Next issue should add one audited benchmark lane, not a synthetic composite.',
    DIALOGUE_FOOTER: renderConversation(issue),
    SOURCE_COUNT: issue.source_count,
    COMPILE_TIME: new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'America/New_York'
    }).format(new Date(issue.compiled_at))
  };

  let output = read('.config/html-template.html');
  for (const [key, value] of Object.entries(replacements)) {
    output = output.replaceAll(`{{${key}}}`, String(value ?? ''));
  }
  return output;
}

function provenanceFromIssue(issue) {
  return {
    issue_date: issue.issue_date,
    checked_at: issue.compiled_at,
    generated_from: `data/issues/${issue.issue_date}.json`,
    rendered_items: issue.sources.map((source) => ({
      section: source.section || 'source-footnotes',
      title: source.title,
      source_url: source.url,
      checked_at: source.fetched_at,
      freshness_badge: source.freshness,
      curve_dimensions: source.curve_dimensions || [],
      verification_status: source.verification_status,
      notes: source.note || ''
    }))
  };
}

function renderOne(date) {
  const issuePath = `data/issues/${date}.json`;
  const issue = readJson(issuePath);
  if (!issue) throw new Error(`Missing ${issuePath}`);
  const registry = readJson('data/trackers/benchmark-registry.json', { benchmarks: [] });
  const output = renderIssue(issue, registry);
  const htmlPath = `${date}.html`;
  const provenancePath = `.config/provenance/${date}.json`;

  if (checkOnly) {
    const current = existsSync(join(root, htmlPath)) ? read(htmlPath) : '';
    if (current !== output) throw new Error(`${htmlPath} is not in sync with ${issuePath}; run npm run render:issue -- ${date}`);
    const expectedProvenance = `${JSON.stringify(provenanceFromIssue(issue), null, 2)}\n`;
    const currentProvenance = existsSync(join(root, provenancePath)) ? read(provenancePath) : '';
    if (currentProvenance !== expectedProvenance) throw new Error(`${provenancePath} is not in sync with ${issuePath}; run npm run render:issue -- ${date}`);
    return;
  }

  write(htmlPath, output);
  write('today.html', output);
  write(provenancePath, `${JSON.stringify(provenanceFromIssue(issue), null, 2)}\n`);
}

try {
  const dates = dateArg ? [dateArg] : [latestIssueDate()];
  for (const date of dates) renderOne(date);
  console.log(`${checkOnly ? 'Checked' : 'Rendered'} ${dates.join(', ')}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
