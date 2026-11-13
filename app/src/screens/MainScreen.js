import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { C } from '../theme';
import LogScreen from './LogScreen';
import StatsScreen from './StatsScreen';
import RecoveryScreen from './RecoveryScreen';

const A = (id) => ({ testID: id, accessibilityLabel: id, accessible: true });

export default function MainScreen({ user, onLogout }) {
  const [tab, setTab] = useState('log');            // log | stats | recovery
  const [entries, setEntries] = useState([]);
  const [notes, setNotes] = useState({});           // exercise -> { note, pinned }

  const saveEntry = (entry) => setEntries((prev) => [entry, ...prev]);
  const deleteEntry = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const clearEntries = () => setEntries([]);
  const saveNote = (exercise, note, pinned) => {
    if (!exercise) return;
    setNotes((prev) => ({ ...prev, [exercise]: { note, pinned } }));
  };

  const Tab = ({ id, label }) => (
    <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}
      onPress={() => setTab(id)} {...A(`tab-${id}`)}>
      <Text style={{ color: tab === id ? C.primary : C.muted, fontWeight: tab === id ? '700' : '400' }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 6 }}>
        <Text style={{ color: C.text, fontSize: 18, fontWeight: '700' }} {...A('text-welcome')}>Hi, {user?.name || 'Athlete'}</Text>
        <TouchableOpacity onPress={onLogout} {...A('button-logout')}>
          <Text style={{ color: C.muted }}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {tab === 'log' && (
          <LogScreen entries={entries} onSave={saveEntry} onDelete={deleteEntry} onClear={clearEntries}
            notes={notes} onSaveNote={saveNote} />
        )}
        {tab === 'stats' && <StatsScreen entries={entries} />}
        {tab === 'recovery' && <RecoveryScreen />}
      </View>

      <View style={{ flexDirection: 'row', borderTopColor: C.border, borderTopWidth: 1, backgroundColor: C.card }}>
        <Tab id="log" label="Log" />
        <Tab id="stats" label="Stats" />
        <Tab id="recovery" label="Recovery" />
      </View>
    </View>
  );
}
