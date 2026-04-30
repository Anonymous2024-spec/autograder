import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
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
import { useAuth } from "../../../context/AuthContext";
import { adminAPI } from "../../../services/api";

export default function EditStudent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const params = useLocalSearchParams<{
    id: string;
    userId: string;
    name: string;
    email: string;
    regNo: string;
    department: string;
  }>();

  const [name, setName] = useState(params.name ?? "");
  const [email, setEmail] = useState(params.email ?? "");
  const [regNo, setRegNo] = useState(params.regNo ?? "");
  const [department, setDepartment] = useState(params.department ?? "");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({ name: "", email: "", regNo: "" });

  const validate = () => {
    const e = { name: "", email: "", regNo: "" };
    let valid = true;
    if (!name.trim()) { e.name = "Full name is required"; valid = false; }
    if (!email.trim() || !email.includes("@")) { e.email = "Valid email is required"; valid = false; }
    if (!regNo.trim()) { e.regNo = "Student ID number is required"; valid = false; }
    setErrors(e);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await adminAPI.updateUser(
        Number(params.userId),
        {
          full_name: name.trim(),
          email: email.trim(),
          student_id_number: regNo.trim(),
          department: department.trim() || undefined,
        },
        token!
      );
      Alert.alert("Success", "Student updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={["#0D1F6B", "#1A3BAA", Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}
      >
        <View style={styles.headerShapeL} />
        <View style={styles.headerShapeS} />

        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Edit Student</Text>
            <Text style={styles.headerSub}>Update student details</Text>
          </View>
          <View style={styles.idBadge}>
            <Text style={styles.idBadgeText}>#{params.id}</Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressPill}>
            <Ionicons name="create-outline" size={13} color={Colors.white} />
            <Text style={styles.progressText}>Editing student record</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Student Identity</Text>
        <View style={styles.formCard}>
          <View style={styles.fieldRow}>
            <View style={[styles.fieldIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="person-outline" size={18} color={Colors.primary} />
            </View>
            <View style={styles.fieldInput}>
              <Input
                label="Full Name"
                placeholder="e.g. John Doe"
                value={name}
                onChangeText={(t) => { setName(t); setErrors((p) => ({ ...p, name: "" })); }}
                icon="person-outline"
                error={errors.name}
              />
            </View>
          </View>

          <View style={styles.fieldDivider} />

          <View style={styles.fieldRow}>
            <View style={[styles.fieldIcon, { backgroundColor: Colors.accentLight }]}>
              <Ionicons name="mail-outline" size={18} color={Colors.accent} />
            </View>
            <View style={styles.fieldInput}>
              <Input
                label="Email Address"
                placeholder="e.g. student@example.com"
                value={email}
                onChangeText={(t) => { setEmail(t); setErrors((p) => ({ ...p, email: "" })); }}
                keyboardType="email-address"
                icon="mail-outline"
                error={errors.email}
              />
            </View>
          </View>

          <View style={styles.fieldDivider} />

          <View style={styles.fieldRow}>
            <View style={[styles.fieldIcon, { backgroundColor: Colors.successLight }]}>
              <Ionicons name="card-outline" size={18} color={Colors.success} />
            </View>
            <View style={styles.fieldInput}>
              <Input
                label="Student ID Number"
                placeholder="e.g. 23/U/1234"
                value={regNo}
                onChangeText={(t) => { setRegNo(t); setErrors((p) => ({ ...p, regNo: "" })); }}
                icon="card-outline"
                error={errors.regNo}
              />
            </View>
          </View>

          <View style={styles.fieldDivider} />

          <View style={styles.fieldRow}>
            <View style={[styles.fieldIcon, { backgroundColor: "#EDE9FE" }]}>
              <Ionicons name="business-outline" size={18} color={Colors.cardPurple} />
            </View>
            <View style={styles.fieldInput}>
              <Input
                label="Department (Optional)"
                placeholder="e.g. Computer Science"
                value={department}
                onChangeText={setDepartment}
                icon="business-outline"
              />
            </View>
          </View>
        </View>

        <View style={styles.infoNote}>
          <Ionicons name="warning-outline" size={15} color={Colors.warning} />
          <Text style={[styles.infoNoteText, { color: Colors.warning }]}>
            Changes to student ID number must match official records.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#1A3BAA", Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            {loading ? (
              <Text style={styles.submitBtnText}>Saving...</Text>
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color={Colors.white} />
                <Text style={styles.submitBtnText}>Save Changes</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, overflow: "hidden" },
  headerShapeL: {
    position: "absolute", width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)", top: -60, right: -40,
  },
  headerShapeS: {
    position: "absolute", width: 100, height: 100, borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)", bottom: -20, left: -20,
  },
  headerTop: { flexDirection: "row", alignItems: "center", gap: Spacing.md, marginBottom: Spacing.md },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center", alignItems: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  idBadge: {
    backgroundColor: "rgba(255,255,255,0.2)", borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
  },
  idBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.white },
  progressRow: { flexDirection: "row" },
  progressPill: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)", borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 5, gap: 5,
  },
  progressText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.white },
  body: { paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg },
  sectionLabel: {
    fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.subtext,
    textTransform: "uppercase", letterSpacing: 1.2,
    marginBottom: Spacing.sm, marginTop: Spacing.md,
  },
  formCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
    overflow: "hidden", ...Shadows.sm, marginBottom: Spacing.sm,
  },
  fieldRow: {
    flexDirection: "row", alignItems: "flex-start",
    paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, gap: Spacing.md,
  },
  fieldIcon: {
    width: 38, height: 38, borderRadius: Radius.md,
    justifyContent: "center", alignItems: "center", marginTop: Spacing.lg + 2,
  },
  fieldInput: { flex: 1 },
  fieldDivider: {
    height: 1, backgroundColor: Colors.border,
    marginLeft: Spacing.md + 38 + Spacing.md,
  },
  infoNote: {
    flexDirection: "row", alignItems: "flex-start", gap: Spacing.sm,
    backgroundColor: Colors.warningLight, borderRadius: Radius.lg,
    padding: Spacing.md, marginTop: Spacing.sm,
    borderWidth: 1, borderColor: Colors.warning + "30",
  },
  infoNoteText: { flex: 1, fontSize: FontSize.xs, lineHeight: 18 },
  bottomBar: {
    flexDirection: "row", paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border,
    gap: Spacing.md, ...Shadows.md,
  },
  cancelBtn: {
    flex: 1, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.lg, paddingVertical: Spacing.md,
    alignItems: "center", justifyContent: "center",
  },
  cancelBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.subtext },
  submitBtn: { flex: 2, borderRadius: Radius.lg, overflow: "hidden", ...Shadows.colored },
  submitBtnDisabled: { opacity: 0.7 },
  submitGradient: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: Spacing.md, gap: Spacing.sm,
  },
  submitBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.white },
});
