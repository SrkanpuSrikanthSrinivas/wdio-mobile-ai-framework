// theme.js — shared colors + style helpers for a clean, modern fitness look.
import { StyleSheet } from 'react-native';

export const C = {
  bg: '#0B1220',
  card: '#151E2E',
  cardAlt: '#1B2740',
  text: '#E5EAF2',
  muted: '#8A96AB',
  primary: '#22C55E',   // energetic green
  primaryDark: '#16A34A',
  accent: '#6366F1',
  danger: '#F87171',
  border: '#243149',
};

export const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  pad: { padding: 24 },
  center: { flex: 1, justifyContent: 'center' },
  brand: { color: C.primary, fontSize: 34, fontWeight: '800', letterSpacing: 0.5 },
  tagline: { color: C.muted, fontSize: 15, marginTop: 6 },
  h1: { color: C.text, fontSize: 26, fontWeight: '700' },
  h2: { color: C.text, fontSize: 18, fontWeight: '600' },
  label: { color: C.muted, fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: C.card, color: C.text, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: C.border, fontSize: 15,
  },
  btnPrimary: { backgroundColor: C.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 18 },
  btnPrimaryText: { color: '#06210F', fontWeight: '800', fontSize: 16 },
  btnOutline: { borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: C.primary },
  btnOutlineText: { color: C.primary, fontWeight: '700', fontSize: 16 },
  link: { color: C.accent, textAlign: 'center', marginTop: 18, fontSize: 14 },
  error: { color: C.danger, marginTop: 12, fontSize: 14 },
  card: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
});
