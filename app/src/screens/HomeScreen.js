import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { S, C } from '../theme';
import { validateWorkout, summarize } from '../validation';

const A = (id) => ({ testID: id, accessibilityLabel: id, accessible: true });

export default function HomeScreen({ user, onLogout }) {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState('');
  const [workouts, setWorkouts] = useState([]);

  const add = () => {
    const check = validateWorkout({ exercise, sets, reps });
    if (!check.valid) { setError(check.error); return; }
    setError('');
    setWorkouts((prev) => [{ exercise, sets, reps, key: String(Date.now() + Math.random()) }, ...prev]);
    setExercise(''); setSets(''); setReps('');
  };
  const clear = () => { setWorkouts([]); setError(''); };
  const last = workouts[0] ? summarize(workouts[0]) : '';

  return (
    <View style={[S.screen, S.pad, { paddingTop: 56 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={S.h1} {...A('text-welcome')}>Hi, {user?.name || 'Athlete'}</Text>
        <TouchableOpacity onPress={onLogout} {...A('button-logout')}>
          <Text style={{ color: C.muted }}>Log out</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ color: C.muted, marginTop: 4, marginBottom: 16 }}>Log today's workout</Text>

      <View style={S.card}>
        <TextInput style={S.input} placeholder="Exercise (e.g. Squats)" placeholderTextColor={C.muted}
          value={exercise} onChangeText={setExercise} {...A('input-exercise')} />
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <TextInput style={[S.input, { flex: 1 }]} placeholder="Sets" placeholderTextColor={C.muted}
            keyboardType="numeric" value={sets} onChangeText={setSets} {...A('input-sets')} />
          <TextInput style={[S.input, { flex: 1 }]} placeholder="Reps" placeholderTextColor={C.muted}
            keyboardType="numeric" value={reps} onChangeText={setReps} {...A('input-reps')} />
        </View>
        <TouchableOpacity style={S.btnPrimary} onPress={add} {...A('button-add')}>
          <Text style={S.btnPrimaryText}>Add Workout</Text>
        </TouchableOpacity>
        {error ? <Text style={S.error} {...A('text-error')}>{error}</Text> : null}
      </View>

      <Text style={{ color: C.text, fontSize: 16, marginTop: 20 }} {...A('text-count')}>
        Workouts logged: {workouts.length}
      </Text>
      {last ? <Text style={{ color: C.primary, marginTop: 4 }} {...A('text-last')}>Last: {last}</Text> : null}

      <FlatList
        style={{ marginTop: 10 }}
        data={workouts}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Text style={{ color: C.muted, paddingVertical: 6, borderBottomColor: C.border, borderBottomWidth: 1 }}
            {...A('row-workout')}>{summarize(item)}</Text>
        )}
      />

      <TouchableOpacity style={{ padding: 12, alignItems: 'center' }} onPress={clear} {...A('button-clear')}>
        <Text style={{ color: C.muted }}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );
}
