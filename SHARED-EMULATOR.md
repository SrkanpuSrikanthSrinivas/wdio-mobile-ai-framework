# Shared emulator everyone watches (Docker)

One machine runs an Android emulator + Appium in Docker. Everyone connects to it
to run tests, and everyone watches the phone **live in a browser** (noVNC). No
cloud service, no per-person Android install.

## The one requirement: an x86_64 Linux host with KVM
The emulator image is Intel/AMD only and needs hardware acceleration (`/dev/kvm`).
So the **host** must be one of:
- an Intel/AMD **Linux PC** (a spare laptop/desktop, or a venue machine), or
- a **cloud Linux VM that allows nested virtualization** — Azure `Dv5`/`Dv4`/`Dv3`
  or GCP with nested virt enabled are the reliable choices. (Most basic AWS EC2
  and DigitalOcean droplets do **not** allow KVM — pick a nested-virt VM.)

**Your Apple Silicon Mac cannot be the host** (no x86 KVM through Docker). It can
still be a **client** that connects to the Linux host, same as everyone else.

## 1. Host setup (do once, on the Linux host)
```bash
# Docker must be installed. Confirm KVM is available:
ls -l /dev/kvm            # should exist; if missing, enable virtualization

# start the shared emulator
docker compose up -d

# watch it boot (locally on the host, or from any browser):
#   http://<HOST-IP>:6080         (Android home screen appears in ~1-2 min)

# open the firewall so the room can reach it:
#   inbound TCP 6080 (watch) and 4723 (tests)
```
Find `<HOST-IP>`: on the host run `hostname -I` (LAN) or use the VM's public IP.

## 2. Everyone connects (including Macs)
Each participant needs the WDIO client once (light — no local Appium, it's in the
container):
```bash
npm install
```
Then point at the host and run:
```bash
export APPIUM_HOST=<HOST-IP>      # the Linux host's IP
npm run android
```
And open the live screen in a browser so the room sees it happen:
```
http://<HOST-IP>:6080
```

## 3. "Everyone runs" — how it actually works
One emulator runs **one test at a time**. Everyone can **watch** the same screen
at once, but runs don't overlap. Two easy patterns:

- **Watch together (simplest):** you (or volunteers) run `npm run android` one at
  a time while the whole room watches `:6080`. Everyone already did the hands-on
  editing; this is the shared "it's really running" moment.
- **Parallel groups:** run more than one emulator. Uncomment `android2` in
  `docker-compose.yml` (watch `:6081`, connect `APPIUM_HOST=<HOST-IP> APPIUM_PORT=4724`),
  copy it for `android3`, etc. Each container needs ~2-4 GB RAM and a KVM slot, so
  a beefy host handles a handful — split the room across them.

## 4. Quick check before the workshop
On the host: `docker compose up -d`, open `http://<HOST-IP>:6080`, wait for the
home screen. From another machine: `APPIUM_HOST=<HOST-IP> npm run android` and
confirm the test drives the app on the shared screen.

## Reset between sessions
```bash
docker compose restart      # fresh emulator state
```
