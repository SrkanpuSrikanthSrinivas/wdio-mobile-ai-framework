# Lab 03 — Challenges: keep going for the rest of the session

Extend the GymProgress tests with the AI (`npm run ai:groq`). For each: instruct
aider, review it, `npm run validate`, then run on the dashboard
(`npm run android:cloud`). Follow `CONVENTIONS.md`. Demo account: `demo@gym.com` /
`Password123`.

## Warm-up
1. **Empty sign-up** — submit sign up with a blank name; assert the error shows.
2. **Short password** — sign up with a 3-character password; assert it's rejected.
3. **Wrong email at login** — sign in with an unknown email; assert "Invalid…".

## Build it out
4. **Sign up then use the app** — sign up a fresh account, then log a workout and
   assert the count reads 1.
5. **Two workouts** — after login, log two workouts and assert the count reads 2.
6. **Log out** — after login, tap Log out and assert you're back on the Landing
   screen (`~text-landing-title`).

## Stretch
7. **Screen-object method** — ask the AI to add a `loginAsDemo()` helper (landing →
   signin → home) and use it to shorten a test.
8. **Data-driven sign-up** — try three invalid sign-ups (bad email, mismatched
   passwords, short password) in a loop and assert each is rejected.
9. **Your own idea** — pick any GymProgress flow and have the AI write a test.

## Reflection (last 10 min)
- Where did the AI save you time? Where did you correct it?
- `npm run tok:stats` — how much did toklite save?
- Show your favourite test running on the dashboard.
