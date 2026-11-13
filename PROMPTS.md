# Demo prompts for the AI-CLI — GymProgress

Each prompt names the file, the steps and the exact expected text (from APP-MAP.md).

## Start aider with the files it may edit
```bash
npm run ai:gemini -- test/specs/<new-file>.spec.js test/screenobjects/home.screen.js
# backups: npm run ai:groq -- ...  (8K tokens/min: /clear between prompts)  |  npm run ai:local -- ...
```

## Prompt A — sign up  (`test/specs/signup.new.spec.js`)
> Create test/specs/signup.new.spec.js. From Landing go to Sign up. Test 1: sign up with
> buildSignup({ name: 'Riya Shah' }) and assert the welcome header reads 'Hi, Riya Shah'.
> Test 2: mismatched passwords show the sign-up error 'Passwords do not match'.
> Follow CONVENTIONS.md and APP-MAP.md.

## Prompt B — sign-in validation  (`test/specs/signin.validation.spec.js`)
> Create test/specs/signin.validation.spec.js. From Landing go to Sign in. Test 1: a wrong
> password shows the error 'Invalid email or password'. Test 2: the email 'not-an-email'
> shows 'Enter a valid email'. Follow CONVENTIONS.md and APP-MAP.md.

## Prompt C — log a workout  (`test/specs/log.workout.spec.js`)
> Create test/specs/log.workout.spec.js. Sign in with DEMO, then log 'Squats' with one set
> of 10 reps at 50 using HomeScreen.logStrength, and assert the entry count reads
> 'Workouts logged: 1'. Follow CONVENTIONS.md and APP-MAP.md.

## Run what it wrote
```bash
npm run run:local -- test/specs/<new-file>.spec.js
npm run run:cloud -- test/specs/<new-file>.spec.js
```
If it goes wrong live: `/undo` in aider, or `git reset --hard demo-start`.
