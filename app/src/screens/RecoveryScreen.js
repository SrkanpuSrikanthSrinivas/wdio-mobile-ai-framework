import { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { S, C } from '../theme';
import { recoveryScore } from '../recovery';

const A = (id) => ({ testID: id, accessibilityLabel: id, accessible: true });

export default function RecoveryScreen() {
  const [sleepHours, setSleep] = useState('');
  const [soreness, setSoreness] = useState('');
  const [restingHr, setHr] = useState('');
  const [result, setResult] = useState(null);

  const calc = () => setResult(recoveryScore({ sleepHours, soreness, restingHr }));

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.pad}>
      <Text style={S.h1} {...A('text-recovery-title')}>Recovery</Text>
      <Text style={{ color: C.muted, marginTop: 4 }}>
        Enter today's readings — a recovery score you can act on. (Manual entry; no device sensors.)
      </Text>

      <Text style={S.label}>Sleep (hours)</Text>
      <TextInput style={S.input} keyboardType="numeric" placeholder="8" placeholderTextColor={C.muted}
        value={sleepHours} onChangeText={setSleep} {...A('input-sleep')} />

      <Text style={S.label}>Soreness (1–10)</Text>
      <TextInput style={S.input} keyboardType="numeric" placeholder="3" placeholderTextColor={C.muted}
        value={soreness} onChangeText={setSoreness} {...A('input-soreness')} />

      <Text style={S.label}>Resting heart rate (bpm)</Text>
      <TextInput style={S.input} keyboardType="numeric" placeholder="60" placeholderTextColor={C.muted}
        value={restingHr} onChangeText={setHr} {...A('input-resting-hr')} />

      <TouchableOpacity style={S.btnPrimary} onPress={calc} {...A('button-calc-recovery')}>
        <Text style={S.btnPrimaryText}>Calculate recovery</Text>
      </TouchableOpacity>

      {result ? (
        <View style={[S.card, { marginTop: 20, alignItems: 'center' }]}>
          <Text style={{ color: C.primary, fontSize: 44, fontWeight: '800' }} {...A('text-recovery-score')}>{result.score}</Text>
          <Text style={{ color: C.text, fontSize: 18, fontWeight: '600' }} {...A('text-recovery-label')}>{result.label}</Text>
          <Text style={{ color: C.muted, marginTop: 6, textAlign: 'center' }} {...A('text-recovery-advice')}>{result.advice}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
