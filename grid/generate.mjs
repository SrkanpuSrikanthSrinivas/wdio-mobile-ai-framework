// generate.mjs — build a self-hosted mini device-grid: N Android emulators
// (each with Appium + a live noVNC screen) plus a dashboard that shows them all.
//
//   node grid/generate.mjs 5      # make a grid of 5 emulators
//
// Writes grid/docker-compose.yml and grid/dashboard.html. Then on an x86 Linux
// host with KVM:   cd grid && docker compose up -d
// Open grid/dashboard.html in a browser to watch all screens at once.

import { writeFileSync } from 'node:fs';

const n = Math.max(1, Math.min(20, parseInt(process.argv[2] || '4', 10)));
const APPIUM_BASE = 4723;   // 4723, 4724, ...
const VNC_BASE = 6080;      // 6080, 6081, ...

// --- docker-compose.yml ---
let services = '';
for (let i = 0; i < n; i++) {
  const appium = APPIUM_BASE + i, vnc = VNC_BASE + i;
  services += `
  android-${i + 1}:
    image: budtmo/docker-android:emulator_11.0
    privileged: true
    ports:
      - "${vnc}:6080"      # watch device ${i + 1}
      - "${appium}:4723"   # Appium for device ${i + 1}
    devices:
      - /dev/kvm:/dev/kvm
    environment:
      - EMULATOR_DEVICE=Samsung Galaxy S10
      - WEB_VNC=true
      - APPIUM=true
    shm_size: "2gb"
`;
}
writeFileSync('grid/docker-compose.yml',
`# Auto-generated: a grid of ${n} Android emulators. Run on an x86_64 Linux host
# with KVM:   cd grid && docker compose up -d
# Each device: watch at :${VNC_BASE}.. , tests connect at :${APPIUM_BASE}..
services:${services}`);

// --- dashboard.html (a live wall of all emulator screens) ---
const tiles = Array.from({ length: n }, (_, i) => {
  const appium = APPIUM_BASE + i, vnc = VNC_BASE + i;
  return `    <div class="tile">
      <div class="label">Device ${i + 1} &middot; APPIUM_PORT=${appium}</div>
      <iframe data-vnc="${vnc}" src="about:blank" loading="lazy"></iframe>
    </div>`;
}).join('\n');

writeFileSync('grid/dashboard.html',
`<!doctype html><html><head><meta charset="utf-8"><title>Device Grid</title>
<style>
  body{font-family:system-ui,sans-serif;margin:0;background:#0f172a;color:#e2e8f0}
  header{padding:12px 16px;background:#1e293b;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
  header input{padding:6px 10px;border-radius:6px;border:1px solid #475569;background:#0f172a;color:#e2e8f0;width:220px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px;padding:12px}
  .tile{background:#1e293b;border-radius:10px;overflow:hidden;display:flex;flex-direction:column}
  .label{padding:6px 10px;font-size:13px;color:#93c5fd}
  iframe{width:100%;height:520px;border:0;background:#000}
  a{color:#93c5fd}
</style></head><body>
<header>
  <strong>Device Grid (${n})</strong>
  <label>Host IP: <input id="host" placeholder="e.g. 10.0.0.5" /></label>
  <button onclick="connect()">Show screens</button>
  <span id="hint">Enter the emulator host's IP, then "Show screens".</span>
</header>
<div class="grid">
${tiles}
</div>
<script>
  function connect(){
    var host=document.getElementById('host').value.trim();
    if(!host){document.getElementById('hint').textContent='Please enter the host IP.';return;}
    document.querySelectorAll('iframe[data-vnc]').forEach(function(f){
      f.src='http://'+host+':'+f.getAttribute('data-vnc');
    });
    document.getElementById('hint').textContent='Connected to '+host;
    try{localStorage.setItem('gridHost',host);}catch(e){}
  }
  try{var h=localStorage.getItem('gridHost'); if(h){document.getElementById('host').value=h; connect();}}catch(e){}
</script>
</body></html>`);

console.log(`Wrote grid/docker-compose.yml and grid/dashboard.html for ${n} emulators.`);
console.log(`Appium ports: ${APPIUM_BASE}..${APPIUM_BASE + n - 1}   noVNC ports: ${VNC_BASE}..${VNC_BASE + n - 1}`);
