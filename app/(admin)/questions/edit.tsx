import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Input from "../../../components/Input";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
  Spacing,
} from "../../../constants";

const LABELS = ["A", "B", "C", "D"];
const LABEL_COLORS = [
  Colors.cardBlue,
  Colors.cardTeal,
  Colors.cardGreen,
  Colors.cardPurple,
];

// Mock units — replace with API call when backend is ready
const COURSE_UNITS = [
  { id: 1, name: "Introduction to Programming", code: "PROG101" },
  { id: 2, name: "Web Development Basics", code: "WEB101" },
  { id: 3, name: "Database Management", code: "DB101" },
  { id: 4, name: "Networking Fundamentals", code: "NET101" },
  { id: 5, name: "Cybersecurity Basics", code: "SEC101" },
];

export default function AdminEditQuestion() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Get question id and unitId passed from list screen
  const { id, unitId } = useLocalSearchParams<{
    id: string;
    unitId: string;
  }>();

  // Find the unit this question belongs to
  const selectedUnit = COURSE_UNITS.find((u) => u.id === Number(unitId));

  // Pre-filled form values
  // TODO: Replace with real API fetch by question id
  const [question, setQuestion] = useState("What is the full meaning of CPU?");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([
    { id: 1, text: "Central Processing Unit", is_correct: true },
    { id: 2, text: "Computer Personal Unit", is_correct: false },
    { id: 3, text: "Central Program Utility", is_correct: false },
    { id: 4, text: "Core Processing Unit", is_correct: false },
  ]);

  const updateOptionText = (index: number, text: string) => {
    const updated = [...options];
    updated[index].text = text;
    setOptions(updated);
  };

  const markCorrect = (index: number) => {
    setOptions(options.map((opt, i) => ({ ...opt, is_correct: i === index })));
  };

  const correctIndex = options.findIndex((o) => o.is_correct);

  const handleSubmit = () => {
    if (!question.trim()) {
      alert("Please enter the question");
      return;
    }
    if (options.some((opt) => !opt.text.trim())) {
      alert("Please fill in all options");
      return;
    }
    if (!options.some((opt) => opt.is_correct)) {
      alert("Please mark the correct answer");
      return;
    }
    setLoading(true);
    // TODO: PUT to API with id, unitId, question, options
    console.log({ id, unitId, question, options });
    setTimeout(() => {
      setLoading(false);
      router.back();
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* ── Header ── */}
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
            <Text style={styles.headerTitle}>Edit Question</Text>
            <Text style={styles.headerSub}>Update question and options</Text>
          </View>
          {/* Question ID badge */}
          <View style={styles.idBadge}>
            <Text style={styles.idBadgeText}>#{id}</Text>
          </View>
        </View>

        {/* Answer indicator pill */}
        <View style={styles.answerPill}>
          {correctIndex >= 0 ? (
            <>
              <View
                style={[
                  styles.answerPillDot,
                  { backgroundColor: LABEL_COLORS[correctIndex] },
                ]}
              />
              <Text style={styles.answerPillText}>
                Correct answer: Option {LABELS[correctIndex]}
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="alert-circle-outline"
                size={13}
                color="rgba(255,255,255,0.6)"
              />
              <Text
                style={[
                  styles.answerPillText,
                  { color: "rgba(255,255,255,0.6)" },
                ]}
              >
                No correct answer marked
              </Text>
            </>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Unit info card ── */}
        {selectedUnit && (
          <View style={styles.unitInfoCard}>
            <View style={styles.unitInfoIcon}>
              <Ionicons name="layers" size={18} color={Colors.primary} />
            </View>
            <View style={styles.unitInfoText}>
              <Text style={styles.unitInfoLabel}>Question belongs to</Text>
              <Text style={styles.unitInfoName}>{selectedUnit.name}</Text>
            </View>
            <View style={styles.unitCodeBadge}>
              <Text style={styles.unitCodeText}>{selectedUnit.code}</Text>
            </View>
          </View>
        )}

        {/* ── Question section ── */}
        <Text style={styles.sectionLabel}>Question</Text>
        <View style={styles.formCard}>
          <View style={styles.fieldRow}>
            <View
              style={[
                styles.fieldIcon,
                { backgroundColor: Colors.accentLight },
              ]}
            >
              <Ionicons
                name="help-circle-outline"
                size={18}
                color={Colors.accent}
              />
            </View>
            <View style={styles.fieldInput}>
              <Input
                label="Question Text"
                placeholder="Enter your MCQ question here..."
                value={question}
                onChangeText={setQuestion}
                icon="help-circle-outline"
                multiline
              />
            </View>
          </View>
        </View>

        {/* ── Options section ── */}
        <Text style={styles.sectionLabel}>Answer Options</Text>
        <Text style={styles.optionsHint}>
          Tap the radio button to mark the correct answer
        </Text>

        {options.map((opt, index) => {
          const isCorrect = opt.is_correct;
          const color = LABEL_COLORS[index];
          return (
            <View
              key={opt.id}
              style={[
                styles.optionCard,
                isCorrect && {
                  borderColor: color,
                  backgroundColor: color + "08",
                },
              ]}
            >
              {isCorrect && (
                <View style={[styles.optionBar, { backgroundColor: color }]} />
              )}

              <View style={styles.optionContent}>
                <View style={styles.optionTop}>
                  <View
                    style={[
                      styles.optionLabelBox,
                      { backgroundColor: isCorrect ? color : Colors.border },
                    ]}
                  >
                    <Text style={styles.optionLetter}>{LABELS[index]}</Text>
                  </View>
                  <Text style={[styles.optionHint, isCorrect && { color }]}>
                    {isCorrect ? "✓ Correct answer" : `Option ${LABELS[index]}`}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.radioBtn,
                      isCorrect && { borderColor: color },
                    ]}
                    onPress={() => markCorrect(index)}
                  >
                    {isCorrect && (
                      <View
                        style={[styles.radioDot, { backgroundColor: color }]}
                      />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.optionInputWrap}>
                  <Input
                    label=""
                    placeholder={`Type option ${LABELS[index]} here...`}
                    value={opt.text}
                    onChangeText={(text) => updateOptionText(index, text)}
                  />
                </View>
              </View>
            </View>
          );
        })}

        {/* ── Warning note ── */}
        <View style={styles.warningNote}>
          <Ionicons name="warning-outline" size={15} color={Colors.warning} />
          <Text style={styles.warningNoteText}>
            Editing this question will affect all previously generated answer
            sheets for this unit.
          </Text>
        </View>
      </ScrollView>

      {/* ── Bottom bar ── */}
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
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            {loading ? (
              <Text style={styles.submitBtnText}>Saving...</Text>
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color={Colors.white} />
                <Text style={styles.submitBtnText}>Save Changes</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -60,
    right: -40,
  },
  headerShapeS: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
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
  idBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  idBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  answerPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: Radius.full,
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    gap: 6,
  },
  answerPillDot: { width: 8, height: 8, borderRadius: 4 },
  answerPillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },

  // ── Body ──
  body: { paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg },

  // Unit info card
  unitInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + "30",
    gap: Spacing.md,
    ...Shadows.sm,
  },
  unitInfoIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  unitInfoText: { flex: 1 },
  unitInfoLabel: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
    marginBottom: 2,
  },
  unitInfoName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  unitCodeBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  unitCodeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },

  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.subtext,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  optionsHint: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginBottom: Spacing.md,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Shadows.sm,
    marginBottom: Spacing.sm,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.md,
  },
  fieldIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg + 2,
  },
  fieldInput: { flex: 1 },

  // Option cards
  optionCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    overflow: "hidden",
    ...Shadows.sm,
  },
  optionBar: { width: 4 },
  optionContent: { flex: 1, padding: Spacing.md },
  optionTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  optionLabelBox: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  optionLetter: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  optionHint: {
    flex: 1,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.subtext,
  },
  radioBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  optionInputWrap: { marginTop: -Spacing.xs },

  // Warning note
  warningNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    backgroundColor: Colors.warningLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.warning + "30",
  },
  warningNoteText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.warning,
    lineHeight: 18,
  },

  // Bottom bar
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
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.subtext,
  },
  submitBtn: {
    flex: 2,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadows.colored,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  submitBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
});
