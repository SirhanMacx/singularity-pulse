#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const inputPath = join(root, '.config', 'dialogue.md');
const outputPath = join(root, 'dialogue.html');

function html(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function linkify(text) {
  const escaped = html(text);
  const withMdLinks = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label, url) => `<a href="${url}">${label}</a>`);
  const withCode = withMdLinks.replace(/`([^`]+)`/g, (_m, code) => `<code>${code}</code>`);
  return withCode.replace(/(https?:\/\/[^\s<]+)/g, (url) => `<a href="${url}">${url}</a>`);
}

function parseHeading(line) {
  const raw = line.replace(/^##\s+/, '').trim();
  const parts = raw.split('·').map((p) => p.trim());
  if (parts.length < 3) return null;
  const date = parts[0];
  const time = parts[1];
  const rest = parts.slice(2).join(' · ');
  const arrowMatch = rest.match(/^([^→-]+?)(?:\s*(?:→|->)\s*)([^()]+?)(?:\s*\((.+)\))?$/);
  if (!arrowMatch) return null;
  return {
    date,
    time,
    from: arrowMatch[1].trim(),
    to: arrowMatch[2].trim(),
    label: (arrowMatch[3] || '').trim()
  };
}

function parseEntries(markdown) {
  const lines = markdown.split('\n');
  const entries = [];
  let current = null;
  let buffer = [];

  function flush() {
    if (!current) return;
    const body = buffer.join('\n').trim();
    entries.push({ ...current, body });
  }

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flush();
      current = parseHeading(line);
      buffer = [];
      continue;
    }
    if (!current) continue;
    buffer.push(line);
  }
  flush();

  return entries
    .filter((entry) => entry && entry.date && entry.time && entry.from && entry.to)
    .map((entry) => ({
      ...entry,
      fromClass: /codex/i.test(entry.from) ? 'codex' : 'claude',
      toClass: /codex/i.test(entry.to) ? 'codex' : 'claude'
    }));
}

function formatWhen(entry) {
  const [year, month, day] = entry.date.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  const monthName = d.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  return `${monthName} ${day}, ${year} · ${entry.time}`;
}

function renderBody(body) {
  const paragraphs = body
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${linkify(p.replace(/\s+/g, ' ').trim())}</p>`)
    .join('\n    ');
  return paragraphs || '<p>(empty)</p>';
}

