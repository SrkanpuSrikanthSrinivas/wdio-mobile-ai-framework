# Lab 02 — The task: write a test with the AI and run it (~45 min)

Your framework is installed (Lab 01). Now do the real work on the **GymProgress**
app. It has a Landing screen, Sign Up, Sign In, and a Home screen where you log
workouts. We already ship `signup.spec.js` and `login.spec.js` — your task is to
extend the login flow, with the AI's help, then run it on a real phone.

**Demo account (seeded, always works):** email `demo@gym.com` / password `Password123`.

---

## Step 1 — Start the AI (through toklite)
```bash
npm run ai:groq
```
**Check:** you're at the `>` prompt inside aider.

## Step 2 — Look before you write (30 seconds)
```
/add test/specs/login.spec.js test/screenobjects/signin.screen.js test/screenobjects/home.screen.js test/helpers/data.js CONVENTIONS.md
/ask What does login.spec cover, and what is the TODO at the bottom asking me to add?
```
**Check:** it explains the sign-in tests and the TODO (sign in, then log a workout
and assert the count reads 1).

## Step 3 — Write the test in plain English
```
Complete the TODO in login.spec.js: add a test that signs in with the demo account
(DEMO from data.js), then logs a workout (Squats 3x10) on the home screen and
asserts the count text reads 'Workouts logged: 1'. Reuse the screen objects and
helpers. Follow CONVENTIONS.md.
```
**What happens — the agentic loop:** aider edits the spec, **runs `npm run validate`
itself**, and commits each change. **Check:** validate passes.

## Step 4 — Review it like a teammate's pull request (the real skill)
Open `test/specs/login.spec.js` and read the new test:
- Does it **assert** the count text explicitly?
- Does it reuse the **screen objects** and **DEMO** helper, per CONVENTIONS.md?
- Would you approve it?

If weak, tell the AI to fix it. **Check:** you made one review decision.

## Step 5 — Confirm and see the git trail
```
/run npm run validate
/run git log --oneline -5
/exit
```

## Step 6 — Run it on a real phone (the dashboard moment)
```bash
npm run android:cloud
```
Your session appears on the host's dashboard with your name, live video, and a
recording. **Check:** your run shows up green.

## Step 7 — See what toklite saved
```bash
npm run tok:stats
```

---

## Done when
Your "sign in then log a workout" test is written, reviewed, valid, and green on
the dashboard. Faster than the room? Head to **Lab 03 — Challenges**.
