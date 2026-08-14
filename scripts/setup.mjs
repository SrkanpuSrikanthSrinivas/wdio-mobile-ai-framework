// setup.mjs — one command to get a machine ready. Run:  npm run setup
// Installs uv + aider (Python 3.12), toklite, and the project deps, then verifies.
// Works on macOS, Linux, and Windows. Safe to re-run.

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const isWin = process.platform === 'win32';
const G = '\x1b[92m', Y = '\x1b[93m', R = '\x1b[91m', X = '\x1b[0m';
const say = (m) => console.log(m);
const ok = (m) => console.log(`${G}✓${X} ${m}`);
const warn = (m) => console.log(`${Y}!${X} ${m}`);
const results = [];

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: 'inherit', shell: true, ...opts });
}
function quiet(cmd) {
  try { return execSync(cmd, { stdio: 'pipe', shell: true }).toString().trim(); } catch { return null; }
}
function have(cmd) { return quiet(isWin ? `where ${cmd}` : `command -v ${cmd}`) !== null; }

// Make freshly-installed user bins visible to this process.
process.env.PATH = [join(homedir(), '.local', 'bin'), join(homedir(), '.cargo', 'bin'), process.env.PATH].join(isWin ? ';' : ':');

say('\nSetting up the workshop project...\n');

// 1. Node + Git must already exist (Node is running this script).
if (!have('git')) { console.error(`${R}Git is required. Install from https://git-scm.com and re-run.${X}`); process.exit(1); }
ok('Node and Git present');

// 2. uv (installs its own Python 3.12 — avoids all the Python-version errors)
function findUv() {
  if (have('uv')) return 'uv';
  const cand = isWin
    ? [join(homedir(), '.local', 'bin', 'uv.exe'), join(homedir(), '.cargo', 'bin', 'uv.exe')]
    : [join(homedir(), '.local', 'bin', 'uv'), join(homedir(), '.cargo', 'bin', 'uv')];
  return cand.find(existsSync) || null;
}
let uv = findUv();
if (!uv) {
  say('Installing uv (the Python tool manager)...');
  try {
    if (isWin) run('powershell -c "irm https://astral.sh/uv/install.ps1 | iex"');
    else run('curl -LsSf https://astral.sh/uv/install.sh | sh');
    uv = findUv();
  } catch { /* handled below */ }
}
if (uv) { ok('uv ready'); } else { warn('Could not install uv automatically — see README step 1a'); }

// 3. aider (via uv, on Python 3.12)
try {
  if (!uv) throw new Error('no uv');
  say('Installing aider (the AI tool)... this can take a minute.');
  run(`"${uv}" tool install --python 3.12 aider-chat`);
  ok('aider installed'); results.push(['aider', true]);
} catch { warn('aider install failed — see README Troubleshooting'); results.push(['aider', false]); }

// 4. toklite + js-tiktoken (global)
try { say('Installing toklite...'); run('npm install -g toklite js-tiktoken'); ok('toklite installed'); results.push(['toklite', true]); }
catch { warn('toklite install failed — try: npm install -g toklite js-tiktoken'); results.push(['toklite', false]); }

// 5. project dependencies
try { say('Installing project dependencies...'); run('npm install'); ok('project dependencies installed'); results.push(['project deps', true]); }
catch { warn('npm install failed — run it manually: npm install'); results.push(['project deps', false]); }

// 6. verify
say('\n--- checking your machine ---');
try { run('node scripts/verify.mjs'); } catch { /* verify prints its own status */ }

const failed = results.filter(([, v]) => !v).map(([n]) => n);
say('');
if (failed.length === 0) {
  say(`${G}Setup complete.${X} If a command says "not found", open a NEW terminal (PATH updates), then run:`);
  say('  npm run verify');
} else {
  say(`${Y}Setup finished with issues:${X} ${failed.join(', ')}. See the Troubleshooting section in README.md.`);
}
say('\nNext: add your Groq key (see README step 4), then  npm run ai:groq\n');
