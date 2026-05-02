import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

const COURSE_COLORS = [Colors.cardBlue, Colors.cardTeal, Colors.cardGreen, Colors.cardPurple];

export default function EnrollStudent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const { id, name, regNo } = useLocalSearchParams<{
    id: string;
    name: string;
    regNo: string;
  }>();

  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token || !id) return;
    loadData();
  }, [token, id]);

  const loadData = async () => {
    if (!token || !id) return;
    setLoading(true);
    try {
      const [coursesData, studentData] = await Promise.all([
        adminAPI.getAllCourses(token),
        adminAPI.getStudent(parseInt(id), token),
      ]);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      const enrolled: number[] = [];
      if (studentData?.enrollments) {
        for (const enr of studentData.enrollments) {
          enrolled.push(enr.course_id);
        }
      }
      setEnrolledCourseIds(enrolled);
      setSelectedCourseIds(enrolled);
    } catch (err) {
      console.error("Failed to load data:", err);
      Alert.alert("Error", "Failed to load student or courses data");
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = (courseId: number) => {
    if (enrolledCourseIds.includes(courseId)) return;
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((cId) => cId !== courseId) : [...prev, courseId]
    );
  };

  const handleSave = async () => {
    if (!token || !id) return;
    const toEnroll = selectedCourseIds.filter((cId) => !enrolledCourseIds.includes(cId));
    if (toEnroll.length === 0) {
      Alert.alert("No changes", "Student is already enrolled in the selected courses");
      return;
    }
    setSaving(true);
    let enrolledCount = 0;
    for (const courseId of toEnroll) {
      try {
        await adminAPI.enrollStudent(parseInt(id), courseId, token);
        enrolledCount++;
      } catch (err: any) {
        console.error(`Failed to enroll in course ${courseId}:`, err);
      }
    }
    setSaving(false);
    Alert.alert(
      "Success",
      `Enrolled in ${enrolledCount} course(s).`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  if (loading) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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
            <Text style={styles.headerTitle}>Enroll Student</Text>
            <Text style={styles.headerSub}>{name} ({regNo})</Text>
          </View>
        </View>
        {selectedCourseIds.length > 0 && (
          <View style={styles.enrollPill}>
            <Ionicons name="book" size={14} color={Colors.white} />
            <Text style={styles.enrollPillText}>{selectedCourseIds.length} course(s) selected</Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 100 }]}
      >
        <Text style={styles.sectionLabel}>Select Courses</Text>
        <Text style={styles.sectionHint}>Tap to enroll student in courses</Text>

        {courses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={40} color={Colors.placeholder} />
            <Text style={styles.emptyText}>No courses available</Text>
          </View>
        ) : (
          courses.map((course, idx) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            const isSelected = selectedCourseIds.includes(course.id);
            const color = COURSE_COLORS[idx % COURSE_COLORS.length];
            return (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.courseCard,
                  isEnrolled && styles.courseCardEnrolled,
                  isSelected && !isEnrolled && { borderColor: color, backgroundColor: color + "08" },
                ]}
                onPress={() => toggleCourse(course.id)}
                activeOpacity={0.7}
                disabled={isEnrolled}
              >
                <View style={[styles.courseIcon, { backgroundColor: isSelected ? color : color + "18" }]}>
                  <Ionicons name="book" size={20} color={isSelected ? Colors.white : color} />
                </View>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>{course.title}</Text>
                  <Text style={styles.courseCode}>{course.code}</Text>
                  {course.description && (
                    <Text style={styles.courseDesc} numberOfLines={1}>{course.description}</Text>
                  )}
                </View>
                {isEnrolled ? (
                  <View style={styles.enrolledBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles.enrolledBadgeText}>Enrolled</Text>
                  </View>
                ) : (
                  <View style={[styles.checkbox, isSelected && { backgroundColor: color, borderColor: color }]}>
                    {isSelected && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <LinearGradient
            colors={["#1A3BAA", Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradient}
          >
            {saving ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={18} color={Colors.white} />
                <Text style={styles.saveBtnText}>Save Enrollment</Text>
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
  center: { justifyContent: "center", alignItems: "center" },
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
  enrollPill: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)", borderRadius: Radius.full,
    alignSelf: "flex-start", paddingHorizontal: Spacing.md, paddingVertical: 5, gap: 5,
  },
  enrollPillText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.white },
  body: { paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg },
  sectionLabel: {
    fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.subtext,
    textTransform: "uppercase", letterSpacing: 1.2, marginBottom: Spacing.sm,
  },
  sectionHint: { fontSize: FontSize.sm, color: Colors.subtext, marginBottom: Spacing.md },
  emptyContainer: { alignItems: "center", paddingVertical: Spacing.xl * 3 },
  emptyText: { fontSize: FontSize.md, color: Colors.placeholder, marginTop: Spacing.md },
  courseCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1.5, borderColor: Colors.border,
    padding: Spacing.md, marginBottom: Spacing.sm,
    gap: Spacing.md, ...Shadows.sm,
  },
  courseCardEnrolled: { backgroundColor: Colors.successLight + "30", borderColor: Colors.success + "30" },
  courseIcon: {
    width: 44, height: 44, borderRadius: Radius.md,
    justifyContent: "center", alignItems: "center",
  },
  courseInfo: { flex: 1 },
  courseName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: 2 },
  courseCode: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.primary, marginBottom: 2 },
  courseDesc: { fontSize: FontSize.xs, color: Colors.subtext },
  enrolledBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  enrolledBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.success },
  checkbox: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: Colors.border,
    justifyContent: "center", alignItems: "center",
  },
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
  saveBtn: { flex: 2, borderRadius: Radius.lg, overflow: "hidden" },
  saveGradient: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: Spacing.md, gap: Spacing.sm,
  },
  saveBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.white },
});
