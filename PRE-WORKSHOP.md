# Before the workshop — do this the day before (15 min)

This is a hands-on workshop: you'll set up and run on **your own machine**. The
installs below are the slow part, and conference wifi makes them slower. Please
finish this **before you arrive** so we spend the time building, not installing.
If anything fails, that's fine — come anyway and we'll fix it in the first 10 min.

## 1. Install the tools

**Node 18+ and Git** — if `node --version` and `git --version` print numbers,
you're good. Otherwise install Node from https://nodejs.org and Git from
https://git-scm.com.

**aider (the AI tool)** — install with `uv` so you get the right Python version:
```bash
# macOS / Linux:
curl -LsSf https://astral.sh/uv/install.sh | sh
# Windows (PowerShell):
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

uv tool install --python 3.12 aider-chat
```
Open a **new terminal** and check: `aider --version` should print a version.

**toklite:**
```bash
npm install -g toklite js-tiktoken
```

## 2. Get a free Groq key
Sign in at https://console.groq.com/keys and create a key (starts `gsk_`).
No credit card. Keep it handy — you'll paste it during the workshop.

## 3. Set up GitHub (so you can run the phone in the cloud)
1. Create a free account at https://github.com if you don't have one.
2. Open the workshop repo (link from the organizer) and click **Fork** →
   **Create fork**. You now have your own copy.
3. On **your fork**, open the **Actions** tab and click the green
   **"I understand my workflows, go ahead and enable them"** button. (One time —
   forks have Actions off until you do this.)

## 4. Clone and install
```bash
git clone https://github.com/<your-username>/wdio-mobile-ai-lab.git
cd wdio-mobile-ai-lab
npm install
npm run verify        # should say you're ready (a missing Groq key is fine for now)
```

## You're ready when
`npm run verify` shows Node, Git, aider, and toklite all green, and you have your
Groq key saved and your fork's Actions enabled.

Bring: a laptop, your Groq key, and your GitHub login. See you there!
