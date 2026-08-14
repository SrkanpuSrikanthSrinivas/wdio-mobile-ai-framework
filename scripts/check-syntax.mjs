// check-syntax.mjs — device-free syntax check of all specs/screenobjects/config.
// Part of `npm run validate`, which the AI-CLI runs after each edit.
import { readdirSync, statSync } from 'node:fs';
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
if (failed) {
  console.error(`\n${failed} file(s) failed the syntax check.`);
  process.exit(1);
}
console.log(`Syntax OK: ${files.length} files checked.`);