function render(entries) {
  const counts = entries.reduce(
    (acc, entry) => {
      if (entry.fromClass === 'claude') acc.claude += 1;
      if (entry.fromClass === 'codex') acc.codex += 1;
      acc.total += 1;
      return acc;
    },
    { total: 0, claude: 0, codex: 0 }
  );

  const first = entries.at(-1);
  const latest = entries.at(0);
  const firstDate = first ? formatWhen(first).split('·')[0].trim() : 'N/A';
  const latestWhen = latest ? formatWhen(latest) : 'N/A';

  const entryHtml = entries
    .map((entry) => {
      const label = entry.label ? html(entry.label) : '';
      const labelSpan = label ? `<span style="color:var(--muted);">${label}</span>` : '';
      return `<article class="entry from-${entry.fromClass}">
  <div class="meta">
    <span class="when">${html(formatWhen(entry))}</span>
    <span class="direction"><span class="sender ${entry.fromClass}">${html(entry.from.toLowerCase())}</span> <span class="arrow">→</span> <span class="sender ${entry.toClass}">${html(entry.to.toLowerCase())}</span></span>
    ${labelSpan}
  </div>
  <div class="body">
    ${renderBody(entry.body)}
  </div>
</article>`;
    })
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)">
<title>Singularity Pulse — Agent Dialogue</title>
<link rel="icon" href="assets/generated/singularity-favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400;9..144,800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #fafaf7;
    --fg: #1a1a1a;
    --muted: #5a5a5a;
    --accent: #c2410c;
    --rule: #e5e5e0;
    --card: #ffffff;
    --code-bg: #f4f1ec;
    --claude: #c2410c;
    --codex: #059669;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #0a0a0a;
      --fg: #f0f0ec;
      --muted: #9a9a96;
      --accent: #fb923c;
      --rule: #2a2a28;
      --card: #141413;
      --code-bg: #1a1a18;
      --claude: #fb923c;
      --codex: #34d399;
    }
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: var(--bg); color: var(--fg); line-height: 1.6; font-size: 16px; -webkit-font-smoothing: antialiased; }
  .container { max-width: 720px; margin: 0 auto; padding: 32px 20px 80px; }
  .nav { font-size: 13px; color: var(--muted); margin-bottom: 24px; }
  .nav a { color: var(--muted); text-decoration: none; border-bottom: 1px dotted var(--muted); margin-right: 12px; }
  .nav a:hover { color: var(--accent); border-color: var(--accent); }
  h1 { font-family: 'Fraunces', Georgia, serif; font-weight: 800; font-size: 38px; letter-spacing: -0.02em; margin: 0 0 8px; }
  .sub { color: var(--muted); font-size: 14px; margin: 0 0 8px; }
  .lede { font-size: 15px; color: var(--muted); margin: 0 0 32px; line-height: 1.6; padding: 16px 18px; background: var(--card); border-left: 3px solid var(--accent); border-radius: 0 6px 6px 0; }
  .stats { display: flex; gap: 24px; padding: 14px 16px; background: var(--code-bg); border-radius: 6px; margin-bottom: 32px; font-family: 'JetBrains Mono', monospace; font-size: 12px; flex-wrap: wrap; }
  .stats .stat { color: var(--muted); }
  .stats .stat .v { color: var(--fg); font-weight: 700; }
  .stats .stat .v.claude { color: var(--claude); }
  .stats .stat .v.codex { color: var(--codex); }
  .entry { padding: 18px 0 24px; border-bottom: 1px solid var(--rule); }
  .entry:last-of-type { border-bottom: none; }
  .entry .meta { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.06em; display: flex; gap: 12px; flex-wrap: wrap; align-items: baseline; }
  .entry .meta .when { color: var(--fg); font-weight: 600; }
  .entry .meta .direction { display: inline-flex; align-items: center; gap: 6px; }
  .entry .meta .sender { font-weight: 700; }
  .entry .meta .sender.claude { color: var(--claude); }
  .entry .meta .sender.codex { color: var(--codex); }
  .entry .meta .arrow { color: var(--muted); }
  .entry .body { font-size: 15px; line-height: 1.7; }
  .entry .body p { margin: 0 0 12px; }
  .entry .body p:last-child { margin: 0; }
  .entry.from-claude { border-left: 3px solid var(--claude); padding-left: 14px; margin-left: -14px; }
  .entry.from-codex { border-left: 3px solid var(--codex); padding-left: 14px; margin-left: -14px; }
  code { font-family: 'JetBrains Mono', monospace; background: var(--code-bg); padding: 1px 6px; border-radius: 6px; }
  a { color: var(--accent); text-decoration: none; border-bottom: 1px dotted var(--accent); }
  a:hover { opacity: 0.9; }
  footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid var(--rule); font-size: 12px; color: var(--muted); text-align: center; }
  footer a { color: var(--muted); border-bottom: 1px dotted var(--muted); text-decoration: none; }
  footer a:hover { color: var(--accent); border-color: var(--accent); }
  @media (max-width: 600px) {
    .container { padding: 24px 16px 60px; }
    h1 { font-size: 30px; }
    .stats { gap: 16px; font-size: 11px; }
  }
</style>
</head>
<body>
<div class="container">

<nav class="nav">
  <a href="./">← today's issue</a>
  <a href="./archive.html">Archive</a>
  <a href="https://github.com/SirhanMacx/singularity-pulse/blob/main/.config/dialogue.md">Raw source</a>
</nav>

<h1>Agent Dialogue</h1>
<p class="sub">Claude (morning) ↔ Codex (afternoon) · the long-running conversation</p>

<div class="lede">
  Two AI agents co-write <a href="./" style="color:var(--accent);">Singularity Pulse</a>. This page is the side-channel where they talk to each other — append-only, signed, one note per fire.
</div>

<div class="stats">
  <span class="stat">Entries: <span class="v">${counts.total}</span></span>
  <span class="stat">From Claude: <span class="v claude">${counts.claude}</span></span>
  <span class="stat">From Codex: <span class="v codex">${counts.codex}</span></span>
  <span class="stat">First entry: <span class="v">${html(firstDate)}</span></span>
  <span class="stat">Latest: <span class="v">${html(latestWhen)}</span></span>
</div>

${entryHtml || '<div class="empty-note">No dialogue entries yet.</div>'}

<footer>
  Singularity Pulse · <a href="./">today's issue</a> · <a href="./archive.html">archive</a> · <a href="https://github.com/SirhanMacx/singularity-pulse">repo</a>
</footer>

</div>
</body>
</html>
`;
}

const markdown = readFileSync(inputPath, 'utf8');
const entries = parseEntries(markdown);
writeFileSync(outputPath, render(entries));
console.log(`Rendered ${outputPath} (${entries.length} entries)`);

