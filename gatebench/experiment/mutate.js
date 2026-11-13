// Mutation experiment: baseline gates vs. the Contract-Aware Gate (CAG) on
// seeded defects derived from the field taxonomy, boundary ("wrong but valid")
// defects, control defects, and semantics-preserving (equivalent) mutants.
//
// usage: node experiment/mutate.js <subjectDir> <outDir> <lang: js|ts> <targetDir> [<targetDir>...]
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';
import { parseFile, walk, runGate, loadContracts } from '../cag/cag.js';

const [subjectArg, outArg, lang, ...targetDirs] = process.argv.slice(2);
const SUBJECT = path.resolve(subjectArg);
const OUT = path.resolve(outArg);
fs.mkdirSync(OUT, { recursive: true });
const SRC_RE = lang === 'ts' ? /\.ts$/ : /\.js$/;

// working copy next to the subject (keeps relative app paths valid); node_modules symlinked
const WORK = `${SUBJECT}.work`;
fs.rmSync(WORK, { recursive: true, force: true });
fs.cpSync(SUBJECT, WORK, { recursive: true, filter: (p) => !p.split(path.sep).includes('node_modules') && !p.includes(`${path.sep}.git`) });
if (fs.existsSync(path.join(SUBJECT, 'node_modules'))) fs.symlinkSync(path.join(SUBJECT, 'node_modules'), path.join(WORK, 'node_modules'));

function listFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(p)); else if (SRC_RE.test(p) && !p.endsWith('.d.ts')) out.push(p);
  }
  return out;
}
const TARGETS = targetDirs.flatMap((d) => listFiles(path.join(WORK, d.split(':')[0])).filter((f) => !d.includes(':') || new RegExp(d.split(':')[1]).test(path.basename(f))));
const rel = (p) => path.relative(WORK, p).split(path.sep).join('/');
const specDir = loadContracts(WORK).cfg.specDir;
const isSpec = (f) => rel(f).startsWith(specDir);

// ---------- helpers ----------
const S = (n) => n.range[0]; const E = (n) => n.range[1];
const splice = (src, a, b, s) => src.slice(0, a) + s + src.slice(b);
const isStr = (n) => n?.type === 'Literal' && typeof n.value === 'string';
const MODULE_SYNONYMS = { signin: 'login', signup: 'register', landing: 'home', tabbar: 'navbar', log: 'workout', stats: 'statistics', recovery: 'rest', data: 'testData',
  LoginScreen: 'SignInScreen', HomeScreen: 'MainScreen', FormsScreen: 'FormScreen', SwipeScreen: 'CarouselScreen', DragScreen: 'DragAndDropScreen', WebviewScreen: 'WebViewScreen', AppScreen: 'BaseScreen', TabBar: 'TabBarScreen', NativeAlert: 'Alert', Picker: 'Dropdown', Carousel: 'Slider', Gestures: 'Gesture', WebView: 'Webview', AndroidSettings: 'Settings', Utils: 'Helpers', Biometrics: 'Biometric', Constants: 'Config' };
const VERB_SYNONYMS = { open: 'goTo', fill: 'enter', sign: 'log', submit: 'tap', add: 'create', wait: 'await', entry: 'item', volume: 'total', log: 'record', input: 'field', error: 'errorMessage', title: 'heading', root: 'container', welcome: 'welcomeText', tagline: 'subtitle', score: 'recoveryScore', advice: 'tip', streak: 'streakCount', entries: 'items', empty: 'blank', rest: 'restDay',
  tap: 'click', is: 'check', get: 'fetch', swipe: 'scroll', drag: 'move', select: 'choose', screen: 'view', text: 'label', email: 'emailField', password: 'passwordField', top: 'tap', set: 'update' };
const nearMissMember = (name) => { const m = name.match(/^([a-z]+)(.*)$/); return m && VERB_SYNONYMS[m[1]] ? VERB_SYNONYMS[m[1]] + m[2] : `${name}Field`; };
const nearMissId = (id) => { const parts = id.split(/[-_]/); const sep = id.includes('-') ? '-' : '_'; return parts.length >= 2 ? [...parts.slice(1), parts[0]].join(sep) : `${id}-view`; };
const nearMissText = (t) => { const w = t.split(' '); return w.length > 1 ? w.slice(0, -1).join(' ') : `${t}!`; };

