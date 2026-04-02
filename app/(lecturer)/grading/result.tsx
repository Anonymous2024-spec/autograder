import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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

const MOCK_RESULTS = [
  {
    id: 1,
    question: "What is the full meaning of CPU?",
    options: [
      { label: "A", text: "Central Processing Unit" },
      { label: "B", text: "Computer Personal Unit" },
      { label: "C", text: "Central Program Utility" },
      { label: "D", text: "Core Processing Unit" },
    ],
    correct_answer: "A",
    detected_answer: "A",
  },
  {
    id: 2,
    question: "Which data structure uses FIFO order?",
    options: [
      { label: "A", text: "Stack" },
      { label: "B", text: "Queue" },
      { label: "C", text: "Tree" },
      { label: "D", text: "Graph" },
    ],
    correct_answer: "B",
    detected_answer: "C",
  },
  {
    id: 3,
    question: "What does RAM stand for?",
    options: [
      { label: "A", text: "Random Access Memory" },
      { label: "B", text: "Read Access Module" },
      { label: "C", text: "Random Array Memory" },
      { label: "D", text: "Read Allocate Memory" },
    ],
    correct_answer: "A",
    detected_answer: "A",
  },
  {
    id: 4,
    question: "Which language is used for web styling?",
    options: [
      { label: "A", text: "Python" },
      { label: "B", text: "Java" },
      { label: "C", text: "CSS" },
      { label: "D", text: "C++" },
    ],
    correct_answer: "C",
    detected_answer: null,
  },
];

