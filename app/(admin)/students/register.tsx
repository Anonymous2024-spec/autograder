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

export default function RegisterStudent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [studentNo, setStudentNo] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: "", regNo: "", studentNo: "", courseId: "",
  });

  const validate = () => {
    const e = { name: "", regNo: "", studentNo: "", courseId: "" };
    let valid = true;
    if (!name.trim()) { e.name = "Full name is required"; valid = false; }
    if (!regNo.trim()) { e.regNo = "Registration number is required"; valid = false; }
    if (!studentNo.trim()) { e.studentNo = "Student number is required"; valid = false; }
    if (!courseId.trim()) { e.courseId = "Course ID is required"; valid = false; }
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

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* ── Gradient header ── */}
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
            <Text style={styles.headerTitle}>Register Student</Text>
            <Text style={styles.headerSub}>Add a new student record</Text>
          </View>
        </View>

        {/* Progress hint */}
        <View style={styles.progressRow}>
          <View style={styles.progressPill}>
            <Ionicons name="person-add-outline" size={13} color={Colors.white} />
            <Text style={styles.progressText}>Fill all fields to register</Text>
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
        {/* ── Identity section ── */}
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
              <Ionicons name="card-outline" size={18} color={Colors.accent} />
            </View>
            <View style={styles.fieldInput}>
              <Input
                label="Registration Number"
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
            <View style={[styles.fieldIcon, { backgroundColor: Colors.successLight }]}>
              <Ionicons name="id-card-outline" size={18} color={Colors.success} />
            </View>
            <View style={styles.fieldInput}>
              <Input
                label="Student Number"
                placeholder="e.g. 2300712345"
                value={studentNo}
                onChangeText={(t) => { setStudentNo(t); setErrors((p) => ({ ...p, studentNo: "" })); }}
                keyboardType="numeric"
                icon="id-card-outline"
                error={errors.studentNo}
              />
            </View>
          </View>
        </View>

        {/* ── Enrollment section ── */}
        <Text style={styles.sectionLabel}>Enrollment</Text>
        <View style={styles.formCard}>
          <View style={styles.fieldRow}>
            <View style={[styles.fieldIcon, { backgroundColor: "#EDE9FE" }]}>
              <Ionicons name="book-outline" size={18} color={Colors.cardPurple} />
            </View>
            <View style={styles.fieldInput}>
              <Input
                label="Course ID"
                placeholder="e.g. 1"
                value={courseId}
                onChangeText={(t) => { setCourseId(t); setErrors((p) => ({ ...p, courseId: "" })); }}
                keyboardType="numeric"
                icon="book-outline"
                error={errors.courseId}
              />
            </View>
          </View>
        </View>

        {/* ── Info note ── */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={15} color={Colors.primary} />
          <Text style={styles.infoNoteText}>
            The Course ID must match an existing course in the system. Ask the admin if unsure.
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
            colors={["#1A3BAA", Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            {loading ? (
              <Text style={styles.submitBtnText}>Registering...</Text>
            ) : (
              <>
                <Ionicons name="person-add-outline" size={18} color={Colors.white} />
                <Text style={styles.submitBtnText}>Register Student</Text>
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
    backgroundColor: Colors.primaryLight, borderRadius: Radius.lg,
    padding: Spacing.md, marginTop: Spacing.sm,
    borderWidth: 1, borderColor: Colors.primary + "20",
  },
  infoNoteText: { flex: 1, fontSize: FontSize.xs, color: Colors.primary, lineHeight: 18 },
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