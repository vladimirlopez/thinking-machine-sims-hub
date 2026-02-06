#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = __dirname;
const searchRoot = path.resolve(root, '..');
const outPath = path.join(root, 'simulations.json');

const ignoreDirs = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.venv',
  'venv',
  '.next',
  'out',
  '.cache',
]);

const includeNameHints = [
  'sim',
  'simulation',
  'physics',
  'projectile',
  'collision',
  'rocket',
  'ripple',
  'atwood',
  'electro',
  'hydrogen',
  'vector',
  'slope',
  'tangent',
  'sound',
  'action',
  'lab',
  'newton',
];

function walk(dir, acc) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) continue;
      walk(full, acc);
      continue;
    }

    if (!entry.isFile()) continue;
    const lower = entry.name.toLowerCase();
    if (!(lower.endsWith('.html') || lower.endsWith('.htm'))) continue;

    const relFromSearch = path.relative(searchRoot, full).replace(/\\/g, '/');
    const relLower = relFromSearch.toLowerCase();

    const hasHint = includeNameHints.some((hint) => relLower.includes(hint));
    if (!hasHint) continue;

    acc.push(full);
  }
}

function readTitle(htmlPath) {
  try {
    const content = fs.readFileSync(htmlPath, 'utf8');
    const m = content.match(/<title>([\s\S]*?)<\/title>/i);
    if (!m) return null;
    return m[1].replace(/\s+/g, ' ').trim();
  } catch {
    return null;
  }
}

function inferTopic(text) {
  const t = text.toLowerCase();
  if (/(projectile|kinematic)/.test(t)) return 'Kinematics';
  if (/(collision|atwood|rocket|newton|mechanic)/.test(t)) return 'Mechanics';
  if (/(electro|charge|electric)/.test(t)) return 'Electricity';
  if (/(ripple|wave|sound)/.test(t)) return 'Waves';
  if (/(hydrogen|atom|quantum|modern)/.test(t)) return 'Modern Physics';
  if (/(slope|tangent|calculus|vector|regression)/.test(t)) return 'Calculus';
  if (/(optic|snell|refraction|least action)/.test(t)) return 'Optics';
  if (/(fit|data)/.test(t)) return 'Data Analysis';
  return 'Physics';
}

function inferRepo(relFromSearch) {
  const parts = relFromSearch.split('/');
  if (parts[0] === 'Physics Simulations' && parts.length >= 2) {
    return `${parts[0]}/${parts[1]}`;
  }
  if (parts[0] === 'Types of Collisions' && parts.length >= 2) {
    return `${parts[0]}/${parts[1]}`;
  }
  return parts[0];
}

function labelFromPath(rel) {
  const base = path.basename(rel, path.extname(rel));
  if (base.toLowerCase() !== 'index') {
    return base.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
  const parent = path.basename(path.dirname(rel));
  return parent.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeTitle(raw, fallback) {
  if (!raw) return fallback;
  return raw
    .replace(/\s*[-|]\s*The Thinking Experiment\s*$/i, '')
    .replace(/\s*[-|]\s*Interactive.*$/i, '')
    .trim() || fallback;
}

function findGitRoot(startAbsPath) {
  let dir = path.dirname(startAbsPath);
  while (dir.startsWith(searchRoot)) {
    if (fs.existsSync(path.join(dir, '.git'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function parseGithubOrigin(origin) {
  if (!origin) return null;
  const cleaned = origin.trim();
  let m = cleaned.match(/^https?:\/\/github\.com\/([^/]+)\/([^/.]+)(?:\.git)?$/i);
  if (m) return { owner: m[1], repo: m[2] };
  m = cleaned.match(/^git@github\.com:([^/]+)\/([^/.]+)(?:\.git)?$/i);
  if (m) return { owner: m[1], repo: m[2] };
  return null;
}

function getRepoMeta(gitRoot, absPath) {
  if (!gitRoot) return { repoUrl: null, webUrl: null };

  let origin = null;
  try {
    origin = cp.execSync('git remote get-url origin', {
      cwd: gitRoot,
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    }).trim();
  } catch {
    return { repoUrl: null, webUrl: null };
  }

  const gh = parseGithubOrigin(origin);
  if (!gh) return { repoUrl: origin || null, webUrl: null };

  const repoUrl = `https://github.com/${gh.owner}/${gh.repo}`;
  const relInRepo = path.relative(gitRoot, absPath).replace(/\\/g, '/');
  const pagesBase =
    gh.repo.toLowerCase() === `${gh.owner.toLowerCase()}.github.io`
      ? `https://${gh.owner}.github.io`
      : `https://${gh.owner}.github.io/${gh.repo}`;

  return {
    repoUrl,
    webUrl: `${pagesBase}/${relInRepo}`,
  };
}

function toHubRelative(absPath) {
  const rel = path.relative(root, absPath).replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

function buildRecord(absPath) {
  const relFromSearch = path.relative(searchRoot, absPath).replace(/\\/g, '/');
  const fallbackTitle = labelFromPath(relFromSearch);
  const title = normalizeTitle(readTitle(absPath), fallbackTitle);
  const topic = inferTopic(`${title} ${relFromSearch}`);
  const repo = inferRepo(relFromSearch);
  const gitRoot = findGitRoot(absPath);
  const repoMeta = getRepoMeta(gitRoot, absPath);
  let webUrl = repoMeta.webUrl;

  // Known-broken Pages target; prefer repo fallback for this repo.
  if (repo === 'Ripple Tank Sim') {
    webUrl = null;
  }

  return {
    title,
    topic,
    description: `Launch ${title}.`,
    repo,
    localUrl: toHubRelative(absPath),
    webUrl,
    repoUrl: repoMeta.repoUrl,
  };
}

function shouldKeep(record) {
  const p = record.localUrl.toLowerCase();
  const title = record.title.toLowerCase();
  const name = path.basename(p);

  if (!['index.html', 'app.html', 'collision_simulation.html'].includes(name)) return false;
  if (p.includes('/old projects/')) return false;
  if (p.includes('/old/')) return false;
  if (p.includes('/templates/')) return false;
  if (p.includes('/flask-template/')) return false;
  if (p.includes('/personalassistant/')) return false;
  if (p.includes('/teacherassistant/roadmap_tmp.html')) return false;
  if (p === './index.html') return false;
  if (record.repo === 'Thinking Machine Sims') return false;
  if (p.includes('/physics support apps/')) return false;
  if (p.includes('/embedded.html')) return false;
  if (p.includes('/demo.html')) return false;
  if (p.includes('/test-')) return false;
  if (title.includes('redirecting')) return false;
  if (title.includes('chess-platform')) return false;
  return true;
}

const files = [];
walk(searchRoot, files);

const mapped = files.map(buildRecord).filter(shouldKeep);

const uniqueByUrl = new Map();
for (const item of mapped) uniqueByUrl.set(item.localUrl, item);

const items = Array.from(uniqueByUrl.values()).sort((a, b) => a.title.localeCompare(b.title));

fs.writeFileSync(outPath, JSON.stringify(items, null, 2) + '\n');
console.log(`Wrote ${items.length} simulations to ${outPath}`);
