import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';
import { Colors, FontSize, Spacing } from '../../constants';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { login } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* ── Blue top section ── */}
        <View style={styles.topSection}>

          {/* Decorative background circles */}
          <View style={styles.circleTopRight} />
          <View style={styles.circleBottomLeft} />

          {/* Icon + branding */}
          <View style={styles.iconCircle}>
            <Ionicons name="school-outline" size={44} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>AutoGrader</Text>
          <Text style={styles.tagline}>Smart Grading, Simplified</Text>
        </View>

        {/* ── Wave SVG transition ── */}
        <View style={styles.waveContainer}>
          <Svg
            width={width}
            height={60}
            viewBox={`0 0 ${width} 60`}
            style={styles.wave}
          >
            <Path
              d={`
                M0,0
                C${width * 0.25},60 ${width * 0.75},0 ${width},40
                L${width},60 L0,60 Z
              `}
              fill={Colors.white}
            />
          </Svg>
        </View>

        {/* ── White form section ── */}
        <View style={styles.formSection}>

          <Text style={styles.formTitle}>Sign In</Text>
          <Text style={styles.formSubtitle}>
            Enter your credentials to continue
          </Text>

          {/* Error banner */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color={Colors.error}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(t) => { setEmail(t); setError(''); }}
            keyboardType="email-address"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(t) => { setPassword(t); setError(''); }}
            secureTextEntry
          />

          <Button title="Login" onPress={handleLogin} loading={loading} />

          <Text style={styles.footer}>Gulu University © 2025</Text>
        </View>

        {/* ── Blue wave footer ── */}
        <View style={styles.footerWaveContainer}>
          <Svg
            width={width}
            height={60}
            viewBox={`0 0 ${width} 60`}
            style={styles.footerWave}
          >
            <Path
              d={`
                M0,40
                C${width * 0.25},0 ${width * 0.75},60 ${width},20
                L${width},0 L0,0 Z
              `}
              fill={Colors.white}
            />
          </Svg>
          <View style={styles.footerBlue} />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scroll: {
    flexGrow: 1,
    backgroundColor: Colors.primary,
  },

  // ── Top blue hero ──
  topSection: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingTop: Spacing.xl * 2.5,
    paddingBottom: Spacing.lg,
    overflow: 'hidden',
  },

  // Decorative blurred circles behind the hero content
  circleTopRight: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -40,
    right: -40,
  },
  circleBottomLeft: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: 10,
    left: -30,
  },

  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  appName: {
    fontSize: FontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Spacing.xs,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1,
  },

  // ── Wave between blue and white ──
  waveContainer: {
    marginTop: -1,
    backgroundColor: Colors.primary,
  },
  wave: {
    display: 'flex',
  },

  // ── White form area ──
  formSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.lg,
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

  // ── Bottom wave footer ──
  footerWaveContainer: {
    backgroundColor: Colors.white,
  },
  footerWave: {
    display: 'flex',
  },
  footerBlue: {
    backgroundColor: Colors.primary,
    height: 60,
  },
});