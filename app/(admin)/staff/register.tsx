import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Input from "../../../components/Input";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
  Spacing,
} from "../../../constants";

const ROLES = [
  {
    id: "lecturer",
    label: "Lecturer",
    icon: "school-outline",
    color: Colors.primary,
    bg: Colors.primaryLight,
  },
  {
    id: "admin",
    label: "Admin",
    icon: "shield-outline",
    color: Colors.cardPurple,
    bg: "#EDE9FE",
  },
];

export default function RegisterStaff() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lecturer");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({ username: "", email: "", password: "" });

  const validate = () => {
    const e = { username: "", email: "", password: "" };
    let valid = true;
    if (!username.trim()) { e.username = "Username is required"; valid = false; }
    if (!email.trim()) { e.email = "Email is required"; valid = false; }
    else if (!email.includes("@")) { e.email = "Enter a valid email"; valid = false; }
    if (!password.trim()) { e.password = "Password is required"; valid = false; }
    else if (password.length < 6) { e.password = "Password must be at least 6 characters"; valid = false; }
    setErrors(e);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    // TODO: POST to API
    setTimeout(() => {
      setLoading(false);
      router.back();
    }, 1000);
  };

  const selectedRole = ROLES.find((r) => r.id === role)!;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* ── Gradient header ── */}
      <LinearGradient
        colors={["#2D1B69", "#5B21B6", Colors.cardPurple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}
      >
        <View style={styles.headerShapeL} />
        <View style={styles.headerShapeS} />

        {/* Back + title row */}
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Register Staff</Text>
            <Text style={styles.headerSub}>Add a new staff member</Text>
          </View>
        </View>

        {/* Role preview pill */}
        <View style={styles.rolePreviewRow}>
          <View style={styles.rolePreviewPill}>
            <Ionicons name={selectedRole.icon as any} size={13} color={Colors.white} />
            <Text style={styles.rolePreviewText}>
              Registering as {selectedRole.label}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Personal info section ── */}
        <Text style={styles.sectionLabel}>Personal Information</Text>
        <View style={styles.formCard}>
          {/* Username */}
          <View style={styles.fieldRow}>
            <View style={[styles.fieldIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="person-outline" size={18} color={Colors.primary} />
            </View>
            <View style={styles.fieldInput}>
              <Input
                label="Username"
                placeholder="e.g. Dr. Okello"
                value={username}
                onChangeText={(t) => { setUsername(t); setErrors((p) => ({ ...p, username: "" })); }}
                icon="person-outline"
                error={errors.username}
              />
            </View>
          </View>

          <View style={styles.fieldDivider} />

          {/* Email */}
          <View style={styles.fieldRow}>
            <View style={[styles.fieldIcon, { backgroundColor: Colors.accentLight }]}>
              <Ionicons name="mail-outline" size={18} color={Colors.accent} />
            </View>
            <View style={styles.fieldInput}>
              <Input
                label="Email Address"
                placeholder="e.g. okello@gulu.ac.ug"
                value={email}
                onChangeText={(t) => { setEmail(t); setErrors((p) => ({ ...p, email: "" })); }}
                keyboardType="email-address"
                icon="mail-outline"
                error={errors.email}
              />
            </View>
          </View>

          <View style={styles.fieldDivider} />

          {/* Password */}
          <View style={styles.fieldRow}>
            <View style={[styles.fieldIcon, { backgroundColor: Colors.warningLight }]}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.warning} />
            </View>
            <View style={styles.fieldInput}>
              <Input
                label="Password"
                placeholder="Min. 6 characters"
                value={password}
                onChangeText={(t) => { setPassword(t); setErrors((p) => ({ ...p, password: "" })); }}
                secureTextEntry
                icon="lock-closed-outline"
                error={errors.password}
              />
            </View>
          </View>
        </View>

        {/* ── Role section ── */}
        <Text style={styles.sectionLabel}>Account Role</Text>
        <View style={styles.formCard}>
          <Text style={styles.roleHint}>
            Select the access level for this staff member
          </Text>
          <View style={styles.roleRow}>
            {ROLES.map((r) => {
              const isActive = role === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.roleBtn, isActive && { borderColor: r.color, backgroundColor: r.bg }]}
                  onPress={() => setRole(r.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.roleBtnIcon, { backgroundColor: isActive ? r.color : Colors.border }]}>
                    <Ionicons name={r.icon as any} size={16} color={Colors.white} />
                  </View>
                  <Text style={[styles.roleBtnText, isActive && { color: r.color }]}>
                    {r.label}
                  </Text>
                  {isActive && (
                    <View style={[styles.roleCheck, { backgroundColor: r.color }]}>
                      <Ionicons name="checkmark" size={10} color={Colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Info note ── */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={15} color={Colors.primary} />
          <Text style={styles.infoNoteText}>
            The staff member will use these credentials to sign in to AutoGrader.
          </Text>
        </View>
      </ScrollView>

      {/* ── Sticky bottom bar ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#5B21B6", Colors.cardPurple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            {loading ? (
              <Text style={styles.submitBtnText}>Registering...</Text>
            ) : (
              <>
                <Ionicons name="person-add-outline" size={18} color={Colors.white} />
                <Text style={styles.submitBtnText}>Register Staff</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Header ──
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    overflow: "hidden",
  },
  headerShapeL: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -60,
    right: -40,
  },
  headerShapeS: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -20,
    left: -20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  headerSub: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  rolePreviewRow: {
    flexDirection: "row",
  },
  rolePreviewPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    gap: 5,
  },
  rolePreviewText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },

  // ── Body ──
  body: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.subtext,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },

  // ── Form card ──
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Shadows.sm,
    marginBottom: Spacing.sm,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.md,
  },
  fieldIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg + 2,
  },
  fieldInput: {
    flex: 1,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.md + 38 + Spacing.md,
  },

  // ── Role selector ──
  roleHint: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  roleRow: {
    flexDirection: "row",
    gap: Spacing.md,
    padding: Spacing.md,
    paddingTop: 0,
  },
  roleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    backgroundColor: Colors.background,
    gap: Spacing.sm,
    position: "relative",
  },
  roleBtnIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  roleBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.subtext,
    flex: 1,
  },
  roleCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Info note ──
  infoNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary + "20",
  },
  infoNoteText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.primary,
    lineHeight: 18,
  },

  // ── Bottom bar ──
  bottomBar: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
    ...Shadows.md,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.subtext,
  },
  submitBtn: {
    flex: 2,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadows.colored,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  submitBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
});