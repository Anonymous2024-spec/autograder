import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useAuth } from "../../context/AuthContext";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
  Spacing,
} from "../../constants";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Full screen dark gradient background ── */}
      <LinearGradient
        colors={["#0D1F6B", "#1A3BAA", "#1A56DB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Decorative background shapes ── */}
      <View style={styles.shapeLarge} />
      <View style={styles.shapeMedium} />
      <View style={styles.shapeSmall} />
      <View style={styles.shapeBottom} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + Spacing.xl },
          ]}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── Top hero section ── */}
          <View style={styles.heroSection}>

            {/* Logo container with glow */}
            <View style={styles.logoGlow}>
              <View style={styles.logoContainer}>
                <Ionicons name="school" size={40} color={Colors.white} />
              </View>
            </View>

            {/* University name */}
            <Text style={styles.universityName}>GULU UNIVERSITY</Text>

            {/* App name */}
            <Text style={styles.appName}>AutoGrader</Text>

            {/* Tagline */}
            <View style={styles.taglineRow}>
              <View style={styles.taglineLine} />
              <Text style={styles.tagline}>Smart Grading, Simplified</Text>
              <View style={styles.taglineLine} />
            </View>

          </View>

          {/* ── Form card ── */}
          <View style={styles.card}>

            {/* Card header */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Welcome Back</Text>
              <Text style={styles.cardSubtitle}>
                Sign in to your account to continue
              </Text>
            </View>

            {/* Error banner */}
            {error ? (
              <View style={styles.errorBox}>
                <View style={styles.errorIconBox}>
                  <Ionicons
                    name="alert-circle"
                    size={18}
                    color={Colors.error}
                  />
                </View>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Email */}
            <Input
              label="Email Address"
              placeholder="your@email.ac.ug"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setError("");
              }}
              keyboardType="email-address"
              icon="mail-outline"
            />

            {/* Password */}
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setError("");
              }}
              secureTextEntry
              icon="lock-closed-outline"
            />

            {/* Login button */}
            <View style={styles.buttonContainer}>
              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>secure login</Text>
              <View style={styles.divider} />
            </View>

            {/* Security note */}
            <View style={styles.secureNote}>
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color={Colors.success}
              />
              <Text style={styles.secureNoteText}>
                Your data is encrypted and secure
              </Text>
            </View>

          </View>

          {/* ── Footer ── */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.lg }]}>
            <Text style={styles.footerText}>
              Gulu University © 2025 · AutoGrader
            </Text>
            <Text style={styles.footerVersion}>Version 1.0.0</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0D1F6B",
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },

  // ── Decorative background shapes ──
  shapeLarge: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "rgba(255,255,255,0.04)",
    top: -100,
    right: -100,
  },
  shapeMedium: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: 150,
    left: -80,
  },
  shapeSmall: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: 80,
    right: 40,
  },
  shapeBottom: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(0,0,0,0.15)",
    bottom: -100,
    left: -50,
  },

  // ── Hero section ──
  heroSection: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  logoGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    // Glow effect
    shadowColor: Colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  universityName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 3,
    marginBottom: Spacing.xs,
  },
  appName: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
    letterSpacing: -0.5,
    marginBottom: Spacing.md,
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  taglineLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  tagline: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 0.5,
  },

  // ── Form card ──
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    ...Shadows.lg,
  },
  cardHeader: {
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    lineHeight: 20,
  },

  // Error box
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.errorLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
    gap: Spacing.sm,
  },
  errorIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.errorLight,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.error,
    fontWeight: FontWeight.medium,
  },

  // Button
  buttonContainer: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSize.xs,
    color: Colors.placeholder,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // Security note
  secureNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  secureNoteText: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },

  // ── Footer ──
  footer: {
    alignItems: "center",
    paddingTop: Spacing.xl,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.3)",
  },
});