// ai.mjs — launch aider through toklite. Cross-platform (Mac/Windows/Linux).
//   npm run ai:groq     (free Groq)      npm run ai   (Anthropic)
//
// It reads your key from the environment OR from a local `.env` file, so a
// SHARED workshop key and a PERSONAL key both work with no code changes:
//   - Shared: the host gives you one line — put it in .env or `export` it.
//   - Personal: your own key in .env or the environment.

import { spawnSync, execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

// --- load .env if present (simple KEY=VALUE parser) ---
if (existsSync('.env')) {
  for (const raw of readFileSync('.env', 'utf8').split('\n')) {
    const l = raw.trim();
    if (!l || l.startsWith('#')) continue;
    const i = l.indexOf('=');
    if (i > 0) {
      const k = l.slice(0, i).trim();
      let v = l.slice(i + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const provider = (process.argv[2] || (process.env.GROQ_API_KEY ? 'groq' : 'anthropic')).toLowerCase();
const passthrough = process.argv.slice(3);

function tokConfig(v) { try { execSync(`toklite config set upstreams.openai ${v}`, { stdio: 'pipe', shell: true }); } catch {} }

let model, env = { ...process.env };

if (provider === 'groq') {
  if (!process.env.GROQ_API_KEY) {
    console.error('\nNo Groq key found. Add it one of these ways, then re-run:\n' +
      '  • put   GROQ_API_KEY=gsk_xxx   in a file called .env  (copy .env.example)\n' +
      '  • or    export GROQ_API_KEY=gsk_xxx   (Windows: setx GROQ_API_KEY gsk_xxx, new window)\n');
    process.exit(1);
  }
  tokConfig('https://api.groq.com/openai');           // toklite -> Groq
  const groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
  model = `openai/${groqModel}`;                       // aider provider tag + Groq id
  env.OPENAI_API_KEY = process.env.GROQ_API_KEY;
  env.OPENAI_API_BASE = 'http://127.0.0.1:8787/v1';    // aider -> toklite
  console.log(`\naider -> toklite -> Groq (${groqModel}).`);
} else {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('\nNo Anthropic key found. Use Groq instead (free):  npm run ai:groq\n' +
      'or set ANTHROPIC_API_KEY (see README).');
    process.exit(1);
  }
  model = process.env.ANTHROPIC_MODEL || 'anthropic/claude-haiku-4-5-20251001';
  console.log('\naider -> toklite -> Anthropic.');
}

// toklite run -- aider --model <model> [extra args]
const args = ['run', '--', 'aider', '--model', model, ...passthrough];
const r = spawnSync('toklite', args, { stdio: 'inherit', shell: true, env });
process.exit(r.status ?? 0);
