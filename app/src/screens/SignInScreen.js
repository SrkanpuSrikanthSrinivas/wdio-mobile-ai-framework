import { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { S, C } from '../theme';
import { DEMO_USER } from '../validation';

const A = (id) => ({ testID: id, accessibilityLabel: id, accessible: true });

export default function SignInScreen({ onSubmit, onBack, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.pad} keyboardShouldPersistTaps="handled">
      <Text style={S.h1} {...A('text-signin-title')}>Sign in</Text>
      <Text style={{ color: C.muted, marginTop: 4 }}>Welcome back — let's log some gains.</Text>

      <Text style={S.label}>Email</Text>
      <TextInput style={S.input} placeholder="you@email.com" placeholderTextColor={C.muted}
        autoCapitalize="none" keyboardType="email-address"
        value={email} onChangeText={setEmail} {...A('input-email')} />

      <Text style={S.label}>Password</Text>
      <TextInput style={S.input} placeholder="Your password" placeholderTextColor={C.muted}
        secureTextEntry value={password} onChangeText={setPassword} {...A('input-password')} />

      {error ? <Text style={S.error} {...A('text-signin-error')}>{error}</Text> : null}

      <TouchableOpacity style={S.btnPrimary} onPress={() => onSubmit({ email, password })} {...A('button-signin')}>
        <Text style={S.btnPrimaryText}>Sign in</Text>
      </TouchableOpacity>

      <View style={[S.card, { marginTop: 20 }]} {...A('text-demo-hint')}>
        <Text style={{ color: C.muted, fontSize: 13 }}>
          Demo account — email {DEMO_USER.email} · password {DEMO_USER.password}
        </Text>
      </View>

      <TouchableOpacity onPress={onBack} {...A('link-back-landing')}>
        <Text style={S.link}>New here? Create an account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
