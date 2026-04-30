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
import { gradingAPI } from "../../../services/api";

type QuestionResult = {
  question_number: number;
  question?: string;
  student_answer: string;
  correct_answer: string;
  marks_awarded: number;
  marks_available: number;
  is_correct: boolean;
  feedback?: string;
};

type GradingResult = {
  questions: QuestionResult[];
  total_marks_awarded: number;
  total_marks_available: number;
  overall_score: string;
  percentage: number;
  grade: string;
  summary?: string;
};

function getGradeStyle(percentage: number) {
  if (percentage >= 70) return { label: "Distinction", color: Colors.success, bg: Colors.successLight };
  if (percentage >= 60) return { label: "Credit", color: Colors.primary, bg: Colors.primaryLight };
  if (percentage >= 50) return { label: "Pass", color: Colors.warning, bg: Colors.warningLight };
  return { label: "Fail", color: Colors.error, bg: Colors.errorLight };
}

export default function GradeResult() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const { gradeId, unitName, studentName } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [gradingData, setGradingData] = useState<GradingResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token || !gradeId) return;
    setLoading(true);
    gradingAPI.getGrade(Number(gradeId), token)
      .then((data: any) => {
        console.log("GET grade response:", JSON.stringify(data).substring(0, 200));
        if (data?.grading_result) {
          setGradingData(data.grading_result);
        } else {
          console.log("No grading_result in response, data keys:", Object.keys(data || {}));
          setError(true);
        }
      })
      .catch((err) => {
        console.error("Failed to load grade:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [token, gradeId]);

  if (loading) {
    return (
      <View style={[styles.root, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ color: Colors.subtext, marginTop: Spacing.md, fontSize: FontSize.sm }}>
          Loading grading result...
        </Text>
      </View>
    );
  }

  if (error || !gradingData) {
    return (
      <View style={[styles.root, { justifyContent: "center", alignItems: "center" }]}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={{ color: Colors.text, marginTop: Spacing.md, fontSize: FontSize.md }}>
          Could not load grading result.
        </Text>
        <TouchableOpacity
          style={{ marginTop: Spacing.lg, padding: Spacing.md }}
          onPress={() => router.replace("/(lecturer)/grading")}
        >
          <Text style={{ color: Colors.primary, fontWeight: FontWeight.bold }}>Back to Grading</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { questions, total_marks_awarded, total_marks_available, percentage, grade, summary } = gradingData;
  const gradeStyle = getGradeStyle(percentage);

  const correct = questions.filter((q) => q.is_correct).length;
  const wrong = questions.filter((q) => !q.is_correct && q.student_answer).length;
  const unread = questions.filter((q) => !q.student_answer).length;

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
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Grade Report</Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {studentName} — {unitName}
            </Text>
          </View>
          <View style={[styles.headerGradeBadge, { backgroundColor: gradeStyle.color + "30" }]}>
            <Text style={[styles.headerGradeBadgeText, { color: Colors.white }]}>
              {grade} — {gradeStyle.label}
            </Text>
          </View>
        </View>

        {/* Score summary strip */}
        <View style={styles.scoreStrip}>
          <View style={styles.scoreMain}>
            <Text style={styles.scorePercent}>{Math.round(percentage)}%</Text>
            <Text style={styles.scoreFraction}>{total_marks_awarded}/{total_marks_available} marks</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripStat}>
            <View style={[styles.stripDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.stripNum}>{correct}</Text>
            <Text style={styles.stripLbl}>Correct</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripStat}>
            <View style={[styles.stripDot, { backgroundColor: Colors.error }]} />
            <Text style={styles.stripNum}>{wrong}</Text>
            <Text style={styles.stripLbl}>Wrong</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.stripStat}>
            <View style={[styles.stripDot, { backgroundColor: Colors.warning }]} />
            <Text style={styles.stripNum}>{unread}</Text>
            <Text style={styles.stripLbl}>Unread</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Summary from AI */}
        {summary ? (
          <View style={styles.summaryBox}>
            <View style={styles.summaryIconBox}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null}

        {/* Unread warning */}
        {unread > 0 && (
          <View style={styles.warningBox}>
            <View style={styles.warningIconBox}>
              <Ionicons name="warning-outline" size={18} color={Colors.warning} />
            </View>
            <Text style={styles.warningText}>
              {unread} answer(s) could not be read. Consider re-scanning.
            </Text>
          </View>
        )}

        {/* Question breakdown */}
        <Text style={styles.sectionLabel}>Question Breakdown</Text>

        {questions.map((q, index) => {
          const noAnswer = !q.student_answer;
          return (
            <View key={index} style={styles.questionCard}>
              <View
                style={[
                  styles.questionBar,
                  {
                    backgroundColor: noAnswer
                      ? Colors.warning
                      : q.is_correct
                      ? Colors.success
                      : Colors.error,
                  },
                ]}
              />
              <View style={styles.questionContent}>
                <View style={styles.questionHeader}>
                  <View style={styles.questionNumBox}>
                    <Text style={styles.questionNumText}>{q.question_number}</Text>
                  </View>
                  <Text style={styles.questionText} numberOfLines={3}>
                    {q.question || `Question ${q.question_number}`}
                  </Text>
                  {noAnswer ? (
                    <Ionicons name="help-circle" size={20} color={Colors.warning} />
                  ) : q.is_correct ? (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                  ) : (
                    <Ionicons name="close-circle" size={20} color={Colors.error} />
                  )}
                </View>

                <View style={styles.answerRow}>
                  <View style={[styles.answerBox, { borderColor: Colors.border }]}>
                    <Text style={styles.answerLabel}>Student answered</Text>
                    <Text style={[styles.answerValue, { color: q.is_correct ? Colors.success : Colors.error }]}>
                      {q.student_answer || "—"}
                    </Text>
                  </View>
                  <View style={[styles.answerBox, { borderColor: Colors.success + "60" }]}>
                    <Text style={styles.answerLabel}>Correct answer</Text>
                    <Text style={[styles.answerValue, { color: Colors.success }]}>
                      {q.correct_answer}
                    </Text>
                  </View>
                </View>

                <View style={styles.marksRow}>
                  <Text style={styles.marksText}>
                    {q.marks_awarded}/{q.marks_available} marks
                  </Text>
                  {q.feedback ? (
                    <Text style={styles.feedbackText} numberOfLines={2}>{q.feedback}</Text>
                  ) : null}
                </View>

                {noAnswer && (
                  <View style={styles.undetectedBox}>
                    <Ionicons name="scan-outline" size={13} color={Colors.warning} />
                    <Text style={styles.undetectedText}>Could not read answer from sheet</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* ── Sticky bottom bar ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <View style={styles.savedBadge}>
          <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
          <Text style={styles.savedBadgeText}>Grade saved</Text>
        </View>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => router.replace("/(lecturer)/grading")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveBtnGradient}
          >
            <Ionicons name="arrow-back-outline" size={18} color={Colors.white} />
            <Text style={styles.saveBtnText}>Grade Next Student</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center", alignItems: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  headerGradeBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 5,
  },
  headerGradeBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 0.5 },

  scoreStrip: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  scoreMain: { flex: 1.5, alignItems: "center" },
  scorePercent: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: Colors.white },
  scoreFraction: { fontSize: FontSize.xs, color: "rgba(255,255,255,0.65)", marginTop: 2 },
  stripDivider: { width: 1, height: 40, backgroundColor: "rgba(255,255,255,0.2)" },
  stripStat: { flex: 1, alignItems: "center", gap: 3 },
  stripDot: { width: 8, height: 8, borderRadius: 4 },
  stripNum: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.white },
  stripLbl: { fontSize: FontSize.xs, color: "rgba(255,255,255,0.65)" },

  body: { paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg },

  summaryBox: {
    flexDirection: "row", alignItems: "flex-start",
    backgroundColor: Colors.primaryLight, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.primary + "30",
    gap: Spacing.sm,
  },
  summaryIconBox: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.primary + "20",
    justifyContent: "center", alignItems: "center",
  },
  summaryText: { flex: 1, fontSize: FontSize.sm, color: Colors.text, lineHeight: 20 },

  warningBox: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.warningLight, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.warning + "30",
    gap: Spacing.sm,
  },
  warningIconBox: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.warning + "20",
    justifyContent: "center", alignItems: "center",
  },
  warningText: { flex: 1, fontSize: FontSize.sm, color: Colors.warning, lineHeight: 18 },

  sectionLabel: {
    fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.subtext,
    textTransform: "uppercase", letterSpacing: 1.2,
    marginBottom: Spacing.md,
  },

  questionCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
    overflow: "hidden", ...Shadows.sm,
  },
  questionBar: { width: 4 },
  questionContent: { flex: 1, padding: Spacing.md },
  questionHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: Spacing.sm, gap: Spacing.sm },
  questionNumBox: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center", alignItems: "center",
    flexShrink: 0,
  },
  questionNumText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.primary },
  questionText: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text, lineHeight: 18 },

  answerRow: { flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.sm },
  answerBox: {
    flex: 1, borderWidth: 1, borderRadius: Radius.md,
    padding: Spacing.sm,
  },
  answerLabel: { fontSize: 10, color: Colors.subtext, marginBottom: 2 },
  answerValue: { fontSize: FontSize.md, fontWeight: FontWeight.bold },

  marksRow: { marginBottom: Spacing.xs },
  marksText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.subtext },
  feedbackText: { fontSize: FontSize.xs, color: Colors.subtext, marginTop: 2, lineHeight: 16 },

  undetectedBox: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.warningLight, borderRadius: Radius.sm,
    padding: Spacing.sm, gap: Spacing.xs, marginTop: Spacing.xs,
  },
  undetectedText: { fontSize: FontSize.xs, color: Colors.warning },

  bottomBar: {
    flexDirection: "row", paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border,
    gap: Spacing.md, ...Shadows.md,
  },
  savedBadge: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: Colors.successLight, borderRadius: Radius.lg,
    paddingVertical: Spacing.md, gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.success + "30",
  },
  savedBadgeText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.success },
  saveBtn: { flex: 2, borderRadius: Radius.lg, overflow: "hidden", ...Shadows.colored },
  saveBtnGradient: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: Spacing.md, gap: Spacing.sm,
  },
  saveBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.white },
});
