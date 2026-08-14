# Free way: run the phone in GitHub Actions (no local install, no account)

This runs the Android emulator in GitHub's cloud. Nothing runs on your laptop,
and there's no device-farm account. On every push it boots a phone, runs your
AI-edited tests, and gives you back a **video of the phone** plus logs.

## One requirement
GitHub Actions only runs when the repo is on **GitHub**. If yours is on GitLab,
push a copy to GitHub:
```bash
# create an empty repo on github.com first, then:
git remote add github https://github.com/<you>/wdio-mobile-ai-lab.git
git push github main
```

## How to use it
- It runs automatically on every `git push`.
- Or run it on demand: on GitHub, go to **Actions → "Android E2E (emulator in the
  cloud)" → Run workflow**.

## Where to watch / what you get
1. Open the **Actions** tab and click the running job to watch the live logs
   (emulator booting, Appium starting, the test running).
2. When it finishes, scroll to **Artifacts** and download **android-results** —
   it contains `demo.mp4` (a screen recording of the phone), `appium.log`, and
   any failure screenshots. Play `demo.mp4` to show the test driving the app.

## How the workshop flows with this
- Participants edit tests locally with the AI (`npm run ai` / `npm run ai:groq`)
  and validate instantly (`npm run validate`) — all light, no emulator.
- They `git push`, and the phone run happens in the cloud. Everyone can push at
  once (GitHub runs jobs in parallel on the free tier, within monthly minutes).
- For a live demo, you can also click **Run workflow** and narrate the logs, then
  show the `demo.mp4` afterwards.

## For participants — run it on YOUR OWN account (recommended for a room)

Actions runs are billed to whoever owns the repo where the push happens. So if
everyone forks the project, each person's runs use **their own** free minutes and
run in parallel — no bottleneck on the host's account, and no one needs write
access to the host's repo.

Each participant does this once:

1. **Get a GitHub account** (free) and sign in: https://github.com
2. **Fork the project.** Open the host's repo and click **Fork** (top-right) →
   **Create fork**. You now have your own copy at
   `github.com/<your-username>/wdio-mobile-ai-lab`.
3. **Enable Actions on your fork.** Forks have Actions **off by default**. Open
   your fork → **Actions** tab → click the green **"I understand my workflows,
   go ahead and enable them."** button. (One time only.)
4. **Connect your laptop to your fork:**
   ```bash
   git clone https://github.com/<your-username>/wdio-mobile-ai-lab.git
   cd wdio-mobile-ai-lab
   npm install
   ```
5. **Edit a test with the AI** (see the labs), then push:
   ```bash
   git add -A
   git commit -m "my AI-edited test"
   git push
   ```
6. **Watch it run.** On your fork → **Actions** tab → click the running job to
   watch the emulator boot and your test run. When it finishes, open
   **Artifacts** and download **android-results** → play `demo.mp4` to see your
   test drive the phone.

You can also trigger a run without pushing: **Actions → "Android E2E (emulator in
the cloud)" → Run workflow**.

> If you don't want to make a GitHub account, you can still do the whole editing
> part locally (`npm run ai`, `npm run validate`) and watch the host run the test
> on the shared screen.

## Notes
- The workflow file is `.github/workflows/android.yml`.
- The emulator uses `x86_64` (GitHub's runners are Intel) with KVM acceleration —
  this is the runner's architecture, unrelated to your Mac being Apple Silicon.
- Free GitHub accounts include a monthly pool of Actions minutes; a short mobile
  run uses only a few. Private repos draw from that pool; public repos are free.
