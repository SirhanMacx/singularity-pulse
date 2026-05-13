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

const files = readdirSync(root).filter((f) => ISSUE_RE.test(f)).sort();
if (!files.length) errors.push('repo: no YYYY-MM-DD.html issue files found');

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
