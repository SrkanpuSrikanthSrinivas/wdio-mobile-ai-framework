import { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { S, C } from '../theme';

const A = (id) => ({ testID: id, accessibilityLabel: id, accessible: true });

export default function SignUpScreen({ onSubmit, onBack, error }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.pad} keyboardShouldPersistTaps="handled">
      <Text style={S.h1} {...A('text-signup-title')}>Create account</Text>
      <Text style={{ color: C.muted, marginTop: 4 }}>Start logging your workouts in seconds.</Text>

      <Text style={S.label}>Full name</Text>
      <TextInput style={S.input} placeholder="Alex Carter" placeholderTextColor={C.muted}
        value={name} onChangeText={setName} {...A('input-name')} />

      <Text style={S.label}>Email</Text>
      <TextInput style={S.input} placeholder="you@email.com" placeholderTextColor={C.muted}
        autoCapitalize="none" keyboardType="email-address"
        value={email} onChangeText={setEmail} {...A('input-email')} />

      <Text style={S.label}>Password</Text>
      <TextInput style={S.input} placeholder="At least 6 characters" placeholderTextColor={C.muted}
        secureTextEntry value={password} onChangeText={setPassword} {...A('input-password')} />

      <Text style={S.label}>Confirm password</Text>
      <TextInput style={S.input} placeholder="Re-enter password" placeholderTextColor={C.muted}
        secureTextEntry value={confirm} onChangeText={setConfirm} {...A('input-confirm')} />

      {error ? <Text style={S.error} {...A('text-signup-error')}>{error}</Text> : null}

      <TouchableOpacity style={S.btnPrimary} onPress={() => onSubmit({ name, email, password, confirm })} {...A('button-signup')}>
        <Text style={S.btnPrimaryText}>Create account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onBack} {...A('link-back-landing')}>
        <Text style={S.link}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
