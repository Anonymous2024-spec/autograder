import { Ionicons } from "@expo/vector-icons";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, Radius, Spacing } from "../../../constants";

// Simulates what Gemini OCR will return after scanning
// Each item has the question, the correct answer, and what was detected on the sheet
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
    detected_answer: "A", // OCR read this from the sheet
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
    detected_answer: "C", // OCR read wrong answer
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
    detected_answer: null, // OCR could not detect — blank or unreadable
  },
];

export default function GradeResult() {
  const router = useRouter();
  const { courseId, studentId } = useLocalSearchParams();

  // Track if mark has been saved
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Calculate score from mock results
  const correct = MOCK_RESULTS.filter(
    (q) => q.detected_answer === q.correct_answer,
  ).length;
  const total = MOCK_RESULTS.length;
  const undetected = MOCK_RESULTS.filter(
    (q) => q.detected_answer === null,
  ).length;
  const percentage = Math.round((correct / total) * 100);

  // Determine grade label
  const getGrade = () => {
    if (percentage >= 80)
      return { label: "Distinction", color: Colors.success };
    if (percentage >= 70) return { label: "Credit", color: Colors.primary };
    if (percentage >= 60) return { label: "Pass", color: Colors.warning };
    return { label: "Fail", color: Colors.error };
  };

  const grade = getGrade();

  // Save mark to API
  // TODO: Replace with real API call + Gemini results
  const handleSave = () => {
    Alert.alert(
      "Save Mark",
      `Save ${correct}/${total} (${percentage}%) for this student?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: async () => {
            setSaving(true);
            // TODO: POST to /api/marks with courseId, studentId, score
            setTimeout(() => {
              setSaving(false);
              setSaved(true);
            }, 1500);
          },
        },
      ],
    );
  };

  // Go back to grading screen
  const handleDone = () => {
    router.replace("/(lecturer)/grading");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Score summary card ── */}
        <View style={styles.scoreCard}>
          {/* Grade badge */}
          <View
            style={[styles.gradeBadge, { backgroundColor: grade.color + "20" }]}
          >
            <Text style={[styles.gradeLabel, { color: grade.color }]}>
              {grade.label}
            </Text>
          </View>

          {/* Score circle */}
          <View style={[styles.scoreCircle, { borderColor: grade.color }]}>
            <Text style={[styles.scoreValue, { color: grade.color }]}>
              {percentage}%
            </Text>
            <Text style={styles.scoreFraction}>
              {correct}/{total}
            </Text>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {/* Correct */}
            <View style={styles.statItem}>
              <View
                style={[styles.statDot, { backgroundColor: Colors.success }]}
              />
              <Text style={styles.statNumber}>{correct}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>

            {/* Divider */}
            <View style={styles.statDivider} />

            {/* Wrong */}
            <View style={styles.statItem}>
              <View
                style={[styles.statDot, { backgroundColor: Colors.error }]}
              />
              <Text style={styles.statNumber}>
                {total - correct - undetected}
              </Text>
              <Text style={styles.statLabel}>Wrong</Text>
            </View>

            {/* Divider */}
            <View style={styles.statDivider} />

            {/* Undetected */}
            <View style={styles.statItem}>
              <View
                style={[styles.statDot, { backgroundColor: Colors.warning }]}
              />
              <Text style={styles.statNumber}>{undetected}</Text>
              <Text style={styles.statLabel}>Unread</Text>
            </View>
          </View>

          {/* Undetected warning */}
          {undetected > 0 && (
            <View style={styles.warningBox}>
              <Ionicons
                name="warning-outline"
                size={16}
                color={Colors.warning}
              />
              <Text style={styles.warningText}>
                {undetected} answer(s) could not be read from the sheet.
                Consider re-scanning.
              </Text>
            </View>
          )}
        </View>

        {/* ── Per question breakdown ── */}
        <Text style={styles.sectionTitle}>Question Breakdown</Text>

        {MOCK_RESULTS.map((q, index) => {
          const isCorrect = q.detected_answer === q.correct_answer;
          const isUndetected = q.detected_answer === null;

          return (
            <View key={q.id} style={styles.questionCard}>
              {/* Question header */}
              <View style={styles.questionHeader}>
                {/* Question number */}
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>{index + 1}</Text>
                </View>

                {/* Question text */}
                <Text style={styles.questionText} numberOfLines={2}>
                  {q.question}
                </Text>

                {/* Result icon */}
                {isUndetected ? (
                  <Ionicons
                    name="help-circle"
                    size={22}
                    color={Colors.warning}
                  />
                ) : isCorrect ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={Colors.success}
                  />
                ) : (
                  <Ionicons
                    name="close-circle"
                    size={22}
                    color={Colors.error}
                  />
                )}
              </View>

              {/* Options */}
              <View style={styles.optionsContainer}>
                {q.options.map((opt) => {
                  const isCorrectOption = opt.label === q.correct_answer;
                  const isDetectedOption = opt.label === q.detected_answer;

                  // Determine option style
                  let optionStyle = styles.option;
                  let labelStyle = styles.optionLabelBox;
                  let textStyle = styles.optionText;

                  if (isCorrectOption) {
                    optionStyle = { ...styles.option, ...styles.optionCorrect };
                    labelStyle = {
                      ...styles.optionLabelBox,
                      backgroundColor: Colors.success,
                    };
                    textStyle = [
                      styles.optionText,
                      { color: Colors.success, fontWeight: "600" },
                    ] as any;
                  }

                  if (isDetectedOption && !isCorrectOption) {
                    optionStyle = { ...styles.option, ...styles.optionWrong };
                    labelStyle = {
                      ...styles.optionLabelBox,
                      backgroundColor: Colors.error,
                    };
                    textStyle = [
                      styles.optionText,
                      { color: Colors.error },
                    ] as any;
                  }

                  return (
                    <View key={opt.label} style={optionStyle}>
                      <View style={labelStyle}>
                        <Text style={styles.optionLabelText}>{opt.label}</Text>
                      </View>
                      <Text style={textStyle}>{opt.text}</Text>

                      {/* Tags */}
                      <View style={styles.tagRow}>
                        {isCorrectOption && (
                          <View
                            style={[
                              styles.tag,
                              { backgroundColor: Colors.success + "20" },
                            ]}
                          >
                            <Text
                              style={[
                                styles.tagText,
                                { color: Colors.success },
                              ]}
                            >
                              Correct
                            </Text>
                          </View>
                        )}
                        {isDetectedOption && !isCorrectOption && (
                          <View
                            style={[
                              styles.tag,
                              { backgroundColor: Colors.error + "20" },
                            ]}
                          >
                            <Text
                              style={[styles.tagText, { color: Colors.error }]}
                            >
                              Detected
                            </Text>
                          </View>
                        )}
                        {isDetectedOption && isCorrectOption && (
                          <View
                            style={[
                              styles.tag,
                              { backgroundColor: Colors.success + "20" },
                            ]}
                          >
                            <Text
                              style={[
                                styles.tagText,
                                { color: Colors.success },
                              ]}
                            >
                              ✓ Detected
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}

                {/* Undetected notice */}
                {isUndetected && (
                  <View style={styles.undetectedBox}>
                    <Ionicons
                      name="scan-outline"
                      size={14}
                      color={Colors.warning}
                    />
                    <Text style={styles.undetectedText}>
                      Could not read answer from sheet
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {/* ── Action buttons ── */}
        {!saved ? (
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color={Colors.white} />
                <Text style={styles.saveBtnText}>Save Mark</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <>
            {/* Success message */}
            <View style={styles.savedBox}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Colors.success}
              />
              <Text style={styles.savedText}>Mark saved successfully</Text>
            </View>

            {/* Done button */}
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: Colors.success }]}
              onPress={handleDone}
            >
              <Ionicons
                name="arrow-back-outline"
                size={20}
                color={Colors.white}
              />
              <Text style={styles.saveBtnText}>Back to Grading</Text>
            </TouchableOpacity>
          </>
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

  // ── Score card ──
  scoreCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  gradeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginBottom: Spacing.md,
  },
  gradeLabel: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  scoreValue: {
    fontSize: FontSize.xxl,
    fontWeight: "bold",
  },
  scoreFraction: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginTop: Spacing.xs,
  },

  // Stats row
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: Spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: Spacing.xs,
  },
  statNumber: {
    fontSize: FontSize.xl,
    fontWeight: "bold",
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },

  // Warning box
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.warning + "15",
    borderRadius: Radius.md,
    padding: Spacing.sm,
    gap: Spacing.xs,
    width: "100%",
    marginTop: Spacing.sm,
  },
  warningText: {
    fontSize: FontSize.xs,
    color: Colors.warning,
    flex: 1,
    lineHeight: 18,
  },

  // ── Question breakdown ──
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  questionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  questionNumberText: {
    fontSize: FontSize.sm,
    fontWeight: "bold",
    color: Colors.primary,
  },
  questionText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.text,
    lineHeight: 20,
  },

  // Options
  optionsContainer: {
    gap: Spacing.xs,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.background,
    gap: Spacing.sm,
  },
  optionCorrect: {
    borderColor: Colors.success,
    backgroundColor: "#ECFDF5",
  },
  optionWrong: {
    borderColor: Colors.error,
    backgroundColor: "#FEF2F2",
  },
  optionLabelBox: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    backgroundColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  optionLabelText: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.white,
  },
  optionText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  tagRow: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  tag: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "600",
  },

  // Undetected
  undetectedBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.warning + "15",
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  undetectedText: {
    fontSize: FontSize.xs,
    color: Colors.warning,
  },

  // ── Save button ──
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
    gap: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.white,
  },
  savedBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  savedText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.success,
  },
});
