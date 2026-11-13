# App map — GymProgress (Android)

The ONLY locators and texts that exist in the app under test, taken from the app
source (`app/src/screens`). Every element sets `testID` = `accessibilityLabel`, so
Appium finds it as `~<id>`. Tests may use nothing that isn't listed here. If a
test needs something missing, stop and ask; never guess a selector.

## Flow
Landing → Sign in (or Sign up) → Main app with tabs Log · Stats · Recovery.
There are **no native alerts**: success means the next screen appears; failure
shows an inline error text.

## Landing  → `landing.screen.js`
| Element | Locator |
| --- | --- |
| Title | `~text-landing-title` |
| "Sign up" button | `~button-goto-signup` |
| "Sign in" button | `~button-goto-signin` |

## Sign in  → `signin.screen.js`
| Element | Locator |
| --- | --- |
| Title | `~text-signin-title` |
| Email | `~input-email` |
| Password | `~input-password` |
| Sign in button | `~button-signin` |
| Error text | `~text-signin-error` |
| Demo-account hint | `~text-demo-hint` |
| Back link | `~link-back-landing` |

Demo account (always exists): **demo@gym.com / Password123** → `DEMO` in `test/helpers/data.js`.

| Action | Result |
| --- | --- |
| Demo account, tap Sign in | Main app; `~text-welcome` reads **"Hi, Demo User"** |
| Wrong password | `~text-signin-error` = **"Invalid email or password"** |
| Invalid email | `~text-signin-error` = **"Enter a valid email"** |
| Empty password | `~text-signin-error` = **"Password is required"** |

## Sign up  → `signup.screen.js`
| Element | Locator |
| --- | --- |
| Title | `~text-signup-title` |
| Name / Email / Password / Confirm | `~input-name` `~input-email` `~input-password` `~input-confirm` |
| Sign up button | `~button-signup` |
| Error text | `~text-signup-error` |

| Action | Result |
| --- | --- |
| Valid, new email | Main app; `~text-welcome` reads **"Hi, <name>"** |
| Passwords differ | **"Passwords do not match"** |
| Password under 6 chars | **"Password must be at least 6 characters"** |
| Invalid email | **"Enter a valid email"** |
| Empty name | **"Name is required"** |
| Email already used | **"An account with that email already exists"** |

## Main app  → `home.screen.js`
| Element | Locator |
| --- | --- |
| Welcome header | `~text-welcome` ("Hi, <name>") |
| Log out | `~button-logout` |
| Tabs | `~tab-log` `~tab-stats` `~tab-recovery` |

### Log tab
| Element | Locator |
| --- | --- |
| Title | `~text-log-title` |
| Exercise name | `~input-exercise` |
| Set reps / weight | `~input-set-reps` `~input-set-weight` |
| Add set | `~button-add-set` |
| Sets added | `~text-set-count` |
| Save entry | `~button-save-entry` |
| Entries count | `~text-entry-count` (**"Workouts logged: N"**) |
| Last entry | `~text-last-entry` |
| Error text | `~text-error` |
| Clear all | `~button-clear` |
| Cardio fields | `~input-duration` `~input-distance` `~input-incline` `~input-resistance` |
| Note | `~input-note` `~button-pin-note` `~text-pinned-note` |
| Entry / set rows, delete | `~row-entry` `~row-set` `~button-delete-entry` |

Errors: "Exercise name is required", "Add at least one set", "Reps must be a positive
number", "Weight must be 0 or more", "Duration must be a positive number".

### Stats tab  → `stats.screen.js`
`~text-stats-title` `~text-total-workouts` `~text-total-volume` `~input-best-lift`
`~input-bodyweight` `~button-rate` `~text-strength-rating` `~chart-progress` `~text-progress-summary`

### Recovery tab  → `recovery.screen.js`
`~text-recovery-title` `~input-sleep` `~input-soreness` `~input-resting-hr`
`~button-calc-recovery` `~text-recovery-score` `~text-recovery-label` `~text-recovery-advice`

### Legacy ids (older single-screen layout, still in source)
`~button-add` `~text-count` `~text-last` `~row-workout` `~input-sets` `~input-reps`
