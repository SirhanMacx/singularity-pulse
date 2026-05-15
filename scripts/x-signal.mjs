#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const configPath = join(homedir(), '.agent-reach', 'config.yaml');

function usage() {
  return `Usage:
  node scripts/x-signal.mjs "Figure F.03 robot" "OpenAI Codex" -n 5
  node scripts/x-signal.mjs --sources --rumors --since-hours 24 -n 2

Options:
  -n, --count N        Results per query, default 5
  --since-hours N      Drop posts older than N hours, default 24
  --sources            Search from handles in .config/sources.yml > twitter
  --rumors             Search from handles in .config/sources.yml > twitter_rumor_accounts
  --jsonl              Print one result per line instead of one JSON object
`;
}

function readLocalTwitterConfig() {
  if (!existsSync(configPath)) return null;
  const text = readFileSync(configPath, 'utf8');
  const authMatch = text.match(/^twitter_auth_token:\s*(.+)$/m);
  const ct0Match = text.match(/^twitter_ct0:\s*(.+)$/m);
  const authToken = authMatch?.[1]?.trim();
  const ct0 = ct0Match?.[1]?.trim();
  if (!authToken || !ct0) return null;
  return { authToken, ct0 };
}

function parseArgs(argv) {
  const out = { count: 5, sinceHours: 24, sources: false, rumors: false, jsonl: false, queries: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '-n' || arg === '--count') {
      out.count = Number(argv[++index]);
    } else if (arg === '--since-hours') {
      out.sinceHours = Number(argv[++index]);
    } else if (arg === '--sources') {
      out.sources = true;
    } else if (arg === '--rumors') {
      out.rumors = true;
    } else if (arg === '--jsonl') {
      out.jsonl = true;
    } else if (arg === '-h' || arg === '--help') {
      console.log(usage());
      process.exit(0);
    } else {
      out.queries.push(arg);
    }
  }
  if (!Number.isFinite(out.count) || out.count < 1) out.count = 5;
  if (!Number.isFinite(out.sinceHours) || out.sinceHours < 1) out.sinceHours = 24;
  return out;
}

function readHandles(sectionName) {
  const sourcePath = join(root, '.config', 'sources.yml');
  if (!existsSync(sourcePath)) return [];
  const lines = readFileSync(sourcePath, 'utf8').split('\n');
  const handles = [];
  let inSection = false;
  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+#.*$/, '').trimEnd();
    if (/^[a-zA-Z0-9_]+:\s*$/.test(line) && !line.startsWith('  ')) {
      inSection = line.replace(':', '').trim() === sectionName;
      continue;
    }
    if (!inSection) continue;
    const match = line.trim().match(/^-\s+([A-Za-z0-9_]+)\s*$/);
    if (match) handles.push(match[1]);
  }
  return [...new Set(handles)];
}

function findBird() {
  const result = spawnSync('zsh', ['-lc', 'command -v bird || command -v birdx'], { encoding: 'utf8' });
  return result.stdout.trim().split('\n')[0];
}

function postUrl(result) {
  const username = result.author?.username;
  return username && result.id ? `https://x.com/${username}/status/${result.id}` : null;
}

function normalize(result, query, now) {
  const createdAt = result.createdAt ? new Date(result.createdAt) : null;
  const ageHours = createdAt && Number.isFinite(createdAt.getTime())
    ? Math.max(0, (now.getTime() - createdAt.getTime()) / 36e5)
    : null;
  return {
    platform: 'x',
    query,
    id: result.id,
    url: postUrl(result),
    created_at: createdAt?.toISOString() || result.createdAt || null,
    age_hours: ageHours === null ? null : Number(ageHours.toFixed(2)),
    author: result.author ? {
      username: result.author.username,
      name: result.author.name
    } : null,
    text: result.text,
    metrics: {
      replies: result.replyCount ?? null,
      reposts: result.retweetCount ?? null,
      likes: result.likeCount ?? null
    }
  };
}

function runQuery(bird, query, count, env) {
  const result = spawnSync(bird, ['search', query, '-n', String(count), '--json'], {
    encoding: 'utf8',
    env,
    timeout: 25_000
  });
  if (result.status !== 0) {
    return { query, results: [], error: (result.stderr || result.stdout || `bird exited ${result.status}`).trim() };
  }
  try {
    return { query, results: JSON.parse(result.stdout || '[]'), error: null };
  } catch (error) {
    return { query, results: [], error: `could not parse bird JSON: ${error.message}` };
  }
}

const options = parseArgs(process.argv.slice(2));
if (options.sources) options.queries.push(...readHandles('twitter').map((handle) => `from:${handle}`));
if (options.rumors) options.queries.push(...readHandles('twitter_rumor_accounts').map((handle) => `from:${handle}`));
options.queries = [...new Set(options.queries)];

if (!options.queries.length) {
  console.error(usage());
  process.exit(2);
}

const twitterConfig = readLocalTwitterConfig();
if (!twitterConfig) {
  console.error('Missing local X cookies. Run: agent-reach configure --from-browser chrome');
  process.exit(2);
}

const bird = findBird();
if (!bird) {
  console.error('Missing bird CLI. Run: agent-reach install --env=auto');
  process.exit(2);
}

const now = new Date();
const env = {
  ...process.env,
  AUTH_TOKEN: twitterConfig.authToken,
  CT0: twitterConfig.ct0,
  NO_COLOR: '1'
};
const seen = new Set();
const results = [];
const errors = [];

for (const query of options.queries) {
  const response = runQuery(bird, query, options.count, env);
  if (response.error) errors.push({ query, error: response.error });
  for (const rawResult of response.results) {
    const item = normalize(rawResult, query, now);
    if (!item.id || seen.has(item.id)) continue;
    if (item.age_hours !== null && item.age_hours > options.sinceHours) continue;
    seen.add(item.id);
    results.push(item);
  }
}

const output = {
  generated_at: now.toISOString(),
  source: 'bird search via local Agent Reach X cookies',
  since_hours: options.sinceHours,
  query_count: options.queries.length,
  result_count: results.length,
  results,
  errors
};

if (options.jsonl) {
  for (const result of results) console.log(JSON.stringify(result));
} else {
  console.log(JSON.stringify(output, null, 2));
}
