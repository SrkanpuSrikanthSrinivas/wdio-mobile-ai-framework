#!/usr/bin/env bash
# ai-groq.sh — launch aider through toklite, routed to Groq (free, OpenAI-compatible).
# For participants who don't have an Anthropic key.
#
#   export GROQ_API_KEY=gsk_...          # free key: https://console.groq.com/keys
#   npm run ai:groq                       # optional: GROQ_MODEL=... to override
set -euo pipefail

: "${GROQ_API_KEY:?Set GROQ_API_KEY first (free at https://console.groq.com/keys)}"

# A current Groq PRODUCTION model id (note: Groq ids contain a slash).
# Options: openai/gpt-oss-120b (best), openai/gpt-oss-20b (fastest), qwen/qwen3.6-27b.
GROQ_MODEL="${GROQ_MODEL:-openai/gpt-oss-120b}"

# Point toklite's OpenAI upstream at Groq. toklite appends /v1/chat/completions,
# so the base is the host WITHOUT that suffix (…/openai, not …/openai/v1).
toklite config set upstreams.openai https://api.groq.com/openai >/dev/null

# aider talks to toklite as an OpenAI-compatible endpoint; toklite reduces then
# forwards to Groq with your key (never stored). The extra "openai/" is aider's
# provider tag — the model actually sent to Groq is "$GROQ_MODEL".
export OPENAI_API_KEY="$GROQ_API_KEY"
export OPENAI_API_BASE="http://127.0.0.1:8787/v1"

echo "aider -> toklite -> Groq ($GROQ_MODEL). If aider warns the model is unknown, that's harmless — continue." >&2
exec toklite run -- aider --model "openai/${GROQ_MODEL}" "$@"
