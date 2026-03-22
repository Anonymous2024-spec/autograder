import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';
import { Colors, FontSize, Spacing } from '../../constants';

export default function LoginScreen() {
  const { login } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleLogin = async () => {
    // Basic client-side validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // No navigation needed here —
      // the auth guard in _layout.tsx detects the new user
      // and redirects to the correct dashboard automatically
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Top blue section */}
        <View style={styles.topSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="school-outline" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>AutoGrader</Text>
          <Text style={styles.tagline}>Smart Grading, Simplified</Text>
        </View>

        {/* White form card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Sign In</Text>
          <Text style={styles.formSubtitle}>Enter your credentials to continue</Text>

          {/* Show API error message here */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => { setEmail(text); setError(''); }}
            keyboardType="email-address"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => { setPassword(text); setError(''); }}
            secureTextEntry
          />

          <Button title="Login" onPress={handleLogin} loading={loading} />

          <Text style={styles.footer}>Gulu University © 2025</Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  topSection: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingTop: Spacing.xl * 2,
    paddingBottom: Spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  appName: {
    fontSize: FontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    minHeight: 500,
  },
  formTitle: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginBottom: Spacing.lg,
  },
  // Red error banner between subtitle and inputs
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    flex: 1,
  },
  footer: {
    fontSize: FontSize.xs,
    color: Colors.placeholder,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});