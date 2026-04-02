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

export default function RegisterCourse() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({ name: "", code: "" });

  const validate = () => {
    const e = { name: "", code: "" };
    let valid = true;
    if (!name.trim()) { e.name = "Course name is required"; valid = false; }
    if (!code.trim()) { e.code = "Course code is required"; valid = false; }
    else if (code.trim().length > 10) { e.code = "Code must be 10 characters or less"; valid = false; }
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
      {/* ── Gradient header — green to match courses list ── */}
      <LinearGradient
        colors={["#064E3B", "#059669", Colors.cardGreen]}
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
            <Text style={styles.headerTitle}>Register Course</Text>
            <Text style={styles.headerSub}>Add a new course to the system</Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressPill}>
            <Ionicons name="book-outline" size={13} color={Colors.white} />
            <Text style={styles.progressText}>New course registration</Text>
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
        {/* ── Course details ── */}
        <Text style={styles.sectionLabel}>Course Details</Text>
        <View style={styles.formCard}>
          <View style={styles.fieldRow}>
            <View style={[styles.fieldIcon, { backgroundColor: Colors.successLight }]}>
              <Ionicons name="school-outline" size={18} color={Colors.success} />
            </View>
            <View style={styles.fieldInput}>
              <Input
                label="Course Name"
                placeholder="e.g. Bachelor of Computer Science"
                value={name}
                onChangeText={(t) => { setName(t); setErrors((p) => ({ ...p, name: "" })); }}
                icon="school-outline"
                error={errors.name}
              />
            </View>
          </View>

          <View style={styles.fieldDivider} />

          <View style={styles.fieldRow}>
            <View style={[styles.fieldIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="code-outline" size={18} color={Colors.primary} />
            </View>
            <View style={styles.fieldInput}>
              <Input
                label="Course Code"
                placeholder="e.g. BCS"
                value={code}
                onChangeText={(t) => {
                  setCode(t.toUpperCase());
                  setErrors((p) => ({ ...p, code: "" }));
                }}
                icon="code-outline"
                error={errors.code}
              />
            </View>
          </View>
        </View>

        {/* ── Preview card ── */}
        {(name || code) && (
          <>
            <Text style={styles.sectionLabel}>Preview</Text>
            <View style={styles.previewCard}>
              <View style={[styles.previewBar, { backgroundColor: Colors.cardGreen }]} />
              <View style={[styles.previewIcon, { backgroundColor: Colors.cardGreen + "18" }]}>
                <Ionicons name="book" size={22} color={Colors.cardGreen} />
              </View>
              <View style={styles.previewInfo}>
                <Text style={styles.previewName} numberOfLines={1}>
                  {name || "Course Name"}
                </Text>
                <View style={styles.previewMeta}>
                  {code ? (
                    <View style={[styles.codeBadge, { backgroundColor: Colors.cardGreen + "18" }]}>
                      <Text style={[styles.codeBadgeText, { color: Colors.cardGreen }]}>
                        {code}
                      </Text>
                    </View>
                  ) : null}
                  <Text style={styles.previewStudents}>0 students</Text>
                </View>
              </View>
            </View>
          </>
        )}

        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={15} color={Colors.cardGreen} />
          <Text style={[styles.infoNoteText, { color: Colors.cardGreen }]}>
            The course code should be short and unique. e.g. BCS, BICT, BSE.
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
            colors={["#059669", Colors.cardGreen]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            {loading ? (
              <Text style={styles.submitBtnText}>Registering...</Text>
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={18} color={Colors.white} />
                <Text style={styles.submitBtnText}>Register Course</Text>
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
  // Preview card
  previewCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
    overflow: "hidden", gap: Spacing.md,
    paddingRight: Spacing.md, paddingVertical: Spacing.md,
    ...Shadows.sm, marginBottom: Spacing.sm,
  },
  previewBar: { width: 5, height: "100%" },
  previewIcon: {
    width: 48, height: 48, borderRadius: Radius.md,
    justifyContent: "center", alignItems: "center",
  },
  previewInfo: { flex: 1 },
  previewName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: 4 },
  previewMeta: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  codeBadge: { borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  codeBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  previewStudents: { fontSize: FontSize.xs, color: Colors.subtext },
  infoNote: {
    flexDirection: "row", alignItems: "flex-start", gap: Spacing.sm,
    backgroundColor: Colors.successLight, borderRadius: Radius.lg,
    padding: Spacing.md, marginTop: Spacing.sm,
    borderWidth: 1, borderColor: Colors.cardGreen + "30",
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