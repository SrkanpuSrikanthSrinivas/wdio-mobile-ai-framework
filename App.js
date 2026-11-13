import { useState } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, StatusBar,
} from 'react-native';
import { validateWorkout, summarize } from './src/logic';

/**
 * GymProgress — a tiny workout logger used as the app-under-test.
 *
 * Every interactive element sets testID + accessibilityLabel to the SAME value.
 * On Android, Appium sees accessibilityLabel as the accessibility id, so the
 * tests locate elements with `~<id>` (e.g. `~input-exercise`). The screen object
 * in test/screenobjects/gym.screen.js uses exactly these ids.
 */
export default function App() {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState('');
  const [workouts, setWorkouts] = useState([]);

  const add = () => {
    const check = validateWorkout({ exercise, sets, reps });
    if (!check.valid) {
      setError(check.error);
      return;
    }
    setError('');
    setWorkouts((prev) => [{ exercise, sets, reps, key: String(Date.now()) }, ...prev]);
    setExercise(''); setSets(''); setReps('');
  };

  const clear = () => { setWorkouts([]); setError(''); };

  const last = workouts[0] ? summarize(workouts[0]) : '';

  const A = (id) => ({ testID: id, accessibilityLabel: id, accessible: true });

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title} {...A('text-title')}>GymProgress</Text>

      <TextInput style={styles.input} placeholder="Exercise (e.g. Squats)"
        value={exercise} onChangeText={setExercise} {...A('input-exercise')} />
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.half]} placeholder="Sets" keyboardType="numeric"
          value={sets} onChangeText={setSets} {...A('input-sets')} />
        <TextInput style={[styles.input, styles.half]} placeholder="Reps" keyboardType="numeric"
          value={reps} onChangeText={setReps} {...A('input-reps')} />
      </View>

      <TouchableOpacity style={styles.btn} onPress={add} {...A('button-add')}>
        <Text style={styles.btnText}>Add Workout</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error} {...A('text-error')}>{error}</Text> : null}

      <Text style={styles.count} {...A('text-count')}>Workouts logged: {workouts.length}</Text>
      {last ? <Text style={styles.last} {...A('text-last')}>Last: {last}</Text> : null}

      <FlatList
        style={styles.list}
        data={workouts}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Text style={styles.item} {...A('row-workout')}>{summarize(item)}</Text>
        )}
      />

      <TouchableOpacity style={styles.clear} onPress={clear} {...A('button-clear')}>
        <Text style={styles.clearText}>Clear All</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f172a', padding: 20, paddingTop: 60 },
  title: { color: '#93c5fd', fontSize: 30, fontWeight: '700', marginBottom: 18 },
  input: { backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: 8, padding: 12, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  btn: { backgroundColor: '#2563eb', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  error: { color: '#f87171', marginTop: 10 },
  count: { color: '#e2e8f0', fontSize: 16, marginTop: 18 },
  last: { color: '#a7f3d0', marginTop: 4 },
  list: { marginTop: 10 },
  item: { color: '#cbd5e1', paddingVertical: 6, borderBottomColor: '#1e293b', borderBottomWidth: 1 },
  clear: { padding: 12, alignItems: 'center' },
  clearText: { color: '#94a3b8' },
});
