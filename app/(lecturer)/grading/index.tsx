import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

const COURSES = [
  {
    id: 1,
    name: "Bachelor of Information Technology",
    code: "BICT",
    color: Colors.cardBlue,
    students: [
      { id: 1, name: "John Doe", reg_no: "23/U/1234" },
      { id: 2, name: "Jane Smith", reg_no: "23/U/5678" },
    ],
  },
  {
    id: 2,
    name: "Bachelor of Computer Science",
    code: "BCS",
    color: Colors.cardTeal,
    students: [
      { id: 3, name: "Peter Okello", reg_no: "23/U/9101" },
      { id: 4, name: "Mary Akello", reg_no: "23/U/1121" },
    ],
  },
];

export default function GradingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedCourse, setSelectedCourse] = useState<(typeof COURSES)[0] | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  const handleSelectCourse = (course: (typeof COURSES)[0]) => {
    setSelectedCourse(course);
    setSelectedStudent(null);
  };

  const handleStartGrading = () => {
    if (!selectedCourse || !selectedStudent) return;
    router.push({
      pathname: "/(lecturer)/grading/scan",
      params: { courseId: selectedCourse.id, studentId: selectedStudent },
    });
  };

  const currentStep = !selectedCourse ? 1 : !selectedStudent ? 2 : 3;

  return (
    <View style={styles.root}>
      {/* ── Gradient header ── */}
      <LinearGradient
        colors={["#062B6E", "#1044B2", "#1A56DB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}
      >
        <View style={styles.headerShapeL} />
        <View style={styles.headerShapeS} />

        <View style={styles.headerTop}>
          <View style={styles.headerIconBox}>
            <Ionicons name="scan" size={22} color={Colors.white} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Grade Students</Text>
            <Text style={styles.headerSub}>Select course and student to begin</Text>
          </View>
        </View>

        {/* Step indicator */}
        <View style={styles.stepsRow}>
          {[
            { n: 1, label: "Course" },
            { n: 2, label: "Student" },
            { n: 3, label: "Scan" },
          ].map((s, i, arr) => {
            const done = currentStep > s.n;
            const active = currentStep === s.n;
            return (
              <View key={s.n} style={styles.stepGroup}>
                <View style={styles.step}>
                  <View style={[styles.stepCircle, (active || done) && styles.stepCircleActive]}>
                    {done ? (
                      <Ionicons name="checkmark" size={13} color={Colors.primary} />
                    ) : (
                      <Text style={[styles.stepNum, (active || done) && styles.stepNumActive]}>
                        {s.n}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.stepLabel, (active || done) && styles.stepLabelActive]}>
                    {s.label}
                  </Text>
                </View>
                {i < arr.length - 1 && (
                  <View style={[styles.stepLine, done && styles.stepLineActive]} />
                )}
              </View>
            );
          })}
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + Spacing.xl * 2 },
        ]}
      >
        {/* ── STEP 1 ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step 1</Text>
          </View>
          <Text style={styles.sectionTitle}>Select Course</Text>
          <Text style={styles.sectionSub}>Choose the course you are grading for</Text>
        </View>

        {COURSES.map((course) => {
          const isActive = selectedCourse?.id === course.id;
          return (
            <TouchableOpacity
              key={course.id}
              style={[styles.courseCard, isActive && styles.courseCardActive]}
              onPress={() => handleSelectCourse(course)}
              activeOpacity={0.85}
            >
              {isActive && (
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <View style={[styles.courseBar, { backgroundColor: isActive ? "rgba(255,255,255,0.35)" : course.color }]} />
              <View style={[styles.courseIcon, { backgroundColor: isActive ? "rgba(255,255,255,0.18)" : course.color + "18" }]}>
                <Ionicons name="book" size={20} color={isActive ? Colors.white : course.color} />
              </View>
              <View style={styles.courseInfo}>
                <Text style={[styles.courseName, isActive && styles.whiteText]} numberOfLines={2}>
                  {course.name}
                </Text>
                <View style={styles.courseMeta}>
                  <View style={[styles.codePill, { backgroundColor: isActive ? "rgba(255,255,255,0.2)" : course.color + "18" }]}>
                    <Text style={[styles.codePillText, { color: isActive ? Colors.white : course.color }]}>
                      {course.code}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="people-outline" size={12} color={isActive ? "rgba(255,255,255,0.7)" : Colors.subtext} />
                    <Text style={[styles.metaText, isActive && styles.whiteSubText]}>
                      {course.students.length} students
                    </Text>
                  </View>
                </View>
              </View>
              {isActive
                ? <View style={styles.checkCircle}><Ionicons name="checkmark" size={16} color={Colors.primary} /></View>
                : <View style={styles.radioCircle} />
              }
            </TouchableOpacity>
          );
        })}

        {/* ── STEP 2 ── */}
        {selectedCourse && (
          <>
            <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
              <View style={[styles.stepBadge, { backgroundColor: Colors.accentLight }]}>
                <Text style={[styles.stepBadgeText, { color: Colors.accent }]}>Step 2</Text>
              </View>
              <Text style={styles.sectionTitle}>Select Student</Text>
              <Text style={styles.sectionSub}>Students enrolled in {selectedCourse.code}</Text>
            </View>

            {selectedCourse.students.map((student) => {
              const isActive = selectedStudent === student.id;
              return (
                <TouchableOpacity
                  key={student.id}
                  style={[styles.studentCard, isActive && styles.studentCardActive]}
                  onPress={() => setSelectedStudent(student.id)}
                  activeOpacity={0.85}
                >
                  {isActive && (
                    <LinearGradient
                      colors={[Colors.primary, Colors.primaryDark]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                  )}
                  <View style={[styles.studentAvatar, isActive && styles.studentAvatarActive]}>
                    <Text style={[styles.studentAvatarText, isActive && styles.whiteText]}>
                      {student.name[0]}
                    </Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={[styles.studentName, isActive && styles.whiteText]}>{student.name}</Text>
                    <View style={styles.metaRow}>
                      <Ionicons name="card-outline" size={12} color={isActive ? "rgba(255,255,255,0.7)" : Colors.subtext} />
                      <Text style={[styles.metaText, isActive && styles.whiteSubText]}>{student.reg_no}</Text>
                    </View>
                  </View>
                  {isActive
                    ? <View style={styles.checkCircle}><Ionicons name="checkmark" size={16} color={Colors.primary} /></View>
                    : <View style={styles.radioCircle} />
                  }
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* ── STEP 3 ── */}
        {selectedCourse && selectedStudent && (
          <>
            <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
              <View style={[styles.stepBadge, { backgroundColor: Colors.successLight }]}>
                <Text style={[styles.stepBadgeText, { color: Colors.success }]}>Step 3</Text>
              </View>
              <Text style={styles.sectionTitle}>Ready to Scan</Text>
              <Text style={styles.sectionSub}>Camera will open to capture the answer sheet</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={[styles.summaryIcon, { backgroundColor: Colors.primaryLight }]}>
                  <Ionicons name="book-outline" size={18} color={Colors.primary} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Course</Text>
                  <Text style={styles.summaryValue} numberOfLines={1}>{selectedCourse.name}</Text>
                </View>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <View style={[styles.summaryIcon, { backgroundColor: Colors.accentLight }]}>
                  <Ionicons name="person-outline" size={18} color={Colors.accent} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Student</Text>
                  <Text style={styles.summaryValue}>
                    {selectedCourse.students.find((s) => s.id === selectedStudent)?.name}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.proceedBtn} onPress={handleStartGrading} activeOpacity={0.88}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.proceedGradient}
              >
                <View style={styles.proceedIconBox}>
                  <Ionicons name="scan-outline" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.proceedBtnText}>Proceed to Scan</Text>
                <Ionicons name="arrow-forward" size={18} color={Colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, overflow: "hidden" },
  headerShapeL: {
    position: "absolute", width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.05)", top: -70, right: -50,
  },
  headerShapeS: {
    position: "absolute", width: 110, height: 110, borderRadius: 55,
    backgroundColor: "rgba(255,255,255,0.05)", bottom: -20, left: -20,
  },
  headerTop: { flexDirection: "row", alignItems: "center", gap: Spacing.md, marginBottom: Spacing.lg },
  headerIconBox: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center", alignItems: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  stepsRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.md,
  },
  stepGroup: { flexDirection: "row", alignItems: "center", flex: 1 },
  step: { alignItems: "center", gap: 4 },
  stepCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center", alignItems: "center",
  },
  stepCircleActive: { backgroundColor: Colors.white },
  stepNum: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: "rgba(255,255,255,0.6)" },
  stepNumActive: { color: Colors.primary },
  stepLabel: { fontSize: FontSize.xs, color: "rgba(255,255,255,0.6)" },
  stepLabelActive: { color: Colors.white, fontWeight: FontWeight.semibold },
  stepLine: {
    flex: 1, height: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: Spacing.xs, marginBottom: Spacing.lg,
  },
  stepLineActive: { backgroundColor: Colors.white },
  body: { paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg },
  sectionHeader: { marginBottom: Spacing.md },
  stepBadge: {
    alignSelf: "flex-start", backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full, paddingHorizontal: Spacing.sm,
    paddingVertical: 3, marginBottom: Spacing.xs,
  },
  stepBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.primary },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  sectionSub: { fontSize: FontSize.sm, color: Colors.subtext, marginTop: 2 },
  courseCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    marginBottom: Spacing.sm, borderWidth: 1.5, borderColor: Colors.border,
    overflow: "hidden", paddingRight: Spacing.md, paddingVertical: Spacing.md,
    gap: Spacing.md, ...Shadows.sm,
  },
  courseCardActive: { borderColor: Colors.primary },
  courseBar: { width: 5, height: "100%" },
  courseIcon: { width: 44, height: 44, borderRadius: Radius.md, justifyContent: "center", alignItems: "center" },
  courseInfo: { flex: 1 },
  courseName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: 4, lineHeight: 20 },
  courseMeta: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  codePill: { borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  codePillText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontSize: FontSize.xs, color: Colors.subtext },
  studentCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    marginBottom: Spacing.sm, borderWidth: 1.5, borderColor: Colors.border,
    overflow: "hidden", padding: Spacing.md,
    gap: Spacing.md, ...Shadows.sm,
  },
  studentCardActive: { borderColor: Colors.primary },
  studentAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center", alignItems: "center",
  },
  studentAvatarActive: { backgroundColor: "rgba(255,255,255,0.2)" },
  studentAvatarText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.primary },
  studentInfo: { flex: 1 },
  studentName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: 3 },
  whiteText: { color: Colors.white },
  whiteSubText: { color: "rgba(255,255,255,0.75)" },
  radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border },
  checkCircle: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.white, justifyContent: "center", alignItems: "center",
  },
  summaryCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.md, ...Shadows.sm, overflow: "hidden",
  },
  summaryRow: { flexDirection: "row", alignItems: "center", padding: Spacing.md, gap: Spacing.md },
  summaryDivider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.md + 44 + Spacing.md },
  summaryIcon: { width: 44, height: 44, borderRadius: Radius.md, justifyContent: "center", alignItems: "center" },
  summaryInfo: { flex: 1 },
  summaryLabel: { fontSize: FontSize.xs, color: Colors.subtext, marginBottom: 2 },
  summaryValue: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  proceedBtn: { borderRadius: Radius.xl, overflow: "hidden", marginBottom: Spacing.md, ...Shadows.colored },
  proceedGradient: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.lg, gap: Spacing.md,
  },
  proceedIconBox: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.white, justifyContent: "center", alignItems: "center",
  },
  proceedBtnText: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.white },
});