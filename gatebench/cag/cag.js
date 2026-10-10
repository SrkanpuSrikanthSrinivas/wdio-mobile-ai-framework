// Contract-Aware Gate (CAG) for AI-edited mobile UI tests (JavaScript and TypeScript).
//
// The gate binds test code to three contracts that a syntax-only gate cannot see:
//   * the repository contract  (modules, exports, screen-object members, runner config)
//   * the application contract (accessibility identifiers the app actually renders)
//   * the content contract     (user-visible strings the app can display)
//
// Rules
//   R0 PARSE       file parses
//   R1 IMPORT      relative imports resolve; imported names are exported;
//                  bare packages are declared in package.json or are Node built-ins
//   R2 SELECTOR    accessibility-id selectors ('~id') exist in the app's identifier registry
//   R3 PLACEHOLDER selector calls with a missing or empty locator (error);
//                  TODO / "replace with" / "assuming" comments (warning)
//   R4 REACHABLE   every spec file is matched by at least one runner spec pattern
//   R5 MEMBER      members used on imported screen objects, and on `this` inside
//                  screen-object classes (including inherited members), exist
//   R6 TEXT        literal text asserted with toHaveText/toHaveTextContaining
//                  appears in the app's string registry
//
// Optional gate.config.json at the project root:
//   { "appDirs": ["app"], "idHelpers": ["testProperties"], "allowIds": [], "testDir": "test",
//     "specDir": "test/specs" }
//
// Usage: node cag.js <projectRoot> [--json]
import fs from 'node:fs';
import path from 'node:path';
import { builtinModules } from 'node:module';
import { parse as tsParse } from '@typescript-eslint/typescript-estree';
import { minimatch } from 'minimatch';

const SELECTOR_FNS = new Set(['$', '$$']);
const TEXT_MATCHERS = { toHaveText: 'exact', toHaveTextContaining: 'contains' };
const HEDGE_RE = /(replace with (the )?(actual|appropriate)|adjust (the )?(selectors?|tab name)|selector for|\bTODO\b|\bFIXME\b)/i;
const ASSUME_RE = /\bassum(e|es|ing)\b/i;
const SRC_RE = /\.(m?[jt]s)$/;

export function parseFile(src, file = 'x.ts') {
  return tsParse(src, { loc: true, range: true, comment: true, jsx: /x$/.test(file), errorOnUnknownASTType: false });
}

// Generic ESTree walker with ancestor stack (works for JS and TS-ESTree nodes).
export function walk(node, visit, ancestors = []) {
  if (!node || typeof node.type !== 'string') return;
  visit(node, ancestors);
  ancestors.push(node);
  for (const key of Object.keys(node)) {
    if (key === 'parent' || key === 'loc' || key === 'range') continue;
    const v = node[key];
    if (Array.isArray(v)) v.forEach((c) => c && typeof c.type === 'string' && walk(c, visit, ancestors));
    else if (v && typeof v.type === 'string') walk(v, visit, ancestors);
  }
  ancestors.pop();
}

function listFiles(dir, pred) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(p, pred));
    else if (pred(p)) out.push(p);
  }
  return out;
}

export function loadConfig(root) {
  const f = path.join(root, 'gate.config.json');
  const user = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
  return { appDirs: ['app'], idHelpers: ['testProperties', 'testProps', 'testID'], allowIds: [], testDir: 'test', specDir: 'test/specs', ...user };
}

