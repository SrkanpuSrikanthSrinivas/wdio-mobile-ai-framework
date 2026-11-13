// check-locators.mjs — device-free check that tests only use what the app really has.
//   - every `~accessibility-id` in test/ must be listed in APP-MAP.md
//   - specs must not use web-only APIs, empty selectors, fixed waits or absolute XPath
//   - every spec needs at least as many expect() calls as it() blocks
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const map = readFileSync('APP-MAP.md', 'utf8');
const known = new Set([...map.matchAll(/`(~[^`]+)`/g)].map((m) => m[1]));

const files = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.js') && !(p.includes('/helpers/') && p.endsWith('.test.js'))) files.push(p);
  }
})('test');

const rules = [
  [/\bbrowser\.url\s*\(/, 'browser.url() — this is a native app, not a website'],
  [/\$\(\s*['"`][#.][A-Za-z]/, 'CSS selector (#id / .class) — use an accessibility id from APP-MAP.md'],
  [/\$\(\s*(\/\*[\s\S]*?\*\/\s*)?\)/, 'empty selector $() — use a screen-object method'],
  [/\.pause\s*\(|\bsleep\s*\(/, 'fixed wait (pause/sleep) — wait for an element instead'],
  [/['"`]\/\/?android\.widget/, 'absolute XPath — use an accessibility id from APP-MAP.md'],
];

const problems = [];
// Tests live only in test/specs/*.spec.js; helpers only in test/helpers, screens in test/screenobjects.
for (const f of files) {
  if (!/^test\/(specs|screenobjects|helpers)\//.test(f.replace(/\\/g, '/')))
    problems.push(`${f}: tests go in test/specs/*.spec.js, helpers in test/helpers/, screens in test/screenobjects/`);
}
for (const f of files) {
  const src = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  for (const m of src.matchAll(/byAccessibilityId\(\s*['"`]([^'"`$]+)['"`]\s*\)/g))
    if (!known.has('~' + m[1])) problems.push(`${f}: byAccessibilityId('${m[1]}') — '~${m[1]}' is not in APP-MAP.md; don't route around the check`);
  if (f.includes('/specs/') && /byAccessibilityId\s*\(|\$\(\s*['"`]~/.test(src))
    problems.push(`${f}: selectors belong in screen objects, not in specs — call a screen method`);
  for (const m of src.matchAll(/['"`](~[^'"`$]+)['"`]/g))
    if (!known.has(m[1])) problems.push(`${f}: locator '${m[1]}' is not in APP-MAP.md — don't guess selectors`);
  for (const [re, msg] of rules) if (re.test(src)) problems.push(`${f}: ${msg}`);
  // Specs may import only screen objects and test helpers. An AI once imported the
  // React Native app's own screen components and invented methods on them; every
  // file existed, so the import check passed, and it only failed on the device.
  if (f.includes('/specs/')) {
    for (const m of src.matchAll(/import\s+[^'"]*?from\s+['"](\.[^'"]+)['"]/g))
      if (!/^\.\.\/(screenobjects|helpers)\/[\w.-]+\.js$/.test(m[1]))
        problems.push(`${f}: import '${m[1]}' — specs import only ../screenobjects/*.js and ../helpers/*.js`);
  }
  if (f.includes('/specs/')) {
    const its = (src.match(/\bit\s*\(/g) || []).length;
    const expects = (src.match(/\bexpect\s*\(/g) || []).length;
    if (!f.endsWith('.spec.js')) problems.push(`${f}: spec files must be named *.spec.js or they never run`);
    if (its === 0) problems.push(`${f}: no it() blocks`);
    if (expects < its) problems.push(`${f}: ${its} it() but only ${expects} expect() — every test must assert`);
  }
}
if (problems.length) {
  console.error(problems.map((p) => `LOCATOR/STYLE ERROR: ${p}`).join('\n'));
  console.error(`\n${problems.length} problem(s). See CONVENTIONS.md and APP-MAP.md.`);
  process.exit(1);
}
console.log(`Locators OK: ${files.length} files checked against APP-MAP.md.`);
