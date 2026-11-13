// recovery.js — pure recovery score from MANUAL inputs (no device/health APIs,
// so it works on cloud test devices and is fully unit-testable).

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

/**
 * Score 0-100 from sleep hours, soreness (1-10), and resting heart rate.
 * Higher sleep = better; higher soreness/restingHr = worse.
 */
export function recoveryScore({ sleepHours, soreness, restingHr }) {
  const sleep = clamp(num(sleepHours) / 8, 0, 1) * 45;          // up to 45
  const sore = clamp((10 - num(soreness)) / 9, 0, 1) * 35;      // up to 35
  const hr = clamp((100 - num(restingHr)) / 40, 0, 1) * 20;     // up to 20 (60bpm→full)
  const score = Math.round(clamp(sleep + sore + hr, 0, 100));
  return { score, label: labelFor(score), advice: adviceFor(score) };
}

function labelFor(s) {
  if (s >= 80) return 'Fresh';
  if (s >= 60) return 'Ready';
  if (s >= 40) return 'Moderate';
  return 'Rest';
}
function adviceFor(s) {
  if (s >= 80) return 'Great to go — push hard today.';
  if (s >= 60) return 'Good to train at your normal intensity.';
  if (s >= 40) return 'Train light or focus on technique.';
  return 'Prioritise rest and recovery today.';
}
