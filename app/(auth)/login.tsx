import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { Colors, FontSize, Spacing } from "../../constants";

export default function LoginScreen() {
  const router = useRouter();

  // State to store email and password values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Temporary login handler for routing test
  // TODO: Replace with real API call later
  const handleLogin = () => {
    // If email contains 'admin' go to admin dashboard
    if (email.includes("admin")) {
      router.replace({ pathname: "/(admin)/dashboard" });
    }
    // Otherwise go to lecturer dashboard
    else {
      router.replace({ pathname: "/(lecturer)/dashboard" });
    }
  };

  return (
    // Adjusts layout when keyboard appears
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top blue section */}
        <View style={styles.topSection}>
          {/* Icon circle */}
          <View style={styles.iconCircle}>
            <Ionicons name="school-outline" size={40} color={Colors.primary} />
          </View>

          {/* App name */}
          <Text style={styles.appName}>AutoGrader</Text>

          {/* Tagline */}
          <Text style={styles.tagline}>Smart Grading, Simplified</Text>
        </View>

        {/* Bottom white card section */}
        <View style={styles.formCard}>
          {/* Form title */}
          <Text style={styles.formTitle}>Sign In</Text>
          <Text style={styles.formSubtitle}>
            Enter your credentials to continue
          </Text>

          {/* Email input */}
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Password input */}
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Login button */}
          <Button title="Login" onPress={handleLogin} />

          {/* Footer */}
          <Text style={styles.footer}>Gulu University © 2025</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  // Top blue section
  topSection: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    paddingTop: Spacing.xl * 2,
    paddingBottom: Spacing.xl,
  },

  // White circle behind the icon
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 4,
  },

  // App name styling
  appName: {
    fontSize: FontSize.xxxl,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: Spacing.xs,
  },

  // Tagline styling
  tagline: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.5,
  },

  // White form card
  formCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    // Makes card fill rest of screen
    minHeight: 500,
  },

  // Form title
  formTitle: {
    fontSize: FontSize.xxl,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },

  // Form subtitle
  formSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginBottom: Spacing.lg,
  },

  // Footer text
  footer: {
    fontSize: FontSize.xs,
    color: Colors.placeholder,
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});
