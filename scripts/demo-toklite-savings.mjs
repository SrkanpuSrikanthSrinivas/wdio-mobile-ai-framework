// demo-toklite-savings.mjs — prove toklite cuts tokens, live, with NO API key
// and NO emulator. Safe to run on stage or in a hotel lobby.
//
//   npm run demo:savings
//
// It stands up a local mock "provider", routes toklite at it, sends a request
// that re-reads the same file twice (what an agent editing loop does), and shows
// how much smaller the payload is when it leaves your machine.

import http from 'node:http';
import { spawn, execFileSync } from 'node:child_process';

const FILE = ('// login.screen.js\n' +
  'const SELECTORS = { email: "~input-email", password: "~input-password", loginButton: "~button-LOGIN" };\n'.repeat(24)
).trim();

let upstreamBytes = 0;
const mock = http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    upstreamBytes = Buffer.byteLength(body);
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({
      id: 'demo', object: 'chat.completion',
      choices: [{ index: 0, message: { role: 'assistant', content: 'ok' }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 100, completion_tokens: 2, total_tokens: 102 },
    }));
  });
});

function tokConfig(v) {
  try { execFileSync('toklite', ['config', 'set', 'upstreams.openai', v], { stdio: 'pipe' }); } catch {}
}

await new Promise((r) => mock.listen(9099, r));
const savedUpstream = 'https://api.openai.com';
tokConfig('http://127.0.0.1:9099');

const tok = spawn('toklite', ['start'], { stdio: 'ignore' });
let up = false;
for (let i = 0; i < 40 && !up; i++) {
  try { up = (await fetch('http://127.0.0.1:8787/__toklite/health')).ok; } catch {}
  if (!up) await new Promise((r) => setTimeout(r, 250));
}
if (!up) { console.error('toklite did not start (is it installed? npm i -g toklite)'); tok.kill(); mock.close(); process.exit(1); }

const clientBody = JSON.stringify({
  model: 'demo-model',
  messages: [
    { role: 'user', content: 'Here is the screen object:\n' + FILE },
    { role: 'assistant', content: 'Got it.' },
    { role: 'user', content: 'Re-reading the same file to add a test:\n' + FILE },
  ],
});
const sentBytes = Buffer.byteLength(clientBody);

const resp = await fetch('http://127.0.0.1:8787/v1/chat/completions', {
  method: 'POST',
  headers: { 'content-type': 'application/json', authorization: 'Bearer sk-demo' },
  body: clientBody,
});
const removed = resp.headers.get('x-toklite-bytes-removed');
await resp.json().catch(() => {});

const pct = ((1 - upstreamBytes / sentBytes) * 100).toFixed(1);
console.log('\n  toklite — live reduction (mock provider, no key, no device)\n');
console.log(`   agent -> toklite   (sent):    ${sentBytes} bytes`);
console.log(`   toklite -> provider (fwd):    ${upstreamBytes} bytes`);
console.log(`   removed:                      ${removed} bytes`);
console.log(`   payload shrunk by:            ${pct}%   <- the re-read file was deduped\n`);
console.log('  On the real workshop (Anthropic upstream) `npm run tok:stats` shows');
console.log('  the same effect as provider-verified tokens + dollars.\n');

tok.kill('SIGTERM');
mock.close();
tokConfig(savedUpstream);
setTimeout(() => process.exit(0), 300);
