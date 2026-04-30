import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { lecturerAPI } from "../../../services/api";

type GradeEntry = {
  id: number;
  unit_id: number;
  unit_name: string;
  marks_awarded: number;
  marks_available: number;
  percentage: number;
  grade_letter: string;
  feedback: string;
  marked_at: string;
  questions?: any[];
  summary?: string;
};

function getGradeStyle(grade_letter: string) {
  if (["A"].includes(grade_letter)) return { color: Colors.success, bg: Colors.successLight };
  if (["B"].includes(grade_letter)) return { color: Colors.primary, bg: Colors.primaryLight };
  if (["C"].includes(grade_letter)) return { color: Colors.accent, bg: Colors.accentLight };
  if (["D"].includes(grade_letter)) return { color: Colors.warning, bg: Colors.warningLight };
  return { color: Colors.error, bg: Colors.errorLight };
}

export default function StudentDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const { id, userId, name } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState<string>(name as string || "");
  const [grades, setGrades] = useState<GradeEntry[]>([]);

  useEffect(() => {
    if (!token || !userId) return;
    setLoading(true);
    lecturerAPI.getStudentGrades(Number(userId), token)
      .then((data: any) => {
        setStudentName(data?.student?.name || (name as string) || "Unknown Student");
        setGrades(Array.isArray(data?.grades) ? data.grades : []);
      })
      .catch((err) => {
        console.error("Failed to load grades:", err);
      })
      .finally(() => setLoading(false));
  }, [token, userId]);

  const avgPercentage = grades.length > 0
    ? Math.round(grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length)
    : 0;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#062B6E", "#1044B2", "#1A56DB"]}
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
            <Text style={styles.headerTitle}>Student Details</Text>
            <Text style={styles.headerSub} numberOfLines={1}>{studentName}</Text>
          </View>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading results...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + Spacing.xl }]}
        >
          {/* Student Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.avatarBox}>
              <Ionicons name="person-circle" size={56} color={Colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.studentName}>{studentName}</Text>
            </View>
          </View>

          {/* Stats Row */}
          {grades.length > 0 && (
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{grades.length}</Text>
                <Text style={styles.statLabel}>Units Graded</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{avgPercentage}%</Text>
                <Text style={styles.statLabel}>Average Score</Text>
              </View>
            </View>
          )}

          {/* Results Section */}
          <Text style={styles.sectionTitle}>Exam Results</Text>
          {grades.length > 0 ? (
            <View style={styles.resultsList}>
              {grades.map((grade) => {
                const gradeStyle = getGradeStyle(grade.grade_letter);
                return (
                  <View key={grade.id} style={styles.resultCard}>
                    <View style={styles.resultHeader}>
                      <View style={styles.resultTitle}>
                        <Text style={styles.resultUnitName} numberOfLines={2}>
                          {grade.unit_name}
                        </Text>
                      </View>
                      <View style={[styles.gradeBox, { backgroundColor: gradeStyle.bg }]}>
                        <Text style={[styles.gradeText, { color: gradeStyle.color }]}>
                          {grade.grade_letter}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.resultMeta}>
                      <Text style={styles.resultScore}>
                        Score:{" "}
                        <Text style={styles.resultScoreBold}>
                          {grade.marks_awarded}/{grade.marks_available}
                        </Text>
                        {"  "}({Math.round(grade.percentage)}%)
                      </Text>
                      <Text style={styles.resultDate}>
                        {new Date(grade.marked_at).toLocaleDateString()}
                      </Text>
                    </View>

                    {/* Feedback */}
                    {grade.summary && (
                      <View style={styles.feedbackBox}>
                        <Ionicons name="chatbubble-ellipses-outline" size={14} color={Colors.subtext} />
                        <Text style={styles.feedbackText} numberOfLines={3}>
                          {grade.summary}
                        </Text>
                      </View>
                    )}

                    {/* Expandable questions */}
                    {grade.questions && grade.questions.length > 0 && (
                      <QuestionBreakdown questions={grade.questions} />
                    )}
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyStateBox}>
              <Ionicons name="document-outline" size={40} color={Colors.subtext} />
              <Text style={styles.emptyStateText}>No results yet</Text>
              <Text style={styles.emptyStateSub}>Scan the student&apos;s answer sheet to grade them</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

function QuestionBreakdown({ questions }: { questions: any[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.qBreakdown}>
      <TouchableOpacity
        style={styles.expandBtn}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Ionicons name="list-outline" size={16} color={Colors.primary} />
        <Text style={styles.expandBtnText}>
          {questions.length} question{questions.length !== 1 ? "s" : ""}
        </Text>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={16} color={Colors.primary} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.questionsList}>
          {questions.map((q: any, i: number) => (
            <View key={i} style={styles.questionItem}>
              <View style={styles.questionItemHeader}>
                <View style={styles.questionItemNum}>
                  <Text style={styles.questionItemNumText}>{q.question_number}</Text>
                </View>
                <Text style={styles.questionItemText} numberOfLines={2}>
                  {q.question || `Question ${q.question_number}`}
                </Text>
                <Ionicons
                  name={q.is_correct ? "checkmark-circle" : q.student_answer ? "close-circle" : "help-circle"}
                  size={18}
                  color={q.is_correct ? Colors.success : q.student_answer ? Colors.error : Colors.warning}
                />
              </View>
              <View style={styles.questionItemAnswers}>
                <Text style={styles.qAnswerLabel}>Student:</Text>
                <Text style={[styles.qAnswerValue, { color: q.is_correct ? Colors.success : Colors.error }]} numberOfLines={2}>
                  {q.student_answer || "—"}
                </Text>
              </View>
              <View style={styles.questionItemAnswers}>
                <Text style={styles.qAnswerLabel}>Correct:</Text>
                <Text style={[styles.qAnswerValue, { color: Colors.success }]} numberOfLines={2}>
                  {q.correct_answer}
                </Text>
              </View>
              <Text style={styles.qMarks}>{q.marks_awarded}/{q.marks_available} marks</Text>
            </View>
          ))}
        </View>
      )}
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
  headerTop: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center", alignItems: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  body: { paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg },
  loadingBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: FontSize.sm, color: Colors.subtext, marginTop: Spacing.md },
  infoCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg,
    marginBottom: Spacing.md, flexDirection: "row", gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, ...Shadows.sm,
  },
  avatarBox: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primaryLight,
    justifyContent: "center", alignItems: "center",
  },
  infoContent: { flex: 1, justifyContent: "center" },
  studentName: {
    fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text,
  },
  statsRow: {
    flexDirection: "row", backgroundColor: Colors.surface, borderRadius: Radius.xl,
    marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, overflow: "hidden", ...Shadows.sm,
  },
  statBox: { flex: 1, paddingVertical: Spacing.md, alignItems: "center", justifyContent: "center" },
  statNumber: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.subtext, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  sectionTitle: {
    fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text,
    marginBottom: Spacing.md, marginTop: Spacing.sm,
  },
  resultsList: { gap: Spacing.md, marginBottom: Spacing.md },
  resultCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, ...Shadows.sm,
  },
  resultHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: Spacing.sm },
  resultTitle: { flex: 1 },
  resultUnitName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: 2 },
  gradeBox: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  gradeText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  resultMeta: {
    flexDirection: "row", justifyContent: "space-between",
    paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  resultScore: { fontSize: FontSize.sm, color: Colors.subtext },
  resultScoreBold: { fontWeight: FontWeight.bold, color: Colors.text },
  resultDate: { fontSize: FontSize.xs, color: Colors.subtext },
  feedbackBox: {
    flexDirection: "row", alignItems: "flex-start", gap: Spacing.xs,
    backgroundColor: Colors.background, borderRadius: Radius.md,
    padding: Spacing.sm, marginTop: Spacing.sm,
  },
  feedbackText: { flex: 1, fontSize: FontSize.xs, color: Colors.subtext, lineHeight: 16 },
  qBreakdown: { marginTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm },
  expandBtn: { flexDirection: "row", alignItems: "center", gap: Spacing.xs, paddingVertical: Spacing.xs },
  expandBtnText: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primary },
  questionsList: { gap: Spacing.sm, marginTop: Spacing.sm },
  questionItem: {
    backgroundColor: Colors.background, borderRadius: Radius.md, padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  questionItemHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.sm, marginBottom: Spacing.xs },
  questionItemNum: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primaryLight,
    justifyContent: "center", alignItems: "center",
  },
  questionItemNumText: { fontSize: FontSize.xs - 1, fontWeight: FontWeight.bold, color: Colors.primary },
  questionItemText: { flex: 1, fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.text, lineHeight: 16 },
  questionItemAnswers: { marginBottom: 2 },
  qAnswerLabel: { fontSize: 10, color: Colors.subtext, marginBottom: 1 },
  qAnswerValue: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  qMarks: { fontSize: FontSize.xs - 1, fontWeight: FontWeight.bold, color: Colors.subtext, marginTop: Spacing.xs },
  emptyStateBox: { alignItems: "center", paddingVertical: Spacing.xl * 2, backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border },
  emptyStateText: { fontSize: FontSize.sm, color: Colors.subtext, marginTop: Spacing.sm },
  emptyStateSub: { fontSize: FontSize.xs, color: Colors.placeholder, marginTop: 4 },
});
