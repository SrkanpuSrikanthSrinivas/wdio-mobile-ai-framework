export function uniqueEmail(prefix = 'user') {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}.${stamp}${rand}@example.test`;
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim());
}

export function passwordStrength(pw) {
  const s = String(pw ?? '');
  if (s.length < 8) return 0;
  let score = 1;
  if (/[A-Z]/.test(s) && /[a-z]/.test(s)) score++;
  if (/\d/.test(s)) score++;
  if (/[^A-Za-z0-9]/.test(s)) score++;
  return score;
}

export function entryVolume({ sets, reps, weight }) {
  return Math.max(0, sets) * Math.max(0, reps) * Math.max(0, weight);
}

export function weeklyVolume(entries) {
  return entries.reduce((sum, e) => sum + entryVolume(e), 0);
}

export function recoveryScore(sleepHours, sessionsLast3Days) {
  const sleep = Math.min(Math.max(sleepHours, 0), 9) / 9;
  const load = Math.min(sessionsLast3Days, 3) / 3;
  return Math.round(100 * (0.7 * sleep + 0.3 * (1 - load)));
}

export function recoveryAdvice(score) {
  if (score < 40) return 'Take a rest day';
  if (score < 70) return 'Train light today';
  return 'Ready to train';
}
