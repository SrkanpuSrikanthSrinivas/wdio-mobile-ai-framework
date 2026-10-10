import React from 'react';
import { View, Text, Pressable } from 'react-native';

export default function LandingScreen({ navigation }) {
  return (
    <View testID="screen-landing" accessibilityLabel="screen-landing">
      <Text testID="text-welcome" accessibilityLabel="text-welcome">Welcome to GymProgress</Text>
      <Text testID="text-tagline" accessibilityLabel="text-tagline">Track every rep. Recover smarter.</Text>
      <Pressable testID="button-get-started" accessibilityLabel="button-get-started" onPress={() => navigation.navigate('SignUp')}>
        <Text>Get started</Text>
      </Pressable>
      <Pressable testID="link-sign-in" accessibilityLabel="link-sign-in" onPress={() => navigation.navigate('SignIn')}>
        <Text>I already have an account</Text>
      </Pressable>
    </View>
  );
}