export default function GradeResult() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { courseId, studentId } = useLocalSearchParams();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const correct = MOCK_RESULTS.filter((q) => q.detected_answer === q.correct_answer).length;
  const total = MOCK_RESULTS.length;
  const undetected = MOCK_RESULTS.filter((q) => q.detected_answer === null).length;
  const wrong = total - correct - undetected;
  const percentage = Math.round((correct / total) * 100);

  const getGrade = () => {
    if (percentage >= 80) return { label: "Distinction", color: Colors.success, bg: Colors.successLight };
    if (percentage >= 70) return { label: "Credit", color: Colors.primary, bg: Colors.primaryLight };
    if (percentage >= 60) return { label: "Pass", color: Colors.warning, bg: Colors.warningLight };
    return { label: "Fail", color: Colors.error, bg: Colors.errorLight };
  };

  const grade = getGrade();

  const handleSave = () => {
    Alert.alert("Save Mark", `Save ${correct}/${total} (${percentage}%) for this student?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Save",
        onPress: async () => {
          setSaving(true);
          setTimeout(() => { setSaving(false); setSaved(true); }, 1500);
        },
      },
    ]);
  };

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
            <Text style={styles.headerSub}>Auto-marked answer sheet result</Text>
          </View>
          {/* Grade badge in header */}
          <View style={[styles.headerGradeBadge, { backgroundColor: grade.color + "30" }]}>
            <Text style={[styles.headerGradeBadgeText, { color: Colors.white }]}>
              {grade.label}
            </Text>
          </View>
        </View>

        {/* Score summary strip */}
        <View style={styles.scoreStrip}>
          <View style={styles.scoreMain}>
            <Text style={styles.scorePercent}>{percentage}%</Text>
            <Text style={styles.scoreFraction}>{correct}/{total} correct</Text>
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
            <Text style={styles.stripNum}>{undetected}</Text>
            <Text style={styles.stripLbl}>Unread</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Undetected warning */}
        {undetected > 0 && (
          <View style={styles.warningBox}>
            <View style={styles.warningIconBox}>
              <Ionicons name="warning-outline" size={18} color={Colors.warning} />
            </View>
            <Text style={styles.warningText}>
              {undetected} answer(s) could not be read. Consider re-scanning.
            </Text>
          </View>
        )}

        {/* Question breakdown */}
        <Text style={styles.sectionLabel}>Question Breakdown</Text>

        {MOCK_RESULTS.map((q, index) => {
          const isCorrect = q.detected_answer === q.correct_answer;
          const isUndetected = q.detected_answer === null;

          return (
            <View key={q.id} style={styles.questionCard}>
              {/* Left status bar */}
              <View
                style={[
                  styles.questionBar,
                  {
                    backgroundColor: isUndetected
                      ? Colors.warning
                      : isCorrect
                      ? Colors.success
                      : Colors.error,
                  },
                ]}
              />

              <View style={styles.questionContent}>
                {/* Header row */}
                <View style={styles.questionHeader}>
                  <View style={styles.questionNumBox}>
                    <Text style={styles.questionNumText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.questionText} numberOfLines={2}>
                    {q.question}
                  </Text>
                  {isUndetected ? (
                    <Ionicons name="help-circle" size={20} color={Colors.warning} />
                  ) : isCorrect ? (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                  ) : (
                    <Ionicons name="close-circle" size={20} color={Colors.error} />
                  )}
                </View>

                {/* Options */}
                <View style={styles.optionsContainer}>
                  {q.options.map((opt) => {
                    const isCorrectOpt = opt.label === q.correct_answer;
                    const isDetectedOpt = opt.label === q.detected_answer;

                    let bg = Colors.background;
                    let borderColor = Colors.border;
                    let labelBg = Colors.border;
                    let textColor = Colors.text;

                    if (isCorrectOpt) {
                      bg = "#ECFDF5";
                      borderColor = Colors.success;
                      labelBg = Colors.success;
                      textColor = Colors.success;
                    }
                    if (isDetectedOpt && !isCorrectOpt) {
                      bg = "#FEF2F2";
                      borderColor = Colors.error;
                      labelBg = Colors.error;
                      textColor = Colors.error;
                    }

                    return (
                      <View
                        key={opt.label}
                        style={[styles.option, { backgroundColor: bg, borderColor }]}
                      >
                        <View style={[styles.optionLabel, { backgroundColor: labelBg }]}>
                          <Text style={styles.optionLabelText}>{opt.label}</Text>
                        </View>
                        <Text style={[styles.optionText, { color: textColor }]} numberOfLines={1}>
                          {opt.text}
                        </Text>
                        <View style={styles.tagRow}>
                          {isCorrectOpt && (
                            <View style={[styles.tag, { backgroundColor: Colors.success + "20" }]}>
                              <Text style={[styles.tagText, { color: Colors.success }]}>
                                {isDetectedOpt ? "✓ Detected" : "Correct"}
                              </Text>
                            </View>
                          )}
                          {isDetectedOpt && !isCorrectOpt && (
                            <View style={[styles.tag, { backgroundColor: Colors.error + "20" }]}>
                              <Text style={[styles.tagText, { color: Colors.error }]}>Detected</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}

                  {isUndetected && (
                    <View style={styles.undetectedBox}>
                      <Ionicons name="scan-outline" size={13} color={Colors.warning} />
                      <Text style={styles.undetectedText}>Could not read answer from sheet</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* ── Sticky bottom bar ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        {!saved ? (
          <>
            <TouchableOpacity
              style={styles.rescanBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={18} color={Colors.subtext} />
              <Text style={styles.rescanBtnText}>Rescan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveBtnGradient}
              >
                {saving ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={18} color={Colors.white} />
                    <Text style={styles.saveBtnText}>Save Mark</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.savedBadge}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.savedBadgeText}>Mark saved</Text>
            </View>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => router.replace("/(lecturer)/grading")}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[Colors.success, "#047857"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveBtnGradient}
              >
                <Ionicons name="arrow-back-outline" size={18} color={Colors.white} />
                <Text style={styles.saveBtnText}>Back to Grading</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // ── Header ──
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

  // Score strip
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

  // ── Body ──
  body: { paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg },
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

  // Question cards
  questionCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
    overflow: "hidden", ...Shadows.sm,
  },
  questionBar: { width: 4 },
  questionContent: { flex: 1, padding: Spacing.md },
  questionHeader: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.md, gap: Spacing.sm },
  questionNumBox: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center", alignItems: "center",
  },
  questionNumText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.primary },
  questionText: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text, lineHeight: 18 },
  optionsContainer: { gap: Spacing.xs },
  option: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderRadius: Radius.md,
    padding: Spacing.sm, gap: Spacing.sm,
  },
  optionLabel: {
    width: 24, height: 24, borderRadius: Radius.xs,
    justifyContent: "center", alignItems: "center",
  },
  optionLabelText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.white },
  optionText: { flex: 1, fontSize: FontSize.sm },
  tagRow: { flexDirection: "row" },
  tag: { paddingHorizontal: Spacing.xs, paddingVertical: 2, borderRadius: Radius.xs },
  tagText: { fontSize: 10, fontWeight: FontWeight.bold },
  undetectedBox: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.warningLight, borderRadius: Radius.sm,
    padding: Spacing.sm, gap: Spacing.xs, marginTop: Spacing.xs,
  },
  undetectedText: { fontSize: FontSize.xs, color: Colors.warning },

  // ── Bottom bar ──
  bottomBar: {
    flexDirection: "row", paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border,
    gap: Spacing.md, ...Shadows.md,
  },
  rescanBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.lg, paddingVertical: Spacing.md, gap: Spacing.sm,
  },
  rescanBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.subtext },
  saveBtn: { flex: 2, borderRadius: Radius.lg, overflow: "hidden", ...Shadows.colored },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnGradient: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: Spacing.md, gap: Spacing.sm,
  },
  saveBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.white },
  savedBadge: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: Colors.successLight, borderRadius: Radius.lg,
    paddingVertical: Spacing.md, gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.success + "30",
  },
  savedBadgeText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.success },
});