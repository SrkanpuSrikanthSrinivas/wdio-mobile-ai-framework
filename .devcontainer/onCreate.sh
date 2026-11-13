#!/usr/bin/env bash
# Runs once when the Codespace is created (and cached in prebuilds). Installs the
# AI tools so participants open the Codespace and are immediately ready.
set -e
echo "Installing uv + aider + toklite ..."
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"
uv tool install --python 3.12 aider-chat
npm install -g toklite js-tiktoken
echo "Done. Add your Groq key to .env, then: npm run ai:groq"
