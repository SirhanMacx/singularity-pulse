#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const root = process.cwd();
const checkLinks = process.argv.includes('--links');
const errors = [];
const warnings = [];

const OUTBOUND_TOPIC_RE = /singularity-pulse-jon-(?!X{6,}\b)[a-z0-9]+/i;
const PLACEHOLDER_RE = /\{\{[A-Z0-9_]+\}\}/g;
const ISSUE_RE = /^\d{4}-\d{2}-\d{2}\.html$/;
const ISSUE_DATA_RE = /^\d{4}-\d{2}-\d{2}\.json$/;
const VALID_STATUSES = new Set(['verified', 'estimated', 'synthetic', 'reader-feedback', 'rolling-state']);

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function add(kind, file, message) {
  const line = `${file}: ${message}`;
  if (kind === 'error') errors.push(line);
  else warnings.push(line);
}

function extractLinks(html) {
  const out = [];
  for (const match of html.matchAll(/<(a|img|iframe)\b[^>]*(?:href|src)=["']([^"']+)["']/gi)) {
    const url = match[2];
    if (/^https?:\/\//i.test(url)) out.push(url);
  }
  return [...new Set(out)];
}

function section(html, id) {
  const start = html.indexOf(`id="${id}"`);
  if (start === -1) return '';
  const next = html.indexOf('<section ', start + 1);
  return html.slice(start, next === -1 ? html.length : next);
}

function count(re, text) {
  return [...text.matchAll(re)].length;
}

function readJson(path) {
  return JSON.parse(read(path));
}

function validateIssueData(file) {
  const path = `data/issues/${file}`;
  let issue;
  try {
    issue = readJson(path);
  } catch (err) {
    add('error', path, `invalid JSON: ${err.message}`);
    return;
  }

  const date = basename(file, '.json');
  const sourceIds = new Set((issue.sources || []).map((source) => source.id));
  if (issue.issue_date !== date) add('error', path, 'issue_date does not match filename');
  if (issue.schema_version !== 1) add('error', path, 'schema_version must be 1');
  if (!Array.isArray(issue.sources) || issue.sources.length < 6) add('error', path, 'sources must include at least 6 rows');

  for (const [i, source] of (issue.sources || []).entries()) {
    for (const field of ['id', 'title', 'publisher', 'url', 'fetched_at', 'freshness', 'verification_status']) {
      if (!source[field]) add('error', path, `sources[${i}] missing ${field}`);
    }
    if (source.id && !/^[a-z0-9-]+$/.test(source.id)) add('error', path, `sources[${i}] id must be kebab-case`);
    if (source.url && !/^(https?:\/\/|\.\/)/.test(source.url)) add('error', path, `sources[${i}] url must be http(s) or local ./ path`);
    if (source.verification_status && !VALID_STATUSES.has(source.verification_status)) {
      add('error', path, `sources[${i}] invalid verification_status`);
    }
    if (source.verification_status === 'synthetic' && !/synthetic|illustrative|generated/i.test(`${source.note || ''} ${source.type || ''}`)) {
      add('error', path, `sources[${i}] synthetic row must be explicitly labeled in note/type`);
    }
  }

  function checkItems(label, items) {
    for (const [i, item] of (items || []).entries()) {
      if (!Array.isArray(item.source_ids) || !item.source_ids.length) {
        add('error', path, `${label}[${i}] missing source_ids`);
        continue;
      }
      for (const sourceId of item.source_ids) {
        if (!sourceIds.has(sourceId)) add('error', path, `${label}[${i}] references missing source ${sourceId}`);
      }
    }
  }

  checkItems('news', issue.news);
  checkItems('media', issue.media);
  checkItems('ai_2027', issue.ai_2027);
  checkItems('forecast_radar', issue.forecast_radar);
  checkItems('benchmark_panel.metrics', issue.benchmark_panel?.metrics);
  checkItems('benchmark_panel.matrix', issue.benchmark_panel?.matrix);
  checkItems('tracker.sp_index.components', issue.tracker?.sp_index?.components);

  if (!Array.isArray(issue.benchmark_panel?.source_ids) || issue.benchmark_panel.source_ids.length < 2) {
    add('error', path, 'benchmark_panel must cite at least 2 source_ids');
  } else {
    for (const sourceId of issue.benchmark_panel.source_ids) {
      if (!sourceIds.has(sourceId)) add('error', path, `benchmark_panel references missing source ${sourceId}`);
    }
  }

  const htmlPath = `${date}.html`;
  if (existsSync(join(root, htmlPath))) {
    const html = read(htmlPath);
    if (!html.includes(`data/issues/${date}.json`) && date === files.at(-1)?.replace('.html', '')) {
      add('error', htmlPath, `latest issue does not visibly declare data/issues/${date}.json`);
    }
  }
}

const files = readdirSync(root).filter((f) => ISSUE_RE.test(f)).sort();
if (!files.length) errors.push('repo: no YYYY-MM-DD.html issue files found');

const issueDataFiles = existsSync(join(root, 'data/issues'))
  ? readdirSync(join(root, 'data/issues')).filter((f) => ISSUE_DATA_RE.test(f)).sort()
  : [];

if (files.length && !issueDataFiles.includes(files.at(-1).replace('.html', '.json'))) {
  add('error', 'data/issues', `latest issue ${files.at(-1)} has no data-first source JSON`);
}

for (const file of issueDataFiles) validateIssueData(file);

for (const file of [...files, 'today.html', 'archive.html', 'dialogue.html', 'index.html']) {
  if (!existsSync(join(root, file))) continue;
  const html = read(file);
  const placeholders = html.match(PLACEHOLDER_RE) || [];
  if (placeholders.length) add('error', file, `unresolved placeholders: ${[...new Set(placeholders)].join(', ')}`);
  if (OUTBOUND_TOPIC_RE.test(html)) add('error', file, 'outbound ntfy topic leaked into public HTML');
}

for (const file of files) {
  const html = read(file);
  const isDryRun = /\bdry-run\b|v8 baseline/i.test(html);
  const date = basename(file, '.html');
  const provenancePath = `.config/provenance/${date}.json`;
  const provExists = existsSync(join(root, provenancePath));

  if (!provExists) {
    add(isDryRun ? 'warning' : 'error', file, `missing provenance ledger ${provenancePath}`);
  } else {
    try {
      const provenance = JSON.parse(read(provenancePath));
      if (provenance.issue_date !== date) add('error', provenancePath, 'issue_date does not match filename');
      if (!Array.isArray(provenance.rendered_items)) add('error', provenancePath, 'rendered_items must be an array');
      for (const [i, item] of (provenance.rendered_items || []).entries()) {
        if (!item.title || !item.section) add('error', provenancePath, `rendered_items[${i}] missing title or section`);
        if (!item.source_url) add('error', provenancePath, `rendered_items[${i}] missing source_url`);
        if (!['verified', 'estimated', 'synthetic', 'reader-feedback', 'rolling-state'].includes(item.verification_status)) {
          add('error', provenancePath, `rendered_items[${i}] has invalid verification_status`);
        }
        if (!item.checked_at) add('error', provenancePath, `rendered_items[${i}] missing checked_at`);
      }
    } catch (err) {
      add('error', provenancePath, `invalid JSON: ${err.message}`);
    }
  }

  for (const id of ['top-signal', 'stack', 'leaks', 'papers', 'robotics', 'adjacent']) {
    const block = section(html, id);
    if (!block || /empty-section/.test(block)) continue;
    if (!/class=["'][^"']*\bimpact\b/.test(block)) add('error', file, `section #${id} has rendered content without a curve-impact badge`);
    if (!/class=["'][^"']*\bago\b/.test(block)) add('error', file, `section #${id} has rendered content without a recency badge`);
  }

  if (!/class=["'][^"']*\bsource-ledger\b/.test(html)) {
    add(isDryRun ? 'warning' : 'error', file, 'missing visible source/provenance ledger block');
  }
  if (!/class=["'][^"']*\bprediction-market\b/.test(html)) {
    add(isDryRun ? 'warning' : 'error', file, 'missing prediction market block');
  }
  if (!/class=["'][^"']*\beditorial-disagreement\b/.test(html)) {
    add(isDryRun ? 'warning' : 'error', file, 'missing editorial disagreement block');
  }
}

if (existsSync(join(root, 'today.html')) && files.length) {
  const latest = files[files.length - 1];
  if (read('today.html') !== read(latest)) add('error', 'today.html', `does not match latest issue ${latest}`);
}

for (const file of ['README.md', 'CODEX-SETUP.md', 'VISION.md', '.config/orchestrator-prompt.md', '.config/orchestrator-afternoon.md']) {
  if (!existsSync(join(root, file))) continue;
  const text = read(file);
  if (OUTBOUND_TOPIC_RE.test(text)) add('error', file, 'outbound ntfy topic leaked into public docs');
}

if (checkLinks) {
  const urls = new Set();
  for (const file of [...files, 'today.html', 'archive.html', 'dialogue.html']) {
    if (!existsSync(join(root, file))) continue;
    for (const url of extractLinks(read(file))) urls.add(url);
  }
  for (const url of urls) {
    try {
      let res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      if (res.status === 405) res = await fetch(url, { method: 'GET', redirect: 'follow' });
      if (res.status >= 400 && res.status !== 429) add('warning', 'links', `${res.status} ${url}`);
    } catch (err) {
      add('warning', 'links', `${url} failed: ${err.message}`);
    }
  }
}

if (warnings.length) {
  console.log('Warnings:');
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error('Errors:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Quality gate passed (${files.length} issue file${files.length === 1 ? '' : 's'} checked).`);
