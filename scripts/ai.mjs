// ai.mjs — launch aider through toklite. Cross-platform (Mac/Windows/Linux).
//   npm run ai:gemini (free Gemini, recommended)   npm run ai:groq (free Groq, 8K/min)
//   npm run ai:local  (Ollama on this Mac)         npm run ai      (first key found in .env)
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

const provider = (process.argv[2] ||
  (process.env.GEMINI_API_KEY ? 'gemini' : process.env.GROQ_API_KEY ? 'groq' : 'anthropic')).toLowerCase();
const passthrough = process.argv.slice(3);

function tokConfig(v) { try { execSync(`toklite config set upstreams.openai ${v}`, { stdio: 'pipe', shell: true }); } catch {} }

let model, env = { ...process.env }, viaToklite = true, extra = [];

if (provider === 'gemini') {
  // Free tier, no card: https://aistudio.google.com/apikey  (Flash models are free of charge)
  if (!process.env.GEMINI_API_KEY) {
    console.error('\nNo Gemini key. Get a free one at https://aistudio.google.com/apikey and add\n' +
      '  GEMINI_API_KEY=...   to .env, then re-run:  npm run ai:gemini\n');
    process.exit(1);
  }
  model = `gemini/${process.env.GEMINI_MODEL || 'gemini-3.8-flash'}`;
  viaToklite = false;                                   // aider talks to Gemini directly
  extra = ['--no-show-model-warnings'];
  console.log(`\naider -> Gemini (${model.slice(7)}, free tier).`);
} else if (provider === 'groq') {
  if (!process.env.GROQ_API_KEY) {
    console.error('\nNo Groq key found. Put GROQ_API_KEY=gsk_xxx in .env (free: https://console.groq.com/keys)\n');
    process.exit(1);
  }
  tokConfig('https://api.groq.com/openai');           // toklite -> Groq
  const groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
  model = `openai/${groqModel}`;
  env.OPENAI_API_KEY = process.env.GROQ_API_KEY;
  env.OPENAI_API_BASE = 'http://127.0.0.1:8787/v1';
  // Groq's free tier caps each request at 8,000 tokens per minute: keep prompts small.
  extra = ['--map-tokens', '256', '--max-chat-history-tokens', '512', '--no-show-model-warnings'];
  console.log(`\naider -> toklite -> Groq (${groqModel}). Free tier: 8K tokens/min — use /clear between prompts.`);
} else if (provider === 'ollama') {
  // Fully local and free (no key). Heavy on RAM: close the emulator; use with run:cloud.
  model = `ollama_chat/${process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b'}`;
  env.OLLAMA_API_BASE = process.env.OLLAMA_API_BASE || 'http://127.0.0.1:11434';
  viaToklite = false;
  extra = ['--no-show-model-warnings'];
  console.log(`\naider -> Ollama on this Mac (${model.slice(12)}). First: ollama pull ${model.slice(12)}`);
} else {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('\nNo Anthropic key. Free options:  npm run ai:gemini   (or ai:groq / ai:local)\n');
    process.exit(1);
  }
  model = process.env.ANTHROPIC_MODEL || 'anthropic/claude-haiku-4-5-20251001';
  console.log('\naider -> toklite -> Anthropic.');
}

// toklite run -- aider --model <model> [extra args]
const aiderArgs = ['aider', '--model', model, ...extra, ...passthrough];
const r = viaToklite
  ? spawnSync('toklite', ['run', '--', ...aiderArgs], { stdio: 'inherit', shell: true, env })
  : spawnSync(aiderArgs[0], aiderArgs.slice(1), { stdio: 'inherit', shell: true, env });
process.exit(r.status ?? 0);
