// stats.js — pure aggregation + strength standards. No UI, fully unit-testable.

export const MUSCLES = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];
export const TYPES = ['strength', 'cardio', 'machine'];

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Volume for one entry = sum(reps*weight) across sets (strength/machine). */
export function entryVolume(entry) {
  if (!entry || entry.type === 'cardio') return 0;
  return (entry.sets || []).reduce((s, set) => s + num(set.reps) * num(set.weight), 0);
}

export function entrySetCount(entry) {
  if (!entry || entry.type === 'cardio') return 0;
  return (entry.sets || []).length;
}

/** Aggregate sets + volume per muscle group. */
export function muscleSummary(entries) {
  const out = {};
  for (const e of entries) {
    const key = e.muscle || 'Other';
    if (!out[key]) out[key] = { sets: 0, volume: 0 };
    out[key].sets += entrySetCount(e);
    out[key].volume += entryVolume(e);
  }
  return out;
}

export function totals(entries) {
  return {
    workouts: entries.length,
    sets: entries.reduce((s, e) => s + entrySetCount(e), 0),
    volume: entries.reduce((s, e) => s + entryVolume(e), 0),
  };
}

/** Top weight per session for one exercise, oldest→newest (for the chart). */
export function topWeightSeries(entries, exercise) {
  return entries
    .filter((e) => e.exercise === exercise && (e.sets || []).length)
    .map((e) => ({ date: e.date, top: Math.max(...e.sets.map((s) => num(s.weight))) }))
    .sort((a, b) => (a.date || 0) - (b.date || 0));
}

// --- Strength standards (ratio of best lift to bodyweight) ---
export const STANDARDS = {
  Squat: [0.75, 1.25, 1.75, 2.25],
  Bench: [0.5, 0.75, 1.25, 1.75],
  Deadlift: [1.0, 1.5, 2.0, 2.5],
};
const LABELS = ['Untrained', 'Novice', 'Intermediate', 'Advanced', 'Elite'];

export function strengthRating(lift, bodyweight, best) {
  const thresholds = STANDARDS[lift];
  const bw = num(bodyweight);
  if (!thresholds || bw <= 0) return { rating: '—', ratio: 0 };
  const ratio = num(best) / bw;
  let idx = 0;
  for (let i = 0; i < thresholds.length; i++) if (ratio >= thresholds[i]) idx = i + 1;
  return { rating: LABELS[idx], ratio: Math.round(ratio * 100) / 100 };
}
