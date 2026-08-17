# Lab 02 — Write a test in plain English (~25 min)

Now the main event: tell the AI what test you want, watch it write and check the
code, review it like a teammate's pull request, and run it on a real phone.

---

## Step 1 — Start the AI and add the files you'll change
```bash
npm run ai:groq
```
Then inside aider:
```
/add test/specs/login.spec.js test/screenobjects/login.screen.js test/helpers/data.js
```
**Why these three:** the spec (where the test goes), the screen object (where any
new selectors/actions go), and the data helper (for things like a unique email).
**Check:** aider lists all three as added.

## Step 2 — Ask for a test in plain English
`login.spec.js` has a `TODO` for a sign-up test. Give the AI this instruction:
```
Complete the TODO in login.spec.js: add a test that switches to Sign up, signs up
with a fresh unique email and matching passwords, and asserts the alert contains
'signed up'. Add any needed method to the login screen object. Follow CONVENTIONS.md.
```
**What happens — the agentic loop:** aider edits the spec (and screen object if
needed), then **runs `npm run validate` by itself** to check its work, and commits
each change to git. You'll see it iterate if something fails.
**Check:** it reports the validate step passing and shows the edited file.

## Step 3 — Review before you trust it (this is the real skill)
Open `test/specs/login.spec.js` and read the new test. Ask yourself:
- Does it **assert** something real (not just "it ran")?
- Are the selectors **accessibility ids** (`~...`), per CONVENTIONS.md?
- Is the new logic in the **screen object**, keeping the spec readable?

If anything's weak, tell the AI to fix it, e.g.:
```
The assertion is too loose — make it check the alert text explicitly, and move the
raw selector into the screen object.
```
**Check:** you made at least one review decision (accept or request a change).

## Step 4 — See the git trail
```
/run git log --oneline -5
```
**Why:** every AI edit is its own commit — a reviewable history, just like a
human's work. **Check:** you see commits for the test you just created.

## Step 5 — Confirm it's valid, then leave aider
```
/run npm run validate
/exit
```
**Check:** validate is green (unit tests pass, all specs pass the syntax check).

## Step 6 — Run it on a real phone (the dashboard moment)
```bash
npm run android:cloud
```
**What happens:** WebdriverIO sends your test to BrowserStack, which installs the
app on a real device and runs it. Your session appears on the host's dashboard,
tagged with your name, with live video and a recording.
**Check:** your run shows up green on the dashboard.

## Step 7 — See what toklite saved
```bash
npm run tok:stats
```
**Check:** it shows the tokens (and cost) toklite trimmed during your session.

---

## Discuss (2 min)
- The AI wrote the test *your way* because CONVENTIONS.md is a file it reads —
  change a rule there and its output changes.
- You stayed in control: the AI drafts, **you review**, CI/the run confirms.

## Done when
Your sign-up test is written, reviewed, valid, and has run green on the dashboard.
Keep going with more tests in **Lab 06 — Challenges**.
