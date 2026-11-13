# Fastest way: run it in the browser (GitHub Codespaces — nothing to install)

If local setup is slow, don't install anything. Open the project in a
**Codespace** — a ready-made environment in your browser with aider, toklite,
and everything already installed. You only add your Groq key.

## For each participant
1. On GitHub, open your fork of the project.
2. Click the green **Code** button → **Codespaces** tab → **Create codespace on
   main**. A browser editor + terminal opens (first time takes a minute).
3. In the terminal, add your Groq key and start editing:
   ```bash
   echo 'GROQ_API_KEY=gsk_your_or_the_shared_key' > .env
   npm run ai:groq
   ```
4. When you've edited a test, run it on a real phone:
   ```bash
   git add -A && git commit -m "my test" && git push
   ```
   Then open the **Actions** tab to watch it and download the `demo.mp4`.

That's it — no Node, no Python, no aider install on your laptop.

## For the host — make it instant (do this once)
Turn on **prebuilds** so Codespaces start in seconds instead of building each time:
- On the repo: **Settings → Codespaces → Prebuilds → Set up prebuild** for the
  `main` branch. GitHub builds the environment ahead of time and caches it.

## Good to know
- Codespaces needs a GitHub account (participants need one anyway to run the phone
  in Actions). Free accounts include a monthly pool of Codespaces hours — a 2-hour
  workshop uses only a few.
- Everyone gets the **same** environment, so "works on my machine" problems vanish.
- The setup lives in `.devcontainer/` (it installs uv + aider + toklite).
