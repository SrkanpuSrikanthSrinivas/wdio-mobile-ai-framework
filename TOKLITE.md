# Routing the AI-CLI through toklite

Every `npm run ai` launches aider **through toklite** — a local proxy on
`127.0.0.1:8787` that cuts the tokens leaving your machine and reports what it
saved. Your key is forwarded to the provider untouched, never stored. This
workshop is toklite's ideal case: an agent editing tests re-reads the same specs
and screen objects over and over, and toklite's `dedupe`/`diffReads`/`compact`
layers strip exactly that repetition.

Install once:
```bash
npm install -g toklite
```

Pick the provider path your facilitator specifies.

---

## Path A — Anthropic (default; provider-verified savings)

Anthropic exposes a free token-count endpoint, so the savings you see at the end
are **exact and provider-verified**, not estimated. This is the default in
`.aider.conf.yml`.

```bash
export ANTHROPIC_API_KEY="<workshop-key>"     # from your facilitator
npm run ai                                     # = toklite run -- aider (Anthropic model)
```
At the wrap:
```bash
npm run tok:stats     # exact tokens + dollars saved
npm run tok:verify    # free, deterministic re-count against the provider
```

---

## Path B — Groq through toklite (free; no Anthropic key)

For anyone without an Anthropic key. Groq's endpoint is OpenAI-compatible and
free, and toklite sits in front of it. The token cutting is fully real; the
savings *number* is an estimate (Groq/OpenAI has no free count endpoint), so
install `js-tiktoken` to get a figure instead of "unmeasured".

```bash
npm install -g js-tiktoken                     # lets toklite estimate the OpenAI-side count
export GROQ_API_KEY="gsk_..."                  # free at https://console.groq.com/keys
npm run ai:groq                                # aider -> toklite -> Groq
#   override the model with:  GROQ_MODEL=openai/gpt-oss-20b npm run ai:groq
```
`npm run ai:groq` sets toklite's OpenAI upstream to `https://api.groq.com/openai`
for you. At the wrap, `npm run tok:stats` shows the estimated savings; be clear
with the room that Path B is an estimate and Path A is provider-exact.

### Using your own gateway instead of Groq
Point the upstream anywhere OpenAI-compatible (e.g. a keyed gateway you run):
```bash
toklite config set upstreams.openai https://your-gateway.example/openai
```
toklite appends `/v1/chat/completions`, so give the base **without** that suffix.

---

## Sanity check
```bash
npm run tok:doctor    # self-test the reduction pipeline
```
If `npm run tok:stats` shows 0 requests after a session, aider didn't route
through toklite — confirm `OPENAI_API_BASE` / `ANTHROPIC_API_BASE` point at
`127.0.0.1:8787` and relaunch.

toklite: https://www.npmjs.com/package/toklite ·
https://github.com/SrkanpuSrikanthSrinivas/toklite
