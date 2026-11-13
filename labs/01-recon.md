# Lab 01 — Recon: understand the framework with the AI (~15 min)

Before changing any test, use the AI to *understand* the code — the screens,
selectors, and what's already covered. The skill here is asking the AI the right
questions from your terminal. This is how you'd approach any unfamiliar codebase.

---

## Step 1 — Start the AI (through toklite)
```bash
npm run ai:groq
```
**What happens:** this launches **aider** (the AI assistant) routed through
**toklite** (the token saver). You'll see toklite say it's listening on
`127.0.0.1:8787`, then aider opens an interactive prompt.
**Check:** you're at the `>` prompt inside aider.

## Step 2 — Learn the four commands you'll use
Inside aider, you mostly use these:
- `/add <files>` — let the AI see specific files.
- `/ask <question>` — ask about the code **without** letting it edit.
- `/run <command>` — run a shell command and feed the output back to the AI.
- `/exit` — leave aider.

Type them as shown, then your text.

## Step 3 — Let the AI see the key files (read them in)
```
/add test/screenobjects/login.screen.js test/specs/login.spec.js CONVENTIONS.md
```
**What this does:** puts these files in the AI's view so its answers are grounded
in *your* code, not guesses. **Check:** aider lists the files it added.

## Step 4 — Ask what the code does
```
/ask In two or three bullets, what does the login spec test today, and what does
the login screen object provide?
```
**Why `/ask`:** it analyzes and explains but makes **no edits** — perfect for
learning. **Check:** it summarizes the login test + the screen object's methods.

## Step 5 — Ask what's missing (the gap you'll fill next)
```
/ask Which realistic login/sign-up cases are NOT covered yet? Give a short list.
```
**Check:** it should point out gaps like the sign-up flow and empty-field
validation. Pick one you'll add in Lab 02.

## Step 6 — See how your standards shape the AI
```
/ask According to CONVENTIONS.md, what rules must any new test follow here?
```
**Check:** it repeats your rules (use accessibility ids, always assert, no fixed
sleeps). This is *rules-as-a-file* — your standards live in the repo and the AI
follows them automatically.

## Step 7 — Leave aider
```
/exit
```

---

## Discuss (2 min)
- The AI could answer because the whole repo is reachable from your terminal — no
  copy-pasting into a browser. That's the power of an AI *CLI*.
- Selectors like `~input-email` are **accessibility ids** — stable, readable
  locators that survive UI changes better than XPath.

## Done when
You can name one missing test case you'll add next (e.g., the sign-up flow).
