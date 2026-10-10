import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';

export default function SignInScreen({ navigation, auth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = async () => {
    if (!email || !password) return setError('Email and password are required');
    const ok = await auth.signIn(email, password);
    if (!ok) return setError('Invalid email or password');
    navigation.navigate('Home');
  };
  return (
    <View testID="screen-signin" accessibilityLabel="screen-signin">
      <Text testID="text-signin-title" accessibilityLabel="text-signin-title">Welcome back</Text>
      <TextInput testID="input-signin-email" accessibilityLabel="input-signin-email" value={email} onChangeText={setEmail} />
      <TextInput testID="input-signin-password" accessibilityLabel="input-signin-password" secureTextEntry value={password} onChangeText={setPassword} />
      <Text testID="text-signin-error" accessibilityLabel="text-signin-error">{error}</Text>
      <Pressable testID="button-signin" accessibilityLabel="button-signin" onPress={submit}><Text>Sign in</Text></Pressable>
    </View>
  );
}
