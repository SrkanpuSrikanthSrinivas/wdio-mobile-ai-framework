// check-syntax.mjs — device-free syntax check of all specs/screenobjects/config.
// Part of `npm run validate`, which the AI-CLI runs after each edit.
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const roots = ['config', 'test'];
const files = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.js') || p.endsWith('.mjs')) files.push(p);
  }
}
roots.forEach(walk);

let failed = 0;
for (const f of files) {
  try {
    execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
  } catch (e) {
    failed++;
    console.error(`SYNTAX ERROR: ${f}\n${e.stderr?.toString() || e.message}`);
  }
}
// Every WDIO config that package.json runs must exist and still export a
// `config` (an AI-CLI once replaced wdio.android.conf.js with a placeholder line,
// which parses as valid JS but breaks every local run).
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const configs = new Set(Object.values(pkg.scripts || {})
  .flatMap((cmd) => [...cmd.matchAll(/wdio run (\S+)/g)].map((m) => m[1])));
for (const c of configs) {
  if (!existsSync(c)) { failed++; console.error(`CONFIG ERROR: ${c} is missing (package.json runs it)`); continue; }
  const src = readFileSync(c, 'utf8');
  if (!/export\s+const\s+config\s*=/.test(src) || !/capabilities\s*:/.test(src)) {
    failed++; console.error(`CONFIG ERROR: ${c} no longer exports a WDIO config with capabilities`);
  }
}

if (failed) {
  console.error(`\n${failed} file(s) failed the syntax/config check.`);
  process.exit(1);
}
console.log(`Syntax OK: ${files.length} files checked; ${configs.size} WDIO configs present.`);
