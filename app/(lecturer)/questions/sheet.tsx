import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, Radius, Spacing } from "../../../constants";

// TODO: Replace with real questions from API using course_id
const MOCK_QUESTIONS = [
  { id: 1, question: "What is the full meaning of CPU?" },
  { id: 2, question: "Which data structure uses FIFO order?" },
  { id: 3, question: "What does RAM stand for?" },
];

export default function AnswerSheetScreen() {
  const { count } = useLocalSearchParams();

  // TODO: Replace with real expo-print or expo-sharing call
  const handlePrint = () => {
    Alert.alert(
      "Print / Share",
      "PDF export will be available once the backend is connected.",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* ── Sheet header ── */}
        <View style={styles.sheetHeader}>
          <Text style={styles.university}>Gulu University</Text>
          <Text style={styles.sheetTitle}>MCQ Answer Sheet</Text>
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
            <Text style={styles.infoLabel}>Course:</Text>
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

        {/* ── Answer boxes ── */}
        <View style={styles.answersSection}>
          <Text style={styles.answersSectionTitle}>Answers</Text>

          {/* Render in rows of 4 */}
          <View style={styles.answersGrid}>
            {MOCK_QUESTIONS.map((q, index) => (
              <View key={q.id} style={styles.answerItem}>

                {/* Question number */}
                <Text style={styles.answerNumber}>{index + 1}.</Text>

                {/* Answer box — student writes letter here */}
                <View style={styles.answerBox} />

              </View>
            ))}
          </View>
        </View>

        {/* ── Question reference list ── */}
        <View style={styles.questionList}>
          <Text style={styles.questionListTitle}>Question Reference</Text>
          {MOCK_QUESTIONS.map((q, index) => (
            <View key={q.id} style={styles.questionRow}>
              <View style={styles.questionNumBadge}>
                <Text style={styles.questionNumText}>{index + 1}</Text>
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

      {/* ── Print / Share button ── */}
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

  // ── Sheet header ──
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

  // ── Instructions ──
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

  // ── Answer boxes grid ──
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
  // The box where the student writes their answer letter
  answerBox: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: Colors.text,
    borderRadius: Radius.sm,
  },

  // ── Question reference ──
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
  questionNumText: {
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

  // ── Footer ──
  sheetFooter: {
    alignItems: "center",
    paddingTop: Spacing.md,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.placeholder,
  },

  // ── Print button ──
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
});