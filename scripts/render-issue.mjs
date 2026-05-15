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
  requireSourceIds('tracker.sp_index.components', issue.tracker?.sp_index?.components);
  requireSourceIds('benchmark_panel.metrics', issue.benchmark_panel?.metrics);
  if (!Array.isArray(issue.benchmark_panel?.source_ids) || !issue.benchmark_panel.source_ids.length) {
    errors.push('benchmark_panel missing source_ids');
  } else {
    for (const sourceId of issue.benchmark_panel.source_ids) {
      if (!sourceIds.has(sourceId)) errors.push(`benchmark_panel references missing source ${sourceId}`);
    }
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
  addFootnotes(issue.benchmark_panel?.source_ids);
  for (const metric of issue.benchmark_panel?.metrics || []) addFootnotes(metric.source_ids);
  for (const item of issue.ai_2027 || []) addFootnotes(item.source_ids);
  for (const item of issue.media || []) addFootnotes(item.source_ids);
  for (const source of issue.sources || []) addFootnotes([source.id]);

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

function renderNews(issue, tools) {
  const cards = (issue.news || []).slice(1);
  return (cards.length ? cards : issue.news || [])
    .map((item) => {
      const firstSource = item.source_ids?.[0];
      const source = firstSource ? tools.sourceMap.get(firstSource) : null;
      const title = source ? `<a href="${attr(source.url)}">${html(item.title)}</a>` : html(item.title);
      return `<article class="brief-card compact story-card">
  <div class="compact-k"><span class="impact ${impactClass(item.impact)}">${html(item.impact || 'low')}</span>${html(item.lane)} <span class="ago">${html(item.freshness)}</span></div>
  <h3>${title} ${tools.cites(item.source_ids)}</h3>
  <p>${html(item.summary)}</p>
  <p class="why"><strong>Why it matters:</strong> ${html(item.why_it_matters)}</p>
</article>`;
    })
    .join('\n');
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

function renderMetrChart(series) {
  const width = 860;
  const height = 320;
  const left = 74;
  const right = 32;
  const top = 24;
  const bottom = 52;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const dates = series.map((point) => new Date(`${point.date}T00:00:00Z`).getTime());
  const minTime = Math.min(...dates);
  const maxTime = Math.max(...dates);
  const values = series.flatMap((point) => [point.p50_minutes, point.p80_minutes]);
  const minLog = Math.floor(Math.log10(Math.min(...values)));
  const maxLog = Math.ceil(Math.log10(Math.max(...values)));
  const p50 = series.map((point) => ({ ...point, x: dateToX(point.date, minTime, maxTime, left, chartWidth), y: logY(point.p50_minutes, minLog, maxLog, top, chartHeight) }));
  const p80 = series.map((point) => ({ ...point, x: dateToX(point.date, minTime, maxTime, left, chartWidth), y: logY(point.p80_minutes, minLog, maxLog, top, chartHeight) }));
  const ticks = [1, 10, 60, 180, 720, 1440].filter((tick) => Math.log10(tick) >= minLog && Math.log10(tick) <= maxLog);
  const last = p50.at(-1);
  const lastP80 = p80.at(-1);
  const yearTicks = ['2023-01-01', '2024-01-01', '2025-01-01', '2026-01-01'];

  return `<div class="metr-lab tracker-chart">
  <div class="chart-deck-head">
    <div><p class="chart-eyebrow">METR Time Horizon 1.1 · log scale</p><h3>How long can frontier agents work?</h3></div>
    <div class="chart-legend"><span class="legend-p50">p50 success</span><span class="legend-p80">p80 success</span></div>
  </div>
  <!-- chart by codex at implementation time — rendered from data/issues/2026-05-14.json -->
  <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="METR Time Horizon p50 and p80 values plotted from raw YAML">
    ${ticks.map((tick) => {
      const y = logY(tick, minLog, maxLog, top, chartHeight);
      const label = tick >= 60 ? `${Number((tick / 60).toFixed(1))}h` : `${tick}m`;
      return `<line class="metr-grid" x1="${left}" x2="${width - right}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" /><text class="metr-axis" x="8" y="${(y + 4).toFixed(1)}">${label}</text>`;
    }).join('\n    ')}
    ${yearTicks.map((date) => {
      const x = dateToX(date, minTime, maxTime, left, chartWidth);
      if (x < left || x > width - right) return '';
      return `<line class="metr-grid vertical" x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${top}" y2="${top + chartHeight}" /><text class="metr-axis" x="${(x - 12).toFixed(1)}" y="${height - 18}">${date.slice(0, 4)}</text>`;
    }).filter(Boolean).join('\n    ')}
    <path class="metr-line" d="${linePath(p50)}" />
    <path class="metr-line p80-line" d="${linePath(p80)}" />
    ${p50.map((point) => `<circle class="metr-dot" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${point === last ? 5 : 3}"><title>${html(point.model)} p50 ${point.p50_minutes.toFixed(2)} min</title></circle>`).join('\n    ')}
    ${p80.map((point) => `<circle class="metr-dot p80-dot" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${point === lastP80 ? 4 : 2.5}"><title>${html(point.model)} p80 ${point.p80_minutes.toFixed(2)} min</title></circle>`).join('\n    ')}
    <text class="bc-value-label" x="${Math.max(left + 8, last.x - 170).toFixed(1)}" y="${(last.y - 12).toFixed(1)}">${html(last.model)} · ${(last.p50_minutes / 60).toFixed(2)}h p50</text>
  </svg>
  <p class="metr-caption"><strong>What to see:</strong> the leading p50 point crosses a workday, but METR’s own doubling-time fit excludes central estimates above 16h. Treat this as pressure on the autonomy ceiling, not as a clean forecast.</p>
</div>`;
}

function renderBenchmarkDashboard(issue, tools, registry) {
  const panel = issue.benchmark_panel || {};
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
<div class="bench-grid">${cards}</div>
${renderMetrChart(panel.series || [])}
<details class="benchmark-detail" open>
  <summary>Tracked benchmark lanes</summary>
  <table class="benchmark-table source-backed">
    <thead><tr><th>Benchmark</th><th>Lane</th><th>Status</th><th>Render rule</th></tr></thead>
    <tbody>${sourceRows}</tbody>
  </table>
</details>`;
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
      return `<article class="media-card">
  <div class="compact-k">${html(item.platform)} <span class="ago">${html(item.freshness)}</span> ${tools.cites(item.source_ids)}</div>
  <h3>${title}</h3>
  <p>${html(item.summary)}</p>
</article>`;
    })
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
      const note = String(source.note || source.type || '').replace(/[.。]\s*$/, '');
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
    NEWS_BRIEF_CONTENT: renderNews(issue, tools),
    WHAT_CHANGED_CONTENT: issue.summary.what_changed,
    TRUST_POSTURE_CONTENT: issue.summary.trust_posture,
    FUTURES_CONSOLE_CONTENT: empty('Futures Console'),
    SOURCE_LEDGER_SUMMARY: `${issue.sources.length} source rows · ${issue.sources.filter((source) => source.verification_status === 'verified' || source.verification_status === 'rolling-state').length} verified/rolling · rendered from data/issues/${issue.issue_date}.json`,
    SOURCE_LEDGER_CONTENT: renderSourceLedger(issue),
    DISAGREEMENT_CONTENT: `<div class="dispute-grid"><div class="dispute-side claude"><div class="agent">Claude</div><p>${html(issue.conversation?.[0]?.text || 'No morning frame supplied.')}</p></div><div class="dispute-side codex"><div class="agent">Codex</div><p>${html(issue.conversation?.[1]?.text || 'No Codex frame supplied.')}</p></div></div>`,
    SCOREBOARD_CONTENT: renderScoreboard(issue, tools),
    BENCHMARK_DASHBOARD_CONTENT: renderBenchmarkDashboard(issue, tools, registry),
    AI_2027_CONTENT: renderAi2027(issue, tools),
    MEDIA_DISCUSSION_CONTENT: renderMedia(issue, tools),
    AGENT_CONVERSATION_CONTENT: renderConversation(issue),
    SOURCE_FOOTNOTES_CONTENT: renderFootnotes(issue, tools),
    HERO_IMAGE_BLOCK: '',
    TOP_SIGNAL_CONTENT: empty('Top Signal'),
    STACK_CONTENT: empty('Stack'),
    LEAKS_CONTENT: empty('Leaks & Rumors'),
    BENCH_WARS_CONTENT: empty('Benchmark Wars'),
    COUNTDOWNS_CONTENT: empty('Countdowns'),
    PREDICTION_MARKET_CONTENT: '<p class="empty-section">Prediction ledger unchanged in this foundation rebuild.</p>',
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