// ---------- contracts ----------
export function loadContracts(root) {
  const cfg = loadConfig(root);
  const ids = new Set(cfg.allowIds);
  const idPrefixes = new Set();
  const strings = new Set();
  const helpers = cfg.idHelpers.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const attrStr = /\b(?:testID|accessibilityLabel|nativeID)\s*[=:]\s*\{?\s*["']([^"']+)["']/g;
  const helperStr = new RegExp(`\\b(?:${helpers})\\(\\s*["']([^"']+)["']`, 'g');
  const attrTpl = /\b(?:testID|accessibilityLabel|nativeID)\s*[=:]\s*\{?\s*`([^`$]*)\$\{/g;
  const helperTpl = new RegExp(`\\b(?:${helpers})\\(\\s*\`([^\`$]*)\\$\\{`, 'g');
  for (const dir of cfg.appDirs) {
    for (const f of listFiles(path.join(root, dir), (p) => /\.(t|j)sx?$/.test(p))) {
      const src = fs.readFileSync(f, 'utf8');
      for (const re of [attrStr, helperStr]) for (const m of src.matchAll(re)) ids.add(m[1]);
      for (const re of [attrTpl, helperTpl]) for (const m of src.matchAll(re)) if (m[1]) idPrefixes.add(m[1]);
      for (const m of src.matchAll(/>\s*([^<>{}\n][^<>{}]*?)\s*</g)) strings.add(m[1].trim());
      for (const m of src.matchAll(/(['"`])((?:(?!\1)[^\\\n$]){2,})\1/g)) strings.add(m[2]);
    }
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const deps = new Set(Object.keys({ ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}), ...(pkg.peerDependencies || {}) }));
  // runner configs: wdio*.conf.(js|ts) at root or in config/
  const specGlobs = [];
  const confs = [...listFiles(root, (p) => /wdio[^/]*\.conf\.(m?[jt]s)$/.test(p) && !p.includes(`${path.sep}node_modules${path.sep}`))];
  for (const conf of confs) {
    const m = fs.readFileSync(conf, 'utf8').match(/specs\s*:\s*\[([^\]]*)\]/);
    if (!m) continue;
    for (const g of m[1].matchAll(/['"]([^'"]+)['"]/g)) {
      const abs = path.resolve(path.dirname(conf), g[1]);
      specGlobs.push(path.relative(root, abs).split(path.sep).join('/'));
    }
  }
  return { cfg, ids, idPrefixes, strings, deps, specGlobs };
}

function idKnown(c, id) {
  if (c.ids.has(id)) return true;
  for (const p of c.idPrefixes) if (id.startsWith(p) && id.length > p.length) return true;
  return false;
}

// ---------- module summaries ----------
const moduleCache = new Map();
function resolveRelative(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  const cands = [base, `${base}.ts`, `${base}.js`, path.join(base, 'index.ts'), path.join(base, 'index.js')];
  if (/\.js$/.test(base)) cands.splice(1, 0, base.replace(/\.js$/, '.ts'));
  for (const c of cands) if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  return null;
}

function moduleInfo(file) {
  if (moduleCache.has(file)) return moduleCache.get(file);
  moduleCache.set(file, null); // cycle guard
  let info = null;
  try {
    const ast = parseFile(fs.readFileSync(file, 'utf8'), file);
    const imports = new Map(); // local -> {file, kind, name}
    const classes = new Map(); // name -> node
    const named = new Set();
    let def = null; // {kind:'instance'|'class', cls}
    for (const n of ast.body) {
      if (n.type === 'ImportDeclaration' && n.source.value.startsWith('.')) {
        const t = resolveRelative(file, n.source.value);
        for (const s of n.specifiers) imports.set(s.local.name, { file: t, kind: s.type, name: s.imported?.name });
      }
      const decl = n.type === 'ExportNamedDeclaration' || n.type === 'ExportDefaultDeclaration' ? n.declaration : n;
      if (decl?.type === 'ClassDeclaration' && decl.id) classes.set(decl.id.name, decl);
      if (n.type === 'ExportNamedDeclaration') {
        if (n.declaration?.id) named.add(n.declaration.id.name);
        n.declaration?.declarations?.forEach((d) => d.id.name && named.add(d.id.name));
        (n.specifiers || []).forEach((s) => named.add(s.exported.name));
      }
      if (n.type === 'ExportDefaultDeclaration') {
        const d = n.declaration;
        if (d.type === 'NewExpression' && d.callee.type === 'Identifier') def = { kind: 'instance', clsName: d.callee.name };
        else if (d.type === 'ClassDeclaration') def = { kind: 'class', clsName: d.id?.name, node: d };
        else if (d.type === 'Identifier') def = { kind: 'ref', clsName: d.name };
        else def = { kind: 'other' };
      }
    }
    info = { file, imports, classes, named, def };
  } catch { info = null; }
  moduleCache.set(file, info);
  return info;
}

// all members of class `name` declared in module `info`, including inherited ones
function membersOf(info, clsName, seen = new Set()) {
  if (!info || seen.has(`${info.file}:${clsName}`)) return null;
  seen.add(`${info.file}:${clsName}`);
  const node = info.classes.get(clsName);
  if (!node) return null;
  const s = new Set();
  for (const m of node.body.body) {
    if (m.key?.name) s.add(m.key.name);
    if (m.kind === 'constructor') walk(m.value.body, (x) => { if (x.type === 'AssignmentExpression' && x.left.type === 'MemberExpression' && x.left.object.type === 'ThisExpression' && x.left.property.name) s.add(x.left.property.name); });
    if (m.type === 'TSParameterProperty' || m.value?.params) (m.value?.params || []).forEach((p) => p.type === 'TSParameterProperty' && p.parameter?.name && s.add(p.parameter.name));
  }
  const sup = node.superClass;
  if (sup?.type === 'Identifier') {
    let parent = null;
    if (info.classes.has(sup.name)) parent = membersOf(info, sup.name, seen);
    else if (info.imports.has(sup.name)) {
      const imp = info.imports.get(sup.name);
      const pinfo = imp.file && moduleInfo(imp.file);
      if (pinfo) {
        const cname = imp.kind === 'ImportDefaultSpecifier' ? pinfo.def?.clsName : imp.name;
        parent = cname ? membersOf(pinfo, cname, seen) : null;
      }
    }
    if (!parent) return null; // unknown base class: cannot judge membership
    parent.forEach((m) => s.add(m));
  } else if (sup) return null;
  return s;
}

function defaultExportMembers(info) {
  if (!info?.def || !info.def.clsName) return null;
  return membersOf(info, info.def.clsName);
}

// module-level string constants: const A = '...'; const O = { K: '...' }
function stringConstants(ast) {
  const vals = new Map();
  for (const n of ast.body) {
    const d = n.type === 'ExportNamedDeclaration' ? n.declaration : n;
    if (d?.type !== 'VariableDeclaration' || d.kind !== 'const') continue;
    for (const v of d.declarations) {
      if (v.id.type !== 'Identifier' || !v.init) continue;
      const init = v.init.type === 'TSAsExpression' ? v.init.expression : v.init;
      if (init.type === 'Literal' && typeof init.value === 'string') vals.set(v.id.name, init.value);
      if (init.type === 'ObjectExpression') for (const p of init.properties) {
        if (p.type === 'Property' && !p.computed && p.value.type === 'Literal' && typeof p.value.value === 'string') vals.set(`${v.id.name}.${p.key.name ?? p.key.value}`, p.value.value);
      }
    }
  }
  return vals;
}

function staticString(node, consts) {
  if (!node) return undefined;
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) return node.quasis[0].value.cooked;
  if (node.type === 'Identifier' && consts.has(node.name)) return consts.get(node.name);
  if (node.type === 'MemberExpression' && !node.computed && node.object.type === 'Identifier') {
    const k = `${node.object.name}.${node.property.name}`;
    if (consts.has(k)) return consts.get(k);
  }
  return null; // dynamic
}

// ---------- the gate ----------
export function runGate(root, { contracts } = {}) {
  moduleCache.clear();
  const c = contracts || loadContracts(root);
  const findings = [];
  const add = (rule, severity, file, line, message) => findings.push({ rule, severity, file: path.relative(root, file).split(path.sep).join('/'), line, message });
  const testFiles = listFiles(path.join(root, c.cfg.testDir), (p) => SRC_RE.test(p) && !p.endsWith('.d.ts'));

  // R4 reachability
  for (const f of listFiles(path.join(root, c.cfg.specDir), (p) => SRC_RE.test(p))) {
    const rel = path.relative(root, f).split(path.sep).join('/');
    if (c.specGlobs.length && !c.specGlobs.some((g) => minimatch(rel, g))) add('R4', 'error', f, 1, `spec file matches no runner spec pattern (${c.specGlobs.join(', ')}) and will never run`);
  }

  for (const file of testFiles) {
    let ast;
    try { ast = parseFile(fs.readFileSync(file, 'utf8'), file); } catch (e) { add('R0', 'error', file, e.lineNumber ?? 1, `parse error: ${e.message}`); continue; }
    const consts = stringConstants(ast);
    const soBindings = new Map();

    for (const node of ast.body) {
      if (node.type !== 'ImportDeclaration' || node.importKind === 'type') continue;
      const spec = node.source.value;
      const line = node.loc.start.line;
      if (spec.startsWith('.')) {
        const target = resolveRelative(file, spec);
        if (!target) { add('R1', 'error', file, line, `import '${spec}' does not resolve to a file`); continue; }
        const info = moduleInfo(target);
        if (!info) continue;
        for (const s of node.specifiers) {
          if (s.type === 'ImportDefaultSpecifier') {
            if (!info.def) add('R1', 'error', file, line, `'${spec}' has no default export`);
            else { const mem = defaultExportMembers(info); if (mem) soBindings.set(s.local.name, mem); }
          } else if (s.type === 'ImportSpecifier' && s.importKind !== 'type' && !info.named.has(s.imported.name)) {
            add('R1', 'error', file, line, `'${spec}' does not export '${s.imported.name}'`);
          }
        }
      } else {
        const pkgName = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
        if (!c.deps.has(pkgName) && !builtinModules.includes(pkgName.replace(/^node:/, '')) && !spec.startsWith('node:')) add('R1', 'error', file, line, `package '${pkgName}' is not declared in package.json`);
      }
    }
    const selfInfo = moduleInfo(file);

    walk(ast, (node, ancestors) => {
      if (node.type === 'CallExpression') {
        const callee = node.callee;
        const fnName = callee.type === 'Identifier' ? callee.name : callee.type === 'MemberExpression' && !callee.computed ? callee.property.name : null;
        if (SELECTOR_FNS.has(fnName)) {
          const arg = staticString(node.arguments[0], consts);
          if (node.arguments.length === 0 || arg === '') add('R3', 'error', file, node.loc.start.line, `selector call ${fnName}() has no locator (placeholder)`);
          else if (typeof arg === 'string' && arg.startsWith('~')) {
            if (!idKnown(c, arg.slice(1))) add('R2', 'error', file, node.loc.start.line, `accessibility id '${arg.slice(1)}' is not defined in the application`);
          }
        }
        if (callee.type === 'MemberExpression' && !callee.computed && TEXT_MATCHERS[callee.property.name]) {
          const txt = staticString(node.arguments[0], consts);
          if (typeof txt === 'string') {
            const ok = TEXT_MATCHERS[callee.property.name] === 'exact' ? c.strings.has(txt) : [...c.strings].some((s) => s.includes(txt));
            if (!ok) add('R6', 'error', file, node.loc.start.line, `asserted text "${txt}" does not appear in the application`);
          }
        }
      }
      if (node.type === 'MemberExpression' && !node.computed && node.property.type === 'Identifier') {
        if (node.object.type === 'Identifier' && soBindings.has(node.object.name)) {
          if (!soBindings.get(node.object.name).has(node.property.name)) add('R5', 'error', file, node.loc.start.line, `'${node.object.name}' has no member '${node.property.name}'`);
        }
        if (node.object.type === 'ThisExpression') {
          const cls = [...ancestors].reverse().find((a) => a.type === 'ClassDeclaration' || a.type === 'ClassExpression');
          const fn = [...ancestors].reverse().find((a) => /Function/.test(a.type));
          const arrowOnly = fn && fn.type === 'ArrowFunctionExpression';
          if (cls?.id && selfInfo && (!fn || arrowOnly || ancestors.includes(cls))) {
            const mem = membersOf(selfInfo, cls.id.name);
            if (mem && !mem.has(node.property.name)) add('R5', 'error', file, node.loc.start.line, `class '${cls.id.name}' has no member '${node.property.name}'`);
          }
        }
      }
    });

    for (const cm of ast.comments || []) {
      if (HEDGE_RE.test(cm.value)) add('R3', 'warning', file, cm.loc.start.line, `unresolved placeholder comment: "${cm.value.trim().replace(/\s+/g, ' ').slice(0, 60)}"`);
      else if (ASSUME_RE.test(cm.value)) add('R3', 'warning', file, cm.loc.start.line, `hedged assumption: "${cm.value.trim().slice(0, 60)}"`);
    }
  }
  return findings;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = path.resolve(process.argv[2] || '.');
  const t0 = performance.now();
  const findings = runGate(root);
  const ms = performance.now() - t0;
  const errors = findings.filter((f) => f.severity === 'error');
  if (process.argv.includes('--json')) console.log(JSON.stringify({ ms, findings }, null, 2));
  else {
    for (const f of findings) console.log(`${f.severity.toUpperCase().padEnd(7)} ${f.rule} ${f.file}:${f.line}  ${f.message}`);
    console.log(`CAG: ${errors.length} error(s), ${findings.length - errors.length} warning(s) in ${ms.toFixed(0)} ms`);
  }
  process.exit(errors.length ? 1 : 0);
}
