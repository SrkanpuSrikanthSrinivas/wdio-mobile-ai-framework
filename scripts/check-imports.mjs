// check-imports.mjs — device-free import check for specs/screenobjects/config.
// `node --check` only parses; it never resolves imports. This catches what it misses:
//   - relative imports that point at files that don't exist
//   - packages that aren't declared in package.json (e.g. an AI reaching for 'chai')
//   - CommonJS require() in this ESM project ("type": "module")
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { builtinModules } from 'node:module';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const declared = new Set(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }));
const builtins = new Set([...builtinModules, ...builtinModules.map((m) => `node:${m}`)]);

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(m?js)$/.test(p)) files.push(p);
  }
})('test');
walk2('config');
function walk2(d) { for (const n of readdirSync(d)) { const p = join(d, n); if (/\.(m?js)$/.test(p)) files.push(p); } }

const problems = [];
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const specs = [
    ...src.matchAll(/^\s*import\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/gm),
    ...src.matchAll(/\bimport\(\s*['"]([^'"]+)['"]\s*\)/g),
  ].map((m) => m[1]);
  if (/\brequire\s*\(/.test(src)) problems.push(`${f}: uses require() — this project is ESM; use import`);
  for (const s of specs) {
    if (s.startsWith('.')) {
      const base = resolve(dirname(f), s);
      if (![base, `${base}.js`, `${base}.mjs`, join(base, 'index.js')].some((p) => existsSync(p) && statSync(p).isFile()))
        problems.push(`${f}: import '${s}' — file not found`);
      else if (!/\.m?js$/.test(s)) problems.push(`${f}: import '${s}' — ESM needs the .js extension`);
    } else if (!s.startsWith('node:') && !builtins.has(s)) {
      const name = s.startsWith('@') ? s.split('/').slice(0, 2).join('/') : s.split('/')[0];
      if (!declared.has(name)) problems.push(`${f}: import '${s}' — '${name}' is not in package.json (use WDIO's global expect instead of extra libraries)`);
    }
  }
}
if (problems.length) {
  console.error(problems.map((p) => `IMPORT ERROR: ${p}`).join('\n'));
  console.error(`\n${problems.length} import problem(s).`);
  process.exit(1);
}
console.log(`Imports OK: ${files.length} files checked.`);

// --- Calls to functions that don't exist -------------------------------------
// `node --check` can't see these either: a spec that calls a helper it never
// imported or defined crashes only on the device.
const GLOBALS = new Set(['expect', 'driver', 'browser', '$', '$$', 'describe', 'it', 'before', 'after',
  'beforeEach', 'afterEach', 'require', 'setTimeout', 'Promise', 'String', 'Number', 'Date', 'JSON',
  'Object', 'Array', 'Math', 'console', 'Error', 'RegExp', 'Boolean', 'Symbol', 'parseInt', 'parseFloat']);
const undefinedCalls = [];
for (const f of files.filter((p) => p.includes('/specs/'))) {
  const src = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  const known = new Set(GLOBALS);
  for (const m of src.matchAll(/import\s+(\w+)?\s*,?\s*(?:\{([^}]*)\})?\s*from/g)) {
    if (m[1]) known.add(m[1]);
    (m[2] || '').split(',').map((x) => x.trim().split(/\s+as\s+/).pop()).filter(Boolean).forEach((x) => known.add(x));
  }
  for (const m of src.matchAll(/(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=)/g)) known.add(m[1] || m[2]);
  for (const m of src.matchAll(/(?<![.\w$])([A-Za-z_]\w*)\s*\(/g)) {
    const name = m[1];
    if (!known.has(name) && !['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'await', 'async', 'typeof', 'new'].includes(name))
      undefinedCalls.push(`${f}: calls ${name}() but never imports or defines it`);
  }
}
if (undefinedCalls.length) {
  console.error([...new Set(undefinedCalls)].map((p) => `IMPORT ERROR: ${p}`).join('\n'));
  process.exit(1);
}
