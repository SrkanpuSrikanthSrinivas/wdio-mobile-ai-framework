import { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { S, C } from '../theme';
import Chips from '../components/Chips';
import { MUSCLES, TYPES } from '../stats';
import { validateEntry, validateSet, summarize } from '../validation';

const A = (id) => ({ testID: id, accessibilityLabel: id, accessible: true });

export default function LogScreen({ entries, onSave, onDelete, onClear, notes, onSaveNote }) {
  const [exercise, setExercise] = useState('');
  const [muscle, setMuscle] = useState('Legs');
  const [type, setType] = useState('strength');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState([]);            // multi-set batch
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [resistance, setResistance] = useState('');
  const [incline, setIncline] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const pinned = notes[exercise?.trim()];

  const addSet = () => {
    const c = validateSet({ reps, weight });
    if (!c.valid) { setError(c.error); return; }
    setError('');
    setSets((prev) => [...prev, { reps, weight }]);
    setReps(''); setWeight('');
  };

  const save = () => {
    const entry = { exercise: exercise.trim(), muscle, type, note, date: Date.now(), id: String(Date.now() + Math.random()) };
    if (type === 'cardio') { entry.duration = duration; entry.distance = distance; }
    else { entry.sets = sets; if (type === 'machine') { entry.resistance = resistance; entry.incline = incline; } }
    const check = validateEntry(entry);
    if (!check.valid) { setError(check.error); return; }
    setError('');
    onSave(entry);
    setExercise(''); setSets([]); setDuration(''); setDistance(''); setResistance(''); setIncline(''); setNote('');
  };

  const last = entries[0];

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.pad} keyboardShouldPersistTaps="handled">
      <Text style={S.h1} {...A('text-log-title')}>Log workout</Text>

      <Text style={S.label}>Exercise</Text>
      <TextInput style={S.input} placeholder="Squats" placeholderTextColor={C.muted}
        value={exercise} onChangeText={setExercise} {...A('input-exercise')} />

      {pinned && pinned.pinned ? (
        <View style={[S.card, { marginTop: 10, borderColor: C.primary }]}>
          <Text style={{ color: C.primary, fontSize: 13 }} {...A('text-pinned-note')}>📌 {pinned.note}</Text>
        </View>
      ) : null}

      <Text style={S.label}>Muscle group</Text>
      <Chips options={MUSCLES} value={muscle} onChange={setMuscle} idPrefix="chip-muscle" />

      <Text style={S.label}>Type</Text>
      <Chips options={TYPES} value={type} onChange={setType} idPrefix="chip-type" />

      {type === 'cardio' ? (
        <View>
          <Text style={S.label}>Duration (min)</Text>
          <TextInput style={S.input} keyboardType="numeric" placeholder="30" placeholderTextColor={C.muted}
            value={duration} onChangeText={setDuration} {...A('input-duration')} />
          <Text style={S.label}>Distance (km)</Text>
          <TextInput style={S.input} keyboardType="numeric" placeholder="5" placeholderTextColor={C.muted}
            value={distance} onChangeText={setDistance} {...A('input-distance')} />
        </View>
      ) : (
        <View>
          <Text style={S.label}>Add sets</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput style={[S.input, { flex: 1 }]} keyboardType="numeric" placeholder="Reps" placeholderTextColor={C.muted}
              value={reps} onChangeText={setReps} {...A('input-set-reps')} />
            <TextInput style={[S.input, { flex: 1 }]} keyboardType="numeric" placeholder="Weight" placeholderTextColor={C.muted}
              value={weight} onChangeText={setWeight} {...A('input-set-weight')} />
            <TouchableOpacity style={[S.btnOutline, { marginTop: 0, paddingHorizontal: 18, justifyContent: 'center' }]}
              onPress={addSet} {...A('button-add-set')}>
              <Text style={S.btnOutlineText}>+ Set</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ color: C.muted, marginTop: 8 }} {...A('text-set-count')}>Sets added: {sets.length}</Text>
          {sets.map((s, i) => (
            <Text key={i} style={{ color: C.text, marginTop: 2 }} {...A('row-set')}>Set {i + 1}: {s.reps} reps @ {s.weight}</Text>
          ))}
          {type === 'machine' ? (
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TextInput style={[S.input, { flex: 1 }]} keyboardType="numeric" placeholder="Resistance" placeholderTextColor={C.muted}
                value={resistance} onChangeText={setResistance} {...A('input-resistance')} />
              <TextInput style={[S.input, { flex: 1 }]} keyboardType="numeric" placeholder="Incline" placeholderTextColor={C.muted}
                value={incline} onChangeText={setIncline} {...A('input-incline')} />
            </View>
          ) : null}
        </View>
      )}

      <Text style={S.label}>Note (optional)</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput style={[S.input, { flex: 1 }]} placeholder="e.g. keep back straight" placeholderTextColor={C.muted}
          value={note} onChangeText={setNote} {...A('input-note')} />
        <TouchableOpacity style={[S.btnOutline, { marginTop: 0, paddingHorizontal: 16, justifyContent: 'center' }]}
          onPress={() => onSaveNote(exercise.trim(), note, true)} {...A('button-pin-note')}>
          <Text style={S.btnOutlineText}>Pin</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={S.error} {...A('text-error')}>{error}</Text> : null}

      <TouchableOpacity style={S.btnPrimary} onPress={save} {...A('button-save-entry')}>
        <Text style={S.btnPrimaryText}>Save exercise</Text>
      </TouchableOpacity>

      <Text style={{ color: C.text, fontSize: 16, marginTop: 20 }} {...A('text-entry-count')}>
        Workouts logged: {entries.length}
      </Text>
      {last ? <Text style={{ color: C.primary, marginTop: 4 }} {...A('text-last-entry')}>
        Last: {last.type === 'cardio' ? `${last.exercise} ${last.duration}min` : `${last.exercise} — ${last.sets.length} sets`}
      </Text> : null}

      {entries.map((e) => (
        <View key={e.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomColor: C.border, borderBottomWidth: 1 }}>
          <Text style={{ color: C.muted, flex: 1 }} {...A('row-entry')}>
            {e.exercise} · {e.muscle} · {e.type === 'cardio' ? `${e.duration}min` : `${e.sets.length} sets`}
          </Text>
          <TouchableOpacity onPress={() => onDelete(e.id)} {...A('button-delete-entry')}>
            <Text style={{ color: C.danger }}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      {entries.length ? (
        <TouchableOpacity style={{ padding: 12, alignItems: 'center' }} onPress={onClear} {...A('button-clear')}>
          <Text style={{ color: C.muted }}>Clear all</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}
