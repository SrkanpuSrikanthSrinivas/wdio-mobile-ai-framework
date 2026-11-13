import { View, Text, TouchableOpacity } from 'react-native';
import { S, C } from '../theme';

const A = (id) => ({ testID: id, accessibilityLabel: id, accessible: true });

export default function LandingScreen({ onSignup, onSignin }) {
  return (
    <View style={[S.screen, S.pad, S.center]}>
      <Text style={S.brand} {...A('text-landing-title')}>GymProgress</Text>
      <Text style={S.tagline}>Log every rep. Track every gain.</Text>

      <View style={{ marginTop: 40 }}>
        <View style={S.card}>
          <Text style={S.h2}>Welcome</Text>
          <Text style={{ color: C.muted, marginTop: 6 }}>
            The simplest way to log your workouts — create an account or sign in to start.
          </Text>
          <TouchableOpacity style={S.btnPrimary} onPress={onSignup} {...A('button-goto-signup')}>
            <Text style={S.btnPrimaryText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={S.btnOutline} onPress={onSignin} {...A('button-goto-signin')}>
            <Text style={S.btnOutlineText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
