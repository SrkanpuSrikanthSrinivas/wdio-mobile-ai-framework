import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { isValidEmail, passwordStrength } from '../logic/validation';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = () => {
    if (!isValidEmail(email)) return setError('Please enter a valid email address');
    if (passwordStrength(password) < 2) return setError('Password must be at least 8 characters');
    Alert.alert('Account created', 'Welcome aboard!');
    navigation.navigate('Home');
  };
  return (
    <View testID="screen-signup" accessibilityLabel="screen-signup">
      <Text testID="text-signup-title" accessibilityLabel="text-signup-title">Create your account</Text>
      <TextInput testID="input-email" accessibilityLabel="input-email" value={email} onChangeText={setEmail} />
      <TextInput testID="input-password" accessibilityLabel="input-password" secureTextEntry value={password} onChangeText={setPassword} />
      <Text testID="text-error" accessibilityLabel="text-error">{error}</Text>
      <Pressable testID="button-signup" accessibilityLabel="button-signup" onPress={submit}><Text>Sign up</Text></Pressable>
    </View>
  );
}
