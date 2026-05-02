import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
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
import { authAPI, adminAPI } from "../../../services/api";

const COURSE_COLORS = [Colors.cardBlue, Colors.cardTeal, Colors.cardGreen, Colors.cardPurple];

export default function RegisterStudent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password] = useState("student123");
  const [regNo, setRegNo] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({ name: "", email: "", regNo: "" });

  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [showCoursePicker, setShowCoursePicker] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [registeredStudentId, setRegisteredStudentId] = useState<number | null>(null);

  useEffect(() => {
    if (token && showCoursePicker) {
      adminAPI.getAllCourses(token)
        .then((data) => setCourses(Array.isArray(data) ? data : []))
        .catch(console.error);
    }
  }, [token, showCoursePicker]);

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
      const result = await authAPI.signup(
        email.trim(),
        password,
        name.trim(),
        "student",
        regNo.trim(),
        department.trim() || undefined
      );
      if (result.detail) throw new Error(result.detail);
      setRegisteredStudentId(result.student?.id ?? result.id);
      setShowCoursePicker(true);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to register student");
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = (courseId: number) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const handleEnrollAndFinish = async () => {
    if (!token || !registeredStudentId) return;
    if (selectedCourseIds.length === 0) {
      setShowCoursePicker(false);
      Alert.alert("Success", `Student ${name} registered successfully!`, [
        { text: "OK", onPress: () => router.back() },
      ]);
      return;
    }
    setEnrolling(true);
    let enrolledCount = 0;
    for (const courseId of selectedCourseIds) {
      try {
        await adminAPI.enrollStudent(registeredStudentId, courseId, token);
        enrolledCount++;
      } catch (err) {
        console.error(`Failed to enroll in course ${courseId}:`, err);
      }
    }
    setEnrolling(false);
    Alert.alert(
      "Success",
      `Student registered and enrolled in ${enrolledCount} course(s).`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const handleSkipEnrollment = () => {
    setShowCoursePicker(false);
    Alert.alert("Success", `Student ${name} registered successfully!`, [
      { text: "OK", onPress: () => router.back() },
    ]);
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
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
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
            <Ionicons
              name="person-add-outline"
              size={13}
              color={Colors.white}
            />
            <Text style={styles.progressText}>Fill all fields to register</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 100 }]}
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
              <Ionicons name="mail-outline" size={18} color={Colors.accent} />
            </View>
            <View style={styles.fieldInput}>
              <Input
                label="Email Address"
                placeholder="e.g. student@example.com"
                value={email}
                onChangeText={(t) => { setEmail(t); setErrors((p) => ({ ...p, email: "" })); }}
                icon="mail-outline"
                keyboardType="email-address"
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

        {/* Password info */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={15} color={Colors.primary} />
          <Text style={styles.infoNoteText}>
            Default password: <Text style={{ fontWeight: "700" }}>student123</Text>.
            The student can change it after first login.
          </Text>
        </View>
      </ScrollView>

      {/* ── Sticky bottom bar ── */}
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
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <Ionicons name="person-add-outline" size={18} color={Colors.white} />
                <Text style={styles.submitBtnText}>Register Student</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── Course Enrollment Modal ── */}
      <Modal visible={showCoursePicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Enroll in Courses</Text>
                <Text style={styles.modalSub}>Select courses to enroll {name} in</Text>
              </View>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={handleSkipEnrollment}>
                <Ionicons name="close" size={24} color={Colors.subtext} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.courseList} showsVerticalScrollIndicator={false}>
              {courses.length === 0 ? (
                <Text style={styles.noCoursesText}>No courses available</Text>
              ) : (
                courses.map((course, idx) => {
                  const isSelected = selectedCourseIds.includes(course.id);
                  const color = COURSE_COLORS[idx % COURSE_COLORS.length];
                  return (
                    <TouchableOpacity
                      key={course.id}
                      style={[styles.courseOption, isSelected && styles.courseOptionActive]}
                      onPress={() => toggleCourse(course.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.courseOptionIcon, { backgroundColor: isSelected ? color : color + "18" }]}>
                        <Ionicons name="book" size={20} color={isSelected ? Colors.white : color} />
                      </View>
                      <View style={styles.courseOptionInfo}>
                        <Text style={styles.courseOptionName}>{course.title}</Text>
                        <Text style={styles.courseOptionSubtext}>{course.code}</Text>
                      </View>
                      <View style={[styles.checkbox, isSelected && { backgroundColor: color, borderColor: color }]}>
                        {isSelected && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>

            <View style={[styles.modalFooter, { paddingBottom: insets.bottom + Spacing.md }]}>
              <TouchableOpacity style={styles.modalSkipBtn} onPress={handleSkipEnrollment}>
                <Text style={styles.modalSkipText}>Skip for now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalEnrollBtn, enrolling && { opacity: 0.7 }]}
                onPress={handleEnrollAndFinish}
                disabled={enrolling}
              >
                {enrolling ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={18} color={Colors.white} />
                    <Text style={styles.modalEnrollText}>
                      Enroll {selectedCourseIds.length > 0 && `(${selectedCourseIds.length})`}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
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
  headerText: { flex: 1 },
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
  progressRow: { flexDirection: "row" },
  progressPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    gap: 5,
  },
  progressText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
  body: { paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.subtext,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
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
  fieldInput: { flex: 1 },
  fieldDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.md + 38 + Spacing.md,
  },
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
  submitBtnDisabled: { opacity: 0.7 },
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
  pickLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.subtext,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  pickButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.border,
  },
  pickButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  pickButtonSubtext: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
    marginTop: 2,
  },
  pickPlaceholder: {
    fontSize: FontSize.md,
    color: Colors.placeholder,
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  modalCloseBtn: {
    padding: Spacing.sm,
  },
  courseList: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  courseOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: Spacing.md,
  },
  courseOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  courseOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  courseOptionCode: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  courseOptionInfo: {
    flex: 1,
  },
  courseOptionName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  courseOptionSubtext: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },
  modalSub: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
    marginTop: 2,
  },
  noCoursesText: {
    padding: Spacing.lg,
    textAlign: "center",
    color: Colors.subtext,
    fontSize: FontSize.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  modalSkipBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSkipText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.subtext,
  },
  modalEnrollBtn: {
    flex: 2,
    flexDirection: "row",
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    ...Shadows.colored,
  },
  modalEnrollText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
});