const contracts0 = loadContracts(WORK);
const ALL_IDS = [...contracts0.ids].filter((i) => !contracts0.cfg.allowIds.includes(i));
const ALL_STRINGS = [...contracts0.strings].filter((s) => /^[A-Z][a-z].{3,40}$/.test(s));
function validButWrongId(id) {
  const prefix = id.split(/[-_]/)[0];
  const same = ALL_IDS.filter((x) => x !== id && x.split(/[-_]/)[0] === prefix).sort();
  const pool = same.length ? same : ALL_IDS.filter((x) => x !== id).sort();
  return pool[0];
}
const validButWrongText = (t) => ALL_STRINGS.filter((s) => s !== t).sort((a, b) => Math.abs(a.length - t.length) - Math.abs(b.length - t.length) || a.localeCompare(b))[0];

function soLocals(ast) {
  return new Set(ast.body.filter((n) => n.type === 'ImportDeclaration' && /screenobjects|components/i.test(n.source.value)).flatMap((n) => n.specifiers.filter((s) => s.type === 'ImportDefaultSpecifier').map((s) => s.local.name)));
}
function selectorLiterals(ast) {
  // '~id' strings used as $()/$$() arguments, or in const objects/values (SELECTORS pattern)
  const out = [];
  walk(ast, (n) => {
    if (n.type === 'CallExpression' && n.callee.type === 'Identifier' && (n.callee.name === '$' || n.callee.name === '$$') && isStr(n.arguments[0]) && n.arguments[0].value.startsWith('~')) out.push({ lit: n.arguments[0], call: n });
    if (n.type === 'Property' && isStr(n.value) && n.value.value.startsWith('~')) out.push({ lit: n.value });
    if (n.type === 'VariableDeclarator' && isStr(n.init) && n.init.value.startsWith('~')) out.push({ lit: n.init });
  });
  return out;
}

// ---------- operators ----------
const OPS = {
  M1_import_depth: { cls: 'G1 import', group: 'field', fn: (f, src, ast) => ast.body.filter((n) => n.type === 'ImportDeclaration' && n.source.value.startsWith('../') || n.type === 'ImportDeclaration' && n.source.value.startsWith('./')).map((n) => ({ s: splice(src, S(n.source) + 1, S(n.source) + 1, '../'), site: n.loc.start.line })) },
  M2_import_target: { cls: 'G1 import', group: 'field', fn: (f, src, ast) => ast.body.filter((n) => n.type === 'ImportDeclaration' && n.source.value.startsWith('.')).flatMap((n) => {
    const v = n.source.value; const base = path.posix.basename(v); const stem = base.split('.')[0];
    if (!MODULE_SYNONYMS[stem]) return [];
    return [{ s: splice(src, S(n.source) + 1, E(n.source) - 1, v.slice(0, v.length - base.length) + base.replace(stem, MODULE_SYNONYMS[stem])), site: n.loc.start.line }];
  }) },
  M3_placeholder_selector: { cls: 'G2 placeholder', group: 'field', fn: (f, src, ast) => selectorLiterals(ast).filter((x) => x.call).map(({ lit }) => ({ s: splice(src, S(lit), E(lit), `/* selector for ${lit.value.slice(1)} */`), site: lit.loc.start.line })) },
  M4_stale_selector: { cls: 'I3 locator', group: 'field', fn: (f, src, ast) => selectorLiterals(ast).map(({ lit }) => ({ s: splice(src, S(lit) + 2, E(lit) - 1, nearMissId(lit.value.slice(1))), site: lit.loc.start.line })) },
  M5_hallucinated_member: { cls: 'Hallucinated API', group: 'field', fn: (f, src, ast) => {
    const so = soLocals(ast); const out = [];
    walk(ast, (n) => { if (n.type === 'MemberExpression' && !n.computed && n.property.type === 'Identifier' && ((n.object.type === 'Identifier' && so.has(n.object.name)) || n.object.type === 'ThisExpression')) out.push({ s: splice(src, S(n.property), E(n.property), nearMissMember(n.property.name)), site: n.loc.start.line }); });
    return out;
  } },
  M6_unreachable_spec: { cls: 'G5 naming', group: 'field', fn: (f, src) => (isSpec(f) ? [{ s: src, newPath: f.replace(/\.spec\.(js|ts)$/, '.test.$1'), site: 'file name' }] : []) },
  M7_wrong_ui_text: { cls: 'I3 assertion', group: 'field', fn: (f, src, ast) => {
    const out = [];
    walk(ast, (n) => { if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && /^toHaveText(Containing)?$/.test(n.callee.property.name) && isStr(n.arguments[0])) out.push({ s: splice(src, S(n.arguments[0]) + 1, E(n.arguments[0]) - 1, nearMissText(n.arguments[0].value)), site: n.loc.start.line }); });
    return out;
  } },
  B1_valid_wrong_import: { cls: 'Boundary: wrong module', group: 'boundary', fn: (f, src, ast) => ast.body.filter((n) => n.type === 'ImportDeclaration' && /screenobjects|components/i.test(n.source.value) && n.source.value.startsWith('.')).flatMap((n) => {
    const target = path.resolve(path.dirname(f), n.source.value).replace(/\.js$/, lang === 'ts' ? '.ts' : '.js');
    const dir = path.dirname(target);
    const sib = fs.readdirSync(dir).filter((x) => SRC_RE.test(x) && path.join(dir, x) !== target && !/^(App|Base)/.test(x)).sort()[0];
    if (!sib) return [];
    const v = n.source.value; const base = path.posix.basename(v);
    const newBase = lang === 'ts' ? sib.replace(/\.ts$/, '.js') : sib;
    return [{ s: splice(src, S(n.source) + 1, E(n.source) - 1, v.slice(0, v.length - base.length) + newBase), site: n.loc.start.line }];
  }) },
  B2_valid_wrong_selector: { cls: 'Boundary: wrong element', group: 'boundary', fn: (f, src, ast) => selectorLiterals(ast).flatMap(({ lit }) => { const w = validButWrongId(lit.value.slice(1)); return w ? [{ s: splice(src, S(lit) + 2, E(lit) - 1, w), site: lit.loc.start.line }] : []; }) },
  B3_valid_wrong_text: { cls: 'Boundary: wrong text', group: 'boundary', fn: (f, src, ast) => {
    const out = [];
    walk(ast, (n) => { if (n.type === 'CallExpression' && n.callee.type === 'MemberExpression' && /^toHaveText(Containing)?$/.test(n.callee.property.name) && isStr(n.arguments[0])) { const w = validButWrongText(n.arguments[0].value); if (w) out.push({ s: splice(src, S(n.arguments[0]) + 1, E(n.arguments[0]) - 1, w), site: n.loc.start.line }); } });
    return out;
  } },
  C1_syntax_error: { cls: 'Control: syntax', group: 'control', fn: (f, src, ast) => { const out = []; walk(ast, (n) => { if (n.type === 'CallExpression' && n.arguments.length && src[E(n) - 1] === ')') out.push({ s: splice(src, E(n) - 1, E(n), ''), site: n.loc.end.line }); }); return out.filter((_, i) => i % 3 === 0); } },
  C2_logic_inversion: { cls: 'Control: semantic', group: 'control', fn: (f, src, ast) => { const out = []; walk(ast, (n) => { const c = n.callee; if (n.type === 'CallExpression' && c?.type === 'MemberExpression' && !c.computed && /^to(Have|Be|Contain|Equal)/.test(c.property.name) && c.object.type === 'CallExpression' && c.object.callee.name === 'expect') out.push({ s: splice(src, S(c.property), S(c.property), 'not.'), site: n.loc.start.line }); }); return out; } },
  C3_missing_await: { cls: 'Control: async', group: 'control', fn: (f, src, ast) => { const out = []; walk(ast, (n) => { if (n.type === 'AwaitExpression') out.push({ s: splice(src, S(n), S(n.argument), ''), site: n.loc.start.line }); }); return out; } },
  E1_quote_style: { cls: 'Equivalent', group: 'equivalent', fn: (f, src, ast) => { const lits = []; walk(ast, (n) => { if (isStr(n) && src[S(n)] === "'" && !n.value.includes('"') && !n.value.includes('\\')) lits.push(n); }); if (!lits.length) return []; let s = src; for (const n of lits.sort((a, b) => S(b) - S(a))) s = splice(s, S(n), E(n), JSON.stringify(n.value)); return [{ s, site: `${lits.length} literals` }]; } },
  E2_import_order: { cls: 'Equivalent', group: 'equivalent', fn: (f, src, ast) => { const imps = ast.body.filter((n) => n.type === 'ImportDeclaration'); if (imps.length < 2) return []; const [a, b] = imps.slice(-2); return [{ s: src.slice(0, S(a)) + src.slice(S(b), E(b)) + src.slice(E(a), S(b)) + src.slice(S(a), E(a)) + src.slice(E(b)), site: 'last two imports' }]; } },
  E3_comment_whitespace: { cls: 'Equivalent', group: 'equivalent', fn: (f, src) => [{ s: `// Reviewed by AI-CLI: no functional change.\n\n${src.replace(/\n/g, '\n\n')}`, site: 'header + blank lines' }] },
  E4_rename_local: { cls: 'Equivalent', group: 'equivalent', fn: (f, src, ast) => {
    const names = new Set(); walk(ast, (n) => { if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier') names.add(n.id.name); });
    const out = [];
    for (const name of names) {
      const ids = []; walk(ast, (n, anc) => { const p = anc[anc.length - 1]; if (n.type === 'Identifier' && n.name === name && !(p?.type === 'MemberExpression' && p.property === n && !p.computed) && !(p?.type === 'Property' && p.key === n && !p.shorthand)) ids.push(n); });
      let s = src; for (const n of ids.sort((a, b) => S(b) - S(a))) s = splice(s, S(n), S(n) + name.length, `${name}Value`); // identifier text only (TS ranges include type annotations)
      out.push({ s, site: `rename ${name}` });
    }
    return out;
  } },
};

// ---------- baseline gates ----------
function baselineSyntax(file, text) {
  if (lang === 'js') return spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' }).status !== 0;
  const r = ts.transpileModule(text, { reportDiagnostics: true, compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }, fileName: file });
  return (r.diagnostics || []).length > 0;
}

let tsState = null;
function tscInit() {
  const cfgPath = ts.findConfigFile(WORK, ts.sys.fileExists, 'tsconfig.json');
  const cfg = ts.parseJsonConfigFileContent(ts.readConfigFile(cfgPath, ts.sys.readFile).config, ts.sys, WORK);
  const versions = new Map(); const overrides = new Map();
  let fileNames = [...cfg.fileNames];
  const host = {
    getScriptFileNames: () => fileNames,
    getScriptVersion: (f) => String(versions.get(path.resolve(f)) || 0),
    getScriptSnapshot: (f) => { const n = path.resolve(f); const t = overrides.has(n) ? overrides.get(n) : (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : undefined); return t === undefined ? undefined : ts.ScriptSnapshot.fromString(t); },
    getCurrentDirectory: () => WORK,
    getCompilationSettings: () => cfg.options,
    getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
    fileExists: (f) => overrides.has(path.resolve(f)) || ts.sys.fileExists(f),
    readFile: (f) => overrides.get(path.resolve(f)) ?? ts.sys.readFile(f),
    readDirectory: ts.sys.readDirectory, directoryExists: ts.sys.directoryExists, getDirectories: ts.sys.getDirectories,
  };
  const ls = ts.createLanguageService(host, ts.createDocumentRegistry());
  const key = (d) => `${d.code}|${ts.flattenDiagnosticMessageText(d.messageText, ' ').replace(/'[^']*'/g, "'_'")}`;
  const diag = (f) => [...ls.getSyntacticDiagnostics(f), ...ls.getSemanticDiagnostics(f)];
  const base = new Map();
  let total = 0;
  for (const f of TARGETS) { const d = diag(f); total += d.length; const m = new Map(); d.forEach((x) => m.set(key(x), (m.get(key(x)) || 0) + 1)); base.set(path.resolve(f), m); }
  tsState = { ls, versions, overrides, key, diag, base, setNames: (n) => { fileNames = n; }, cfg };
  return total;
}
function baselineTypes(file, text, origFile) {
  const st = tsState; const n = path.resolve(file);
  st.overrides.set(n, text); st.versions.set(n, (st.versions.get(n) || 0) + 1);
  if (!st.cfg.fileNames.includes(n)) st.setNames([...st.cfg.fileNames.filter((x) => x !== path.resolve(origFile)), n]);
  const baseCounts = new Map(st.base.get(path.resolve(origFile)) || []);
  const fresh = st.diag(file).filter((d) => { const k = st.key(d); const c = baseCounts.get(k) || 0; if (c > 0) { baseCounts.set(k, c - 1); return false; } return true; });
  st.overrides.delete(n); st.versions.set(n, st.versions.get(n) + 1);
  st.setNames([...st.cfg.fileNames]);
  return fresh;
}

// ---------- run ----------
const contracts = loadContracts(WORK);
const baseFindings = runGate(WORK, { contracts }).filter((f) => f.severity === 'error');
const tscBaseErrors = lang === 'ts' ? tscInit() : null; // diagnostics already present in the unmodified target files
const rows = [];
let id = 0;
const t0 = Date.now();
for (const [op, def] of Object.entries(OPS)) {
  for (const file of TARGETS) {
    const src = fs.readFileSync(file, 'utf8');
    const ast = parseFile(src, file);
    for (const m of def.fn(file, src, ast)) {
      if (m.s === src && !m.newPath) continue;
      id++;
      const target = m.newPath || file;
      if (m.newPath) fs.renameSync(file, target);
      fs.writeFileSync(target, m.s);
      const syn = baselineSyntax(target, m.s);
      let typ = null;
      if (lang === 'ts') typ = syn ? true : baselineTypes(target, m.s, file).length > 0;
      const errs = runGate(WORK, { contracts }).filter((f) => f.severity === 'error');
      const newErrs = errs.filter((e) => !baseFindings.some((b) => b.rule === e.rule && b.file === e.file && b.message === e.message));
      rows.push({ id, op, cls: def.cls, group: def.group, file: rel(file), site: m.site, baseline_syntax: syn, baseline_types: typ, cag: newErrs.length > 0, cag_rules: [...new Set(newErrs.map((e) => e.rule))].join('+') });
      if (m.newPath) fs.rmSync(target);
      fs.writeFileSync(file, src);
    }
  }
}
const elapsed = (Date.now() - t0) / 1000;

const summary = {};
for (const r of rows) {
  const s = summary[r.op] ||= { op: r.op, cls: r.cls, group: r.group, n: 0, syntax: 0, types: 0, cag: 0, cag_or_types: 0, rules: {} };
  s.n++; if (r.baseline_syntax) s.syntax++; if (r.baseline_types) s.types++; if (r.cag) s.cag++; if (r.cag || r.baseline_types || r.baseline_syntax) s.cag_or_types++;
  for (const k of r.cag_rules.split('+').filter(Boolean)) s.rules[k] = (s.rules[k] || 0) + 1;
}
const meta = { subject: path.basename(SUBJECT), lang, targets: TARGETS.map(rel), mutants: rows.length, cag_errors_on_original: baseFindings.length, tsc_errors_on_original: tscBaseErrors, seconds: elapsed };
fs.writeFileSync(path.join(OUT, 'mutants.json'), JSON.stringify(rows, null, 1));
fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify({ meta, summary: Object.values(summary) }, null, 1));
const header = Object.keys(rows[0]);
fs.writeFileSync(path.join(OUT, 'mutants.csv'), [header.join(','), ...rows.map((r) => header.map((h) => JSON.stringify(r[h] ?? '')).join(','))].join('\n'));
console.log(JSON.stringify(meta));
console.log('op'.padEnd(24), 'n'.padStart(4), 'syn'.padStart(5), 'tsc'.padStart(5), 'CAG'.padStart(5), 'any'.padStart(5), ' rules');
for (const s of Object.values(summary)) console.log(s.op.padEnd(24), String(s.n).padStart(4), String(s.syntax).padStart(5), String(lang === 'ts' ? s.types : '-').padStart(5), String(s.cag).padStart(5), String(s.cag_or_types).padStart(5), ' ', JSON.stringify(s.rules));
fs.rmSync(WORK, { recursive: true, force: true });
