import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
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

// Mock student data with results
const STUDENT_DATA = {
  1: {
    id: 1,
    name: "John Doe",
    reg_no: "23/U/1234",
    student_no: "2300712345",
    course_id: 1,
    course_name: "BICT",
    course_color: Colors.cardBlue,
    results: [
      {
        id: 1,
        unit_name: "Introduction to Programming",
        unit_code: "PROG101",
        score: 78,
        total: 100,
        grade: "A",
        date_marked: "2025-03-15",
      },
      {
        id: 2,
        unit_name: "Web Development Basics",
        unit_code: "WEB101",
        score: 85,
        total: 100,
        grade: "A",
        date_marked: "2025-03-10",
      },
      {
        id: 3,
        unit_name: "Database Management",
        unit_code: "DB101",
        score: 72,
        total: 100,
        grade: "B+",
        date_marked: "2025-03-05",
      },
      {
        id: 4,
        unit_name: "Networking Fundamentals",
        unit_code: "NET101",
        score: 88,
        total: 100,
        grade: "A",
        date_marked: "2025-02-28",
      },
    ],
  },
  2: {
    id: 2,
    name: "Jane Smith",
    reg_no: "23/U/5678",
    student_no: "2300756789",
    course_id: 2,
    course_name: "BCS",
    course_color: Colors.cardTeal,
    results: [
      {
        id: 5,
        unit_name: "Algorithms & Data Structures",
        unit_code: "ALG201",
        score: 92,
        total: 100,
        grade: "A",
        date_marked: "2025-03-12",
      },
      {
        id: 6,
        unit_name: "Software Engineering",
        unit_code: "SE201",
        score: 80,
        total: 100,
        grade: "A",
        date_marked: "2025-03-08",
      },
    ],
  },
};

export default function StudentDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const student =
    STUDENT_DATA[parseInt(id as string) as keyof typeof STUDENT_DATA];

  if (!student) {
    return (
      <View style={styles.root}>
        <LinearGradient
          colors={["#062B6E", "#1044B2", "#1A56DB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
        </LinearGradient>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Student not found</Text>
        </View>
      </View>
    );
  }

  const avgScore =
    student.results.length > 0
      ? Math.round(
          student.results.reduce((sum, r) => sum + r.score, 0) /
            student.results.length,
        )
      : 0;

  const handleEdit = () => {
    router.push({
      pathname: "/(admin)/students/edit",
      params: { id: student.id },
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Student",
      "Are you sure you want to delete this student?",
      [
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            router.back();
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <LinearGradient
        colors={["#062B6E", "#1044B2", "#1A56DB"]}
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
            <Text style={styles.headerTitle}>Student Details</Text>
            <Text style={styles.headerSub}>{student.reg_no}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
      >
        {/* Student Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.avatarBox}>
            <Ionicons name="person-circle" size={56} color={Colors.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentMeta}>
              {student.student_no} • {student.reg_no}
            </Text>
            <View
              style={[
                styles.courseBadge,
                { backgroundColor: student.course_color + "20" },
              ]}
            >
              <Text
                style={[
                  styles.courseBadgeText,
                  { color: student.course_color },
                ]}
              >
                {student.course_name}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        {student.results.length > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{student.results.length}</Text>
              <Text style={styles.statLabel}>Units Marked</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{avgScore}%</Text>
              <Text style={styles.statLabel}>Average Score</Text>
            </View>
          </View>
        )}

        {/* Results Section */}
        <Text style={styles.sectionTitle}>Exam Results</Text>
        {student.results.length > 0 ? (
          <View style={styles.resultsList}>
            {student.results.map((result) => (
              <View key={result.id} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={styles.resultTitle}>
                    <Text style={styles.resultUnitName}>
                      {result.unit_name}
                    </Text>
                    <Text style={styles.resultUnitCode}>
                      {result.unit_code}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.gradeBox,
                      {
                        backgroundColor: result.grade.startsWith("A")
                          ? Colors.successLight
                          : result.grade.startsWith("B")
                            ? Colors.accentLight
                            : Colors.warningLight,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.gradText,
                        {
                          color: result.grade.startsWith("A")
                            ? Colors.success
                            : result.grade.startsWith("B")
                              ? Colors.accent
                              : Colors.warning,
                        },
                      ]}
                    >
                      {result.grade}
                    </Text>
                  </View>
                </View>
                <View style={styles.resultMeta}>
                  <Text style={styles.resultScore}>
                    Score:{" "}
                    <Text style={styles.resultScoreBold}>
                      {result.score}/{result.total}
                    </Text>
                  </Text>
                  <Text style={styles.resultDate}>
                    {new Date(result.date_marked).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateBox}>
            <Ionicons
              name="document-outline"
              size={40}
              color={Colors.subtext}
            />
            <Text style={styles.emptyStateText}>No results yet</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View
        style={[
          styles.actionBar,
          { paddingBottom: insets.bottom + Spacing.md },
        ]}
      >
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleEdit}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={18} color={Colors.primary} />
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
          <Text style={[styles.actionBtnText, { color: Colors.error }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -70,
    right: -50,
  },
  headerShapeS: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -20,
    left: -20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
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
  body: { paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: "row",
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: { flex: 1, justifyContent: "center" },
  studentName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: 2,
  },
  studentMeta: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginBottom: Spacing.xs,
  },
  courseBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  courseBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Shadows.sm,
  },
  statBox: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  resultsList: { gap: Spacing.md, marginBottom: Spacing.md },
  resultCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  resultTitle: { flex: 1 },
  resultUnitName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  resultUnitCode: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },
  gradeBox: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  gradText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  resultMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  resultScore: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
  },
  resultScoreBold: {
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  resultDate: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },
  emptyStateBox: {
    alignItems: "center",
    paddingVertical: Spacing.xl * 2,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyStateText: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginTop: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.subtext,
  },
  actionBar: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
    ...Shadows.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.lg,
    gap: Spacing.xs,
  },
  deleteBtn: {
    borderColor: Colors.error,
  },
  actionBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
});
