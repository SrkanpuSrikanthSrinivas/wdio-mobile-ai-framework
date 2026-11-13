# App map — WebdriverIO native demo app v2.2.0 (Android)

The ONLY locators and texts that exist in the app under test. Tests may use
nothing that isn't listed here. If a test needs something missing, stop and ask;
never guess a selector. (Texts verified from the app bundle; ids from the passing
screen objects.)

## Bottom tabs  → `Screen.openTab(name)`
| Tab | Locator |
| --- | --- |
| Home | `~Home` |
| Webview | `~Webview` |
| Login | `~Login` |
| Forms | `~Forms` |
| Swipe | `~Swipe` |
| Drag | `~Drag` |

## Login tab  → `test/screenobjects/login.screen.js`
The tab has two modes, switched by two buttons at the top.

| Element | Locator | Mode |
| --- | --- | --- |
| "Login" mode button | `~button-login-container` | both |
| "Sign up" mode button | `~button-sign-up-container` | both |
| Email field | `~input-email` | both |
| Password field | `~input-password` | both |
| Repeat password field | `~input-repeat-password` | Sign up only |
| LOGIN button | `~button-LOGIN` | Login |
| SIGN UP button | `~button-SIGN UP` | Sign up |

### What the app does
| Action | Result |
| --- | --- |
| Valid email + password ≥ 8 chars, tap LOGIN | Native alert, title "Success", message **"You are logged in!"** |
| Valid email + matching passwords ≥ 8 chars, tap SIGN UP | Native alert, title "Signed Up!", message **"You successfully signed up!"** |
| Invalid email, tap LOGIN or SIGN UP | On-screen text **"Please enter a valid email address"**, no alert |
| Password shorter than 8, tap LOGIN or SIGN UP | On-screen text **"Please enter at least 8 characters"**, no alert |
| Repeat password differs (Sign up) | On-screen text **"Please enter the same password"**, no alert |

Any email/password that passes validation "logs in" — there is no real backend.
Validation texts have no accessibility id: use `LoginScreen.validationMessage(text)`.

## Forms tab  → `test/screenobjects/forms.screen.js`
| Element | Locator |
| --- | --- |
| Text input | `~input-text` |
| Typed-text echo | `~input-text-result` |
| Switch | `~switch` |
| Dropdown | `~Dropdown` |
| Active button | `~button-Active` |
| Inactive button | `~button-Inactive` |

Texts: switch hint **"Click to turn the switch ON"** / **"...OFF"**; Active button
opens an alert **"This button is active"**.
