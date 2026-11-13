import { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { C } from './src/theme';
import { validateSignup, validateSignin, findUser, DEMO_USER } from './src/validation';
import LandingScreen from './src/screens/LandingScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SignInScreen from './src/screens/SignInScreen';
import MainScreen from './src/screens/MainScreen';

/**
 * GymProgress — a small, dependency-free multi-screen app used as the
 * app-under-test. Navigation is simple state (no libraries) so the EAS build is
 * rock-solid. Auth is in-memory with a seeded demo account so login is
 * deterministic in tests. Every element exposes an accessibility id (see each
 * screen); the WDIO screen objects use those exact ids.
 */
export default function App() {
  const [screen, setScreen] = useState('landing'); // landing | signup | signin | home
  const [users, setUsers] = useState([DEMO_USER]);
  const [currentUser, setCurrentUser] = useState(null);
  const [signupError, setSignupError] = useState('');
  const [signinError, setSigninError] = useState('');

  const go = (s) => { setSignupError(''); setSigninError(''); setScreen(s); };

  const handleSignup = (form) => {
    const v = validateSignup(form);
    if (!v.valid) { setSignupError(v.error); return; }
    if (users.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase())) {
      setSignupError('An account with that email already exists'); return;
    }
    const user = { name: form.name.trim(), email: form.email.trim(), password: form.password };
    setUsers((prev) => [...prev, user]);
    setCurrentUser(user);
    go('home');
  };

  const handleSignin = (form) => {
    const v = validateSignin(form);
    if (!v.valid) { setSigninError(v.error); return; }
    const user = findUser(users, form.email, form.password);
    if (!user) { setSigninError('Invalid email or password'); return; }
    setCurrentUser(user);
    go('home');
  };

  const logout = () => { setCurrentUser(null); go('landing'); };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" />
      {screen === 'landing' && <LandingScreen onSignup={() => go('signup')} onSignin={() => go('signin')} />}
      {screen === 'signup' && <SignUpScreen onSubmit={handleSignup} onBack={() => go('signin')} error={signupError} />}
      {screen === 'signin' && <SignInScreen onSubmit={handleSignin} onBack={() => go('signup')} error={signinError} />}
      {screen === 'home' && <MainScreen user={currentUser} onLogout={logout} />}
    </SafeAreaView>
  );
}
