import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
  Spacing,
} from "../../../constants";

const ALL_QUESTIONS: { id: number; question: string; unit_id: number }[] = [
  { id: 1, question: "What is the full meaning of CPU?", unit_id: 1 },
  { id: 2, question: "Which data structure uses FIFO order?", unit_id: 1 },
  { id: 3, question: "What does RAM stand for?", unit_id: 1 },
  { id: 4, question: "What does CSS stand for?", unit_id: 2 },
  { id: 5, question: "Which language runs in a web browser?", unit_id: 2 },
  { id: 6, question: "What is an algorithm?", unit_id: 3 },
];

type Step = "select" | "preview";

export default function AnswerSheetScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { unitId, unitName, unitCode } = useLocalSearchParams<{
    unitId: string;
    unitName: string;
    unitCode: string;
  }>();
  const courseQuestions = ALL_QUESTIONS.filter(
    (q: { id: number; question: string; unit_id: number }) =>
      q.unit_id === Number(unitId),
  );
  const [step, setStep] = useState<Step>("select");
  const [selectedIds, setSelectedIds] = useState<number[]>(
    courseQuestions.map((q) => q.id),
  );

  const toggleQuestion = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedIds(
      selectedIds.length === courseQuestions.length
        ? []
        : courseQuestions.map((q) => q.id),
    );
  };

  const selectedQuestions = courseQuestions.filter((q) =>
    selectedIds.includes(q.id),
  );

  const handleProceed = () => {
    if (selectedIds.length === 0) {
      Alert.alert("No Questions", "Please select at least one question.");
      return;
    }
    setStep("preview");
  };

  const handlePrint = () => {
    Alert.alert(
      "Print / Share",
      "PDF export will be available once the backend is connected.",
      [{ text: "OK" }],
    );
  };

  // ── STEP 1: Select questions ──
  if (step === "select") {
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
              <Text style={styles.headerTitle}>Answer Sheet</Text>
              <Text style={styles.headerSub}>Select questions to include</Text>
            </View>
            <View style={[styles.courseCodeBadge]}>
              <Text style={styles.courseCodeText}>{unitCode}</Text>
            </View>
          </View>

          {/* Stats strip */}
          <View style={styles.statsStrip}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{courseQuestions.length}</Text>
              <Text style={styles.statLbl}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{selectedIds.length}</Text>
              <Text style={styles.statLbl}>Selected</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>
                {courseQuestions.length - selectedIds.length}
              </Text>
              <Text style={styles.statLbl}>Excluded</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Select all row */}
        <View style={styles.selectAllRow}>
          <Text style={styles.selectAllLabel}>
            {selectedIds.length} of {courseQuestions.length} questions selected
          </Text>
          <TouchableOpacity style={styles.selectAllBtn} onPress={toggleAll}>
            <Text style={styles.selectAllBtnText}>
              {selectedIds.length === courseQuestions.length
                ? "Deselect All"
                : "Select All"}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={courseQuestions}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.selectionList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Ionicons
                  name="help-circle-outline"
                  size={40}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.emptyTitle}>
                No questions for this course
              </Text>
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
                activeOpacity={0.85}
              >
                {/* Checkbox */}
                <View
                  style={[styles.checkbox, isSelected && styles.checkboxActive]}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={13} color={Colors.white} />
                  )}
                </View>
                {/* Number */}
                <View
                  style={[
                    styles.questionNumBox,
                    isSelected && { backgroundColor: "rgba(255,255,255,0.2)" },
                  ]}
                >
                  <Text
                    style={[
                      styles.questionNumText,
                      isSelected && { color: Colors.white },
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                {/* Text */}
                <Text
                  style={[
                    styles.selectionText,
                    isSelected && styles.selectionTextActive,
                  ]}
                  numberOfLines={2}
                >
                  {item.question}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Bottom bar */}
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: insets.bottom + Spacing.md },
          ]}
        >
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.proceedBtn,
              selectedIds.length === 0 && styles.proceedBtnDisabled,
            ]}
            onPress={handleProceed}
            disabled={selectedIds.length === 0}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={
                selectedIds.length > 0
                  ? [Colors.primary, Colors.primaryDark]
                  : [Colors.border, Colors.border]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.proceedGradient}
            >
              <Ionicons
                name="document-text-outline"
                size={18}
                color={Colors.white}
              />
              <Text style={styles.proceedBtnText}>
                Preview Sheet ({selectedIds.length})
              </Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── STEP 2: Preview ──
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
            onPress={() => setStep("select")}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Sheet Preview</Text>
            <Text style={styles.headerSub}>
              {selectedQuestions.length} questions · Ready to print
            </Text>
          </View>
          <View style={styles.courseCodeBadge}>
            <Text style={styles.courseCodeText}>{unitCode}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.previewContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Sheet paper */}
        <View style={styles.sheetPaper}>
          {/* University header */}
          <View style={styles.sheetHeaderSection}>
            <View style={styles.sheetLogoBox}>
              <Ionicons name="school" size={24} color={Colors.primary} />
            </View>
            <View style={styles.sheetHeaderInfo}>
              <Text style={styles.sheetUniversity}>GULU UNIVERSITY</Text>
              <Text style={styles.sheetTitle}>MCQ Answer Sheet</Text>
            </View>
          </View>

          <View style={styles.sheetDivider} />

          {/* Course info */}
          <View style={styles.sheetCourseRow}>
            <View
              style={[
                styles.sheetCourseBadge,
                { backgroundColor: Colors.primaryLight },
              ]}
            >
              <Text style={[styles.sheetCourseCode, { color: Colors.primary }]}>
                {unitCode}
              </Text>
            </View>
            <Text style={styles.sheetCourseName} numberOfLines={1}>
              {unitName}
            </Text>
          </View>

          <View style={styles.sheetDivider} />

          {/* Student info lines */}
          <View style={styles.sheetInfoSection}>
            {["Name", "Reg No", "Date"].map((label) => (
              <View key={label} style={styles.sheetInfoRow}>
                <Text style={styles.sheetInfoLabel}>{label}:</Text>
                <View style={styles.sheetInfoLine} />
              </View>
            ))}
          </View>

          {/* Instructions */}
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsTitle}>Instructions</Text>
            <Text style={styles.instructionsText}>
              Write the letter of your answer (A, B, C or D) clearly in the box
              for each question. Use a pen. Do not use correction fluid.
            </Text>
          </View>

          {/* Answer grid */}
          <Text style={styles.answersTitle}>
            Answer Boxes — {selectedQuestions.length} Questions
          </Text>
          <View style={styles.answersGrid}>
            {selectedQuestions.map((q, index) => (
              <View key={q.id} style={styles.answerItem}>
                <Text style={styles.answerNum}>{index + 1}.</Text>
                <View style={styles.answerBox} />
              </View>
            ))}
          </View>

          <View style={styles.sheetDivider} />

          {/* Question reference */}
          <Text style={styles.refTitle}>Question Reference</Text>
          {selectedQuestions.map((q, index) => (
            <View key={q.id} style={styles.refRow}>
              <View style={styles.refNumBox}>
                <Text style={styles.refNum}>{index + 1}</Text>
              </View>
              <Text style={styles.refText} numberOfLines={2}>
                {q.question}
              </Text>
            </View>
          ))}

          {/* Footer */}
          <View style={styles.sheetFooter}>
            <Text style={styles.sheetFooterText}>
              AutoGrader · Gulu University © 2025
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Print button */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + Spacing.md },
        ]}
      >
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => setStep("select")}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={16} color={Colors.subtext} />
          <Text style={styles.cancelBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.proceedBtn}
          onPress={handlePrint}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.proceedGradient}
          >
            <Ionicons name="print-outline" size={18} color={Colors.white} />
            <Text style={styles.proceedBtnText}>Print / Share PDF</Text>
          </LinearGradient>
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
  courseCodeBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
  },
  courseCodeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  statsStrip: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  statLbl: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.65)",
    marginTop: 2,
  },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },

  // Select step
  selectAllRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  selectAllLabel: { fontSize: FontSize.sm, color: Colors.subtext },
  selectAllBtn: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  selectAllBtnText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  selectionList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl * 3,
  },
  selectionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadows.sm,
    overflow: "hidden",
  },
  selectionCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
  checkboxActive: { backgroundColor: Colors.white, borderColor: Colors.white },
  questionNumBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  questionNumText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  selectionText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  selectionTextActive: { color: Colors.white, fontWeight: FontWeight.medium },
  emptyContainer: { alignItems: "center", paddingTop: Spacing.xl * 2 },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.subtext,
  },

  // Preview step
  previewContent: { padding: Spacing.lg },
  sheetPaper: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  sheetHeaderSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  sheetLogoBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetHeaderInfo: { flex: 1 },
  sheetUniversity: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.subtext,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  sheetTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginTop: 2,
  },
  sheetDivider: {
    height: 1.5,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  sheetCourseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sheetCourseBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  sheetCourseCode: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  sheetCourseName: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  sheetInfoSection: { gap: Spacing.md, marginBottom: Spacing.md },
  sheetInfoRow: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  sheetInfoLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    width: 55,
  },
  sheetInfoLine: { flex: 1, height: 1.5, backgroundColor: Colors.borderDark },
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
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  answersTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  answersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  answerItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "22%",
    gap: Spacing.xs,
  },
  answerNum: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  answerBox: {
    width: 34,
    height: 34,
    borderWidth: 2,
    borderColor: Colors.text,
    borderRadius: Radius.xs,
  },
  refTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  refRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  refNumBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  refNum: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  refText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  sheetFooter: { alignItems: "center", marginTop: Spacing.lg },
  sheetFooterText: { fontSize: FontSize.xs, color: Colors.placeholder },

  // Bottom bar (shared)
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  cancelBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.subtext,
  },
  proceedBtn: {
    flex: 2,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadows.colored,
  },
  proceedBtnDisabled: { opacity: 0.5 },
  proceedGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  proceedBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
});
