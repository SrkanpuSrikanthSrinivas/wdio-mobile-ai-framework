import { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { S, C } from '../theme';
import Chips from '../components/Chips';
import ProgressChart from '../components/ProgressChart';
import { muscleSummary, totals, topWeightSeries, strengthRating, STANDARDS } from '../stats';

const A = (id) => ({ testID: id, accessibilityLabel: id, accessible: true });

export default function StatsScreen({ entries }) {
  const [bodyweight, setBodyweight] = useState('');
  const [best, setBest] = useState('');
  const [lift, setLift] = useState('Squat');
  const [rating, setRating] = useState(null);

  const t = totals(entries);
  const byMuscle = muscleSummary(entries);
  const firstExercise = entries.find((e) => e.type !== 'cardio')?.exercise;
  const series = firstExercise ? topWeightSeries(entries, firstExercise) : [];

  const rate = () => setRating(strengthRating(lift, bodyweight, best));

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.pad}>
      <Text style={S.h1} {...A('text-stats-title')}>Stats</Text>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
        <View style={[S.card, { flex: 1 }]}>
          <Text style={{ color: C.muted, fontSize: 12 }}>Workouts</Text>
          <Text style={{ color: C.text, fontSize: 24, fontWeight: '700' }} {...A('text-total-workouts')}>{t.workouts}</Text>
        </View>
        <View style={[S.card, { flex: 1 }]}>
          <Text style={{ color: C.muted, fontSize: 12 }}>Total volume</Text>
          <Text style={{ color: C.text, fontSize: 24, fontWeight: '700' }} {...A('text-total-volume')}>{t.volume}</Text>
        </View>
      </View>

      <Text style={[S.h2, { marginTop: 22 }]}>By muscle group</Text>
      {Object.keys(byMuscle).length === 0
        ? <Text style={{ color: C.muted, marginTop: 8 }}>Log a workout to see muscle stats.</Text>
        : Object.entries(byMuscle).map(([m, v]) => (
          <View key={m} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomColor: C.border, borderBottomWidth: 1 }}>
            <Text style={{ color: C.text }}>{m}</Text>
            <Text style={{ color: C.muted }} {...A(`stat-${m}`)}>{v.sets} sets · {v.volume} vol</Text>
          </View>
        ))}

      <Text style={[S.h2, { marginTop: 22 }]}>Progress {firstExercise ? `· ${firstExercise}` : ''}</Text>
      <View style={{ marginTop: 10 }}>
        <ProgressChart series={series} />
      </View>

      <Text style={[S.h2, { marginTop: 22 }]}>Strength standards</Text>
      <Text style={S.label}>Lift</Text>
      <Chips options={Object.keys(STANDARDS)} value={lift} onChange={setLift} idPrefix="chip-lift" />
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
        <TextInput style={[S.input, { flex: 1 }]} keyboardType="numeric" placeholder="Bodyweight" placeholderTextColor={C.muted}
          value={bodyweight} onChangeText={setBodyweight} {...A('input-bodyweight')} />
        <TextInput style={[S.input, { flex: 1 }]} keyboardType="numeric" placeholder="Best lift" placeholderTextColor={C.muted}
          value={best} onChangeText={setBest} {...A('input-best-lift')} />
      </View>
      <TouchableOpacity style={S.btnPrimary} onPress={rate} {...A('button-rate')}>
        <Text style={S.btnPrimaryText}>Rate my lift</Text>
      </TouchableOpacity>
      {rating ? (
        <Text style={{ color: C.primary, fontSize: 18, marginTop: 12 }} {...A('text-strength-rating')}>
          {rating.rating} ({rating.ratio}x bodyweight)
        </Text>
      ) : null}
    </ScrollView>
  );
}
