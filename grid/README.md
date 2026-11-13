# Self-hosted device grid (a simple mini-BrowserStack)

Run several Android emulators on one machine so people can run tests **in
parallel**, and watch **all the screens at once** on a dashboard page. No paid
farm. This is the DIY version of BrowserStack — the number of parallel runs =
the number of emulators you start.

## What you need
- **One x86_64 Linux host with KVM** (an Intel/AMD Linux PC, or a cloud Linux VM
  with nested virtualization). Not a Mac — Macs can only be *clients*.
- Rough sizing: each emulator uses **~2–4 GB RAM + ~1 CPU core**. So:
  - 16 GB host → ~3–4 emulators
  - 32 GB host → ~6–8 emulators
  - 64 GB host → ~12–16 emulators
- Docker + docker compose on the host.

## 1. Generate the grid (choose how many emulators)
```bash
node grid/generate.mjs 6        # makes a 6-emulator grid
```
This writes `grid/docker-compose.yml` and `grid/dashboard.html`.
- Appium ports: 4723, 4724, 4725, …
- Watch (noVNC) ports: 6080, 6081, 6082, …

## 2. Start it (on the Linux host)
```bash
cd grid
docker compose up -d
# open the firewall for the port ranges you generated (4723.. and 6080..)
```

## 3. Watch all screens at once
Open `grid/dashboard.html` in any browser (yours or on the projector), type the
host's IP, click **Show screens** — you'll see every emulator live in one grid.
Great for the room to watch runs happen across devices.

## 4. People run — assign a device (port) to each
There's no auto-router in this simple version, so give each person (or small
group) a device number. Device *k* means:
```bash
export APPIUM_HOST=<HOST-IP>
export APPIUM_PORT=<4722 + k>     # device 1 = 4723, device 2 = 4724, ...
npm run android
```
Their test runs on that emulator; everyone watching the dashboard sees it move.
A simple sign-up sheet ("Device 3 → Priya") avoids two people grabbing the same one.

## Scaling / limits
- Parallel runs = number of emulators you started. For 30 people, run as many as
  the host allows and have people take turns per device (each run is ~1–2 min).
- To add capacity, re-run `node grid/generate.mjs <bigger-number>` on a bigger
  host and `docker compose up -d` again.

## Want auto-routing (people don't pick a port)?
That's the next step up: put a **Selenium Grid 4** hub in front and register the
emulators as nodes, so everyone points at one hub URL and the hub assigns a free
device (plus a built-in Grid dashboard). It's more setup and tuning — ask if you
want me to add that; the simple per-port version above is the reliable starting
point.

## Reset between sessions
```bash
cd grid && docker compose restart
```
