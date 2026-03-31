import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, Radius, Spacing } from "../../../constants";

// TODO: Replace with real API call using courseId
const ALL_QUESTIONS: Record<number, { id: number; question: string; course_id: number }[]> = {
  1: [
    { id: 1, question: "What is the full meaning of CPU?", course_id: 1 },
    { id: 2, question: "Which data structure uses FIFO order?", course_id: 1 },
    { id: 3, question: "What does RAM stand for?", course_id: 1 },
  ],
  2: [
    { id: 4, question: "What does CSS stand for?", course_id: 2 },
    { id: 5, question: "Which language runs in a web browser?", course_id: 2 },
  ],
  3: [
    { id: 6, question: "What is an algorithm?", course_id: 3 },
  ],
};

// Two steps — select questions, then preview sheet
type Step = "select" | "preview";

export default function AnswerSheetScreen() {
  const { courseId, courseName, courseCode } = useLocalSearchParams<{
    courseId: string;
    courseName: string;
    courseCode: string;
  }>();

  // Get questions for this course
  const courseQuestions = ALL_QUESTIONS[Number(courseId)] ?? [];

  // Track current step
  const [step, setStep] = useState<Step>("select");

  // Track which question ids are selected
  const [selectedIds, setSelectedIds] = useState<number[]>(
    // Default — all selected
    courseQuestions.map((q) => q.id)
  );

  // Toggle a question selection
  const toggleQuestion = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Select all / deselect all
  const toggleAll = () => {
    if (selectedIds.length === courseQuestions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(courseQuestions.map((q) => q.id));
    }
  };

  // Questions that will appear on the sheet
  const selectedQuestions = courseQuestions.filter((q) =>
    selectedIds.includes(q.id)
  );

  // Proceed to preview
  const handleProceed = () => {
    if (selectedIds.length === 0) {
      Alert.alert(
        "No Questions Selected",
        "Please select at least one question."
      );
      return;
    }
    setStep("preview");
  };

  // TODO: Replace with real expo-print / expo-sharing call
  const handlePrint = () => {
    Alert.alert(
      "Print / Share",
      "PDF export will be available once the backend is connected.",
      [{ text: "OK" }]
    );
  };

  // ── Step 1: Question selection ──
  if (step === "select") {
    return (
      <SafeAreaView style={styles.container}>

        {/* Header info */}
        <View style={styles.selectionHeader}>
          <View style={styles.courseTag}>
            <Text style={styles.courseTagText}>{courseCode}</Text>
          </View>
          <Text style={styles.selectionTitle} numberOfLines={1}>
            {courseName}
          </Text>
          <Text style={styles.selectionSubtitle}>
            Select questions to include in the answer sheet
          </Text>
        </View>

        {/* Select all toggle */}
        <View style={styles.selectAllRow}>
          <Text style={styles.selectAllLabel}>
            {selectedIds.length} of {courseQuestions.length} selected
          </Text>
          <TouchableOpacity onPress={toggleAll} style={styles.selectAllBtn}>
            <Text style={styles.selectAllBtnText}>
              {selectedIds.length === courseQuestions.length
                ? "Deselect All"
                : "Select All"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Questions list */}
        <FlatList
          data={courseQuestions}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.selectionList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="help-circle-outline"
                size={48}
                color={Colors.border}
              />
              <Text style={styles.emptyText}>No questions for this course</Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <TouchableOpacity
                style={[
                  styles.selectionCard,
                  isSelected && styles.selectionCardActive,
                ]}
                onPress={() => toggleQuestion(item.id)}
              >
                {/* Checkbox */}
                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxActive,
                  ]}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  )}
                </View>

                {/* Question number */}
                <View style={styles.questionNumBox}>
                  <Text style={styles.questionNumText}>{index + 1}</Text>
                </View>

                {/* Question text */}
                <Text
                  style={[
                    styles.selectionQuestionText,
                    isSelected && styles.selectionQuestionTextActive,
                  ]}
                  numberOfLines={2}
                >
                  {item.question}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Proceed button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.proceedBtn,
              selectedIds.length === 0 && styles.proceedBtnDisabled,
            ]}
            onPress={handleProceed}
            disabled={selectedIds.length === 0}
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color={Colors.white}
            />
            <Text style={styles.proceedBtnText}>
              Preview Sheet ({selectedIds.length} Questions)
            </Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    );
  }

  // ── Step 2: Sheet preview ──
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Back to selection */}
        <TouchableOpacity
          style={styles.backToSelection}
          onPress={() => setStep("select")}
        >
          <Ionicons name="arrow-back" size={16} color={Colors.primary} />
          <Text style={styles.backToSelectionText}>Edit Selection</Text>
        </TouchableOpacity>

        {/* ── Sheet header ── */}
        <View style={styles.sheetHeader}>
          <Text style={styles.university}>Gulu University</Text>
          <Text style={styles.sheetTitle}>MCQ Answer Sheet</Text>
          <Text style={styles.sheetCourse}>
            {courseCode} — {courseName}
          </Text>
          <View style={styles.dividerLine} />

          {/* Student info fields */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <View style={styles.infoLine} />
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Reg No:</Text>
            <View style={styles.infoLine} />
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <View style={styles.infoLine} />
          </View>
        </View>

        {/* ── Instructions ── */}
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructionsText}>
            Write the letter of your chosen answer (A, B, C or D) clearly in
            the box provided for each question. Use a pen. Do not use correction
            fluid.
          </Text>
        </View>

        {/* ── Answer boxes grid ── */}
        <View style={styles.answersSection}>
          <Text style={styles.answersSectionTitle}>
            Answers ({selectedQuestions.length} Questions)
          </Text>
          <View style={styles.answersGrid}>
            {selectedQuestions.map((q, index) => (
              <View key={q.id} style={styles.answerItem}>
                <Text style={styles.answerNumber}>{index + 1}.</Text>
                {/* Box where student writes their answer */}
                <View style={styles.answerBox} />
              </View>
            ))}
          </View>
        </View>

        {/* ── Question reference list ── */}
        <View style={styles.questionList}>
          <Text style={styles.questionListTitle}>Question Reference</Text>
          {selectedQuestions.map((q, index) => (
            <View key={q.id} style={styles.questionRow}>
              <View style={styles.questionNumBadge}>
                <Text style={styles.questionNumBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.questionRowText} numberOfLines={2}>
                {q.question}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Footer ── */}
        <View style={styles.sheetFooter}>
          <Text style={styles.footerText}>
            AutoGrader — Gulu University © 2025
          </Text>
        </View>

      </ScrollView>

      {/* Print / Share button */}
      <TouchableOpacity style={styles.printBtn} onPress={handlePrint}>
        <Ionicons name="print-outline" size={20} color={Colors.white} />
        <Text style={styles.printBtnText}>Print / Share</Text>
      </TouchableOpacity>

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
    paddingBottom: Spacing.xl * 3,
  },

  // ── Selection step ──
  selectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  courseTag: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginBottom: Spacing.xs,
  },
  courseTagText: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.primary,
  },
  selectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  selectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
  },

  // Select all row
  selectAllRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  selectAllLabel: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    fontWeight: "500",
  },
  selectAllBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
  },
  selectAllBtnText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.primary,
  },

  // Selection list
  selectionList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl * 3,
  },
  selectionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: Spacing.sm,
  },
  selectionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  questionNumBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  questionNumText: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.subtext,
  },
  selectionQuestionText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  selectionQuestionTextActive: {
    color: Colors.primary,
    fontWeight: "500",
  },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  proceedBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  proceedBtnDisabled: {
    backgroundColor: Colors.border,
  },
  proceedBtnText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.white,
  },

  // ── Preview step ──
  backToSelection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  backToSelectionText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.primary,
  },

  // Sheet header
  sheetHeader: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  university: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.subtext,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sheetTitle: {
    fontSize: FontSize.xl,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  sheetCourse: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: "600",
    textAlign: "center",
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  dividerLine: {
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  infoLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.text,
    width: 60,
  },
  infoLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.border,
  },

  // Instructions
  instructionsBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  instructionsTitle: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  instructionsText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 20,
  },

  // Answer boxes
  answersSection: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  answersSectionTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  answersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  answerItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "22%",
    gap: Spacing.xs,
  },
  answerNumber: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.text,
  },
  answerBox: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: Colors.text,
    borderRadius: Radius.sm,
  },

  // Question reference
  questionList: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  questionListTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  questionNumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  questionNumBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.primary,
  },
  questionRowText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 20,
  },

  // Footer
  sheetFooter: {
    alignItems: "center",
    paddingTop: Spacing.md,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.placeholder,
  },

  // Print button
  printBtn: {
    position: "absolute",
    bottom: Spacing.xl,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  printBtnText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.white,
  },

  // Empty state
  emptyContainer: {
    alignItems: "center",
    marginTop: Spacing.xl * 2,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.subtext,
    marginTop: Spacing.md,
  },
});