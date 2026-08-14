# Using Groq (free) instead of Anthropic

Groq is free (no credit card) and OpenAI-compatible, so it works through toklite.
The token cutting is real; the savings *number* at the end is an estimate rather
than provider-exact (only Anthropic gives free exact counts). Fine for the lab.

## One-time (each participant)
1. Make a free key: https://console.groq.com/keys  → copy it (starts `gsk_`).
2. Install the tools if you haven't:
   ```
   npm install -g toklite js-tiktoken
   python -m pip install aider-install && aider-install
   ```
   (`js-tiktoken` lets toklite show a savings number on the Groq path.)

## Every time you start the AI
```
export GROQ_API_KEY=gsk_your_key_here
npm run ai:groq
```
That's it. `npm run ai:groq` automatically points toklite at Groq and starts
aider. Use it anywhere the labs say `npm run ai`.

Want a different model?
```
GROQ_MODEL=openai/gpt-oss-20b npm run ai:groq     # faster/cheaper
GROQ_MODEL=qwen/qwen3.6-27b   npm run ai:groq     # highest quality
```
Default is `openai/gpt-oss-120b` (good balance). These are current Groq
production model ids — check https://console.groq.com/docs/models if one changes.

## Notes
- If aider warns "model not found / unknown", that's harmless — continue.
- After a session, `npm run tok:stats` shows the estimated tokens saved.
- The emulator + `npm run android` steps are exactly the same as the Anthropic
  path — Groq only changes how the AI editing is powered.
