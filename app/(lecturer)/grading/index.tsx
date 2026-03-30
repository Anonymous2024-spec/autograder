import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, Radius, Spacing } from "../../../constants";

// Each course has a list of students enrolled in it
const COURSES = [
  {
    id: 1,
    name: "Bachelor of Information Technology",
    code: "BICT",
    students: [
      { id: 1, name: "John Doe", reg_no: "23/U/1234" },
      { id: 2, name: "Jane Smith", reg_no: "23/U/5678" },
    ],
  },
  {
    id: 2,
    name: "Bachelor of Computer Science",
    code: "BCS",
    students: [
      { id: 3, name: "Peter Okello", reg_no: "23/U/9101" },
      { id: 4, name: "Mary Akello", reg_no: "23/U/1121" },
    ],
  },
];

export default function GradingScreen() {
  const router = useRouter();

  // Track selected course object and selected student id
  const [selectedCourse, setSelectedCourse] = useState<
    (typeof COURSES)[0] | null
  >(null);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  // When a course is selected reset student selection
  const handleSelectCourse = (course: (typeof COURSES)[0]) => {
    setSelectedCourse(course);
    setSelectedStudent(null);
  };

  const handleStartGrading = () => {
    if (!selectedCourse || !selectedStudent) {
      alert("Please select both a course and a student");
      return;
    }

    // Navigate to scan screen with course and student context
    router.push({
      pathname: "/(lecturer)/grading",
      params: {
        courseId: selectedCourse.id,
        studentId: selectedStudent,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Step indicator ── */}
        <View style={styles.stepsRow}>
          {/* Step 1 */}
          <View style={styles.step}>
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <Text style={styles.stepNumberActive}>1</Text>
            </View>
            <Text style={styles.stepLabelActive}>Course</Text>
          </View>

          {/* Connector */}
          <View
            style={[styles.stepLine, selectedCourse && styles.stepLineActive]}
          />

          {/* Step 2 */}
          <View style={styles.step}>
            <View
              style={[
                styles.stepCircle,
                selectedCourse && styles.stepCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  selectedCourse && styles.stepNumberActive,
                ]}
              >
                2
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                selectedCourse && styles.stepLabelActive,
              ]}
            >
              Student
            </Text>
          </View>

          {/* Connector */}
          <View
            style={[
              styles.stepLine,
              selectedStudent ? styles.stepLineActive : null,
            ]}
          />

          {/* Step 3 */}
          <View style={styles.step}>
            <View
              style={[
                styles.stepCircle,
                selectedStudent ? styles.stepCircleActive : undefined,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  selectedStudent ? styles.stepNumberActive : undefined,
                ]}
              >
                3
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                selectedStudent ? styles.stepLabelActive : null,
              ]}
            >
              Scan
            </Text>
          </View>
        </View>

        {/* ── Course selection ── */}
        <Text style={styles.sectionTitle}>Select Course</Text>
        {COURSES.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={[
              styles.selectCard,
              selectedCourse?.id === course.id && styles.selectCardActive,
            ]}
            onPress={() => handleSelectCourse(course)}
          >
            <Ionicons
              name="book-outline"
              size={22}
              color={
                selectedCourse?.id === course.id ? Colors.white : Colors.primary
              }
            />

            <View style={styles.selectInfo}>
              <Text
                style={[
                  styles.selectName,
                  selectedCourse?.id === course.id && styles.selectTextActive,
                ]}
              >
                {course.name}
              </Text>
              <Text
                style={[
                  styles.selectCode,
                  selectedCourse?.id === course.id && styles.selectSubActive,
                ]}
              >
                {course.code} · {course.students.length} students
              </Text>
            </View>

            {selectedCourse?.id === course.id && (
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={Colors.white}
              />
            )}
          </TouchableOpacity>
        ))}

        {/* ── Student selection — only visible after course is picked ── */}
        {selectedCourse && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>
              Select Student
            </Text>

            {/* Show students belonging to selected course only */}
            {selectedCourse.students.map((student) => (
              <TouchableOpacity
                key={student.id}
                style={[
                  styles.selectCard,
                  selectedStudent === student.id && styles.selectCardActive,
                ]}
                onPress={() => setSelectedStudent(student.id)}
              >
                {/* Avatar */}
                <View
                  style={[
                    styles.studentAvatar,
                    selectedStudent === student.id &&
                      styles.studentAvatarActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.studentAvatarText,
                      selectedStudent === student.id &&
                        styles.studentAvatarTextActive,
                    ]}
                  >
                    {student.name[0]}
                  </Text>
                </View>

                <View style={styles.selectInfo}>
                  <Text
                    style={[
                      styles.selectName,
                      selectedStudent === student.id && styles.selectTextActive,
                    ]}
                  >
                    {student.name}
                  </Text>
                  <Text
                    style={[
                      styles.selectCode,
                      selectedStudent === student.id && styles.selectSubActive,
                    ]}
                  >
                    {student.reg_no}
                  </Text>
                </View>

                {selectedStudent === student.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={Colors.white}
                  />
                )}
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* ── Start grading button ── */}
        {selectedCourse && selectedStudent && (
          <TouchableOpacity style={styles.button} onPress={handleStartGrading}>
            <Ionicons name="scan-outline" size={20} color={Colors.white} />
            <Text style={styles.buttonText}>Proceed to Scan</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },

  // ── Step indicator ──
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  step: {
    alignItems: "center",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  stepCircleActive: {
    backgroundColor: Colors.primary,
  },
  stepNumber: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.subtext,
  },
  stepNumberActive: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.white,
  },
  stepLabel: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },
  stepLabelActive: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: "600",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.border,
    marginBottom: Spacing.lg,
    marginHorizontal: Spacing.xs,
  },
  stepLineActive: {
    backgroundColor: Colors.primary,
  },

  // ── Selection cards ──
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  selectCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  selectCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  selectName: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text,
  },
  selectTextActive: {
    color: Colors.white,
  },
  selectCode: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginTop: Spacing.xs,
  },
  selectSubActive: {
    color: "rgba(255,255,255,0.75)",
  },

  // ── Student avatar ──
  studentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  studentAvatarActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  studentAvatarText: {
    fontSize: FontSize.md,
    fontWeight: "bold",
    color: Colors.primary,
  },
  studentAvatarTextActive: {
    color: Colors.white,
  },

  // ── Proceed button ──
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xl,
    gap: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.white,
  },
});
