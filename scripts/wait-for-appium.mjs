// wait-for-appium.mjs — block until the emulator + Appium are ready (CI/local).
// Polls Appium 2's /status until it answers, up to ~5 minutes.
const host = process.env.APPIUM_HOST || '127.0.0.1';
const port = process.env.APPIUM_PORT || '4723';
const base = `http://${host}:${port}`;
const deadline = Date.now() + 5 * 60 * 1000;

async function ready() {
  try {
    const r = await fetch(`${base}/status`, { signal: AbortSignal.timeout(4000) });
    return r.ok;
  } catch {
    return false;
  }
}

console.log(`Waiting for Appium at ${base}/status ...`);
while (Date.now() < deadline) {
  if (await ready()) {
    console.log('Appium is ready.');
    process.exit(0);
  }
  await new Promise((r) => setTimeout(r, 5000));
  process.stdout.write('.');
}
console.error('\nAppium did not become ready in time.');
process.exit(1);
