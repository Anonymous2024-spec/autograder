import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

export default function CreateQuestion() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  const [questionText, setQuestionText] = useState("");
  const [totalMarks, setTotalMarks] = useState("10");
  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);
  const [unitPickerOpen, setUnitPickerOpen] = useState(false);
  const [questionPdf, setQuestionPdf] = useState<any | null>(null);
  const [markingGuidePdf, setMarkingGuidePdf] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(true);

  useEffect(() => {
    if (!token) return;
    lecturerAPI.getCourses(token)
      .then((courses) => {
        const allUnits: any[] = [];
        (courses ?? []).forEach((course: any) => {
          (course.units ?? []).forEach((unit: any) => {
            allUnits.push({ ...unit, courseCode: course.code, courseTitle: course.title });
          });
        });
        setUnits(allUnits);
      })
      .catch(console.error)
      .finally(() => setLoadingUnits(false));
  }, [token]);

  const pickPdf = async (type: "question" | "marking") => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets.length > 0) {
        const file = result.assets[0];
        if (type === "question") setQuestionPdf(file);
        else setMarkingGuidePdf(file);
      }
    } catch (err) {
      console.error("Document pick error:", err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedUnit) { Alert.alert("Missing", "Please select a course unit."); return; }
    if (!questionText.trim() && !questionPdf) { Alert.alert("Missing", "Enter question text or upload a question PDF."); return; }
    if (!markingGuidePdf) { Alert.alert("Missing", "A marking guide PDF is required for grading."); return; }
    if (!token) return;

    setLoading(true);
    try {
      const questionData: any = {
        question_text: questionText,
        total_marks: parseInt(totalMarks) || 10,
      };
      if (questionPdf) {
        questionData.question_pdf = {
          uri: questionPdf.uri,
          name: questionPdf.name,
          type: questionPdf.mimeType || "application/pdf",
        };
      }
      if (markingGuidePdf) {
        questionData.marking_guide_pdf = {
          uri: markingGuidePdf.uri,
          name: markingGuidePdf.name,
          type: markingGuidePdf.mimeType || "application/pdf",
        };
      }

      await lecturerAPI.createQuestion(selectedUnit.id, questionData, token);
      Alert.alert("Success", "Question created successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create question");
    } finally {
      setLoading(false);
    }
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
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>New Question</Text>
            <Text style={styles.headerSub}>Upload marking guide for AI grading</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Unit picker */}
        <Text style={styles.sectionLabel}>Course Unit</Text>
        <TouchableOpacity
          style={styles.pickerTrigger}
          onPress={() => setUnitPickerOpen(!unitPickerOpen)}
        >
          <Ionicons name="layers-outline" size={18} color={Colors.subtext} />
          <Text style={[styles.pickerText, !selectedUnit && styles.pickerPlaceholder]}>
            {selectedUnit ? `${selectedUnit.title} (${selectedUnit.courseCode})` : "Select a unit..."}
          </Text>
          <Ionicons name={unitPickerOpen ? "chevron-up" : "chevron-down"} size={18} color={Colors.subtext} />
        </TouchableOpacity>

        {unitPickerOpen && (
          <View style={styles.dropdown}>
            {loadingUnits ? (
              <ActivityIndicator color={Colors.primary} style={{ padding: Spacing.md }} />
            ) : units.length === 0 ? (
              <Text style={styles.emptyText}>No units found. Create a course first.</Text>
            ) : (
              units.map((unit) => (
                <TouchableOpacity
                  key={unit.id}
                  style={[styles.dropdownItem, selectedUnit?.id === unit.id && styles.dropdownItemActive]}
                  onPress={() => { setSelectedUnit(unit); setUnitPickerOpen(false); }}
                >
                  <Text style={styles.dropdownItemText}>{unit.title}</Text>
                  <Text style={styles.dropdownItemSub}>{unit.courseCode}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Question text */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>Question Text</Text>
        <View style={styles.textAreaCard}>
          <TextInput
            style={styles.textArea}
            placeholder="Enter the question text (or leave blank if uploading a PDF)..."
            placeholderTextColor={Colors.placeholder}
            value={questionText}
            onChangeText={setQuestionText}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Total marks */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>Total Marks</Text>
        <View style={styles.marksCard}>
          <Ionicons name="star-outline" size={18} color={Colors.accent} />
          <TextInput
            style={styles.marksInput}
            placeholder="10"
            placeholderTextColor={Colors.placeholder}
            value={totalMarks}
            onChangeText={setTotalMarks}
            keyboardType="numeric"
          />
          <Text style={styles.marksUnit}>marks</Text>
        </View>

        {/* Question PDF (optional) */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>Question Paper (Optional)</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={() => pickPdf("question")}>
          {questionPdf ? (
            <View style={styles.uploadedFile}>
              <Ionicons name="document" size={24} color={Colors.primary} />
              <Text style={styles.uploadedName} numberOfLines={1}>{questionPdf.name}</Text>
              <TouchableOpacity onPress={() => setQuestionPdf(null)}>
                <Ionicons name="close-circle" size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="cloud-upload-outline" size={28} color={Colors.subtext} />
              <Text style={styles.uploadPlaceholderText}>Tap to upload question PDF</Text>
              <Text style={styles.uploadHint}>PDF, JPG, PNG supported</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Marking guide PDF (required) */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>
          Marking Guide PDF <Text style={{ color: Colors.error }}>*</Text>
        </Text>
        <Text style={styles.uploadDesc}>
          This is sent to AI for grading. It must contain the correct answers and marks per question.
        </Text>
        <TouchableOpacity
          style={[styles.uploadBox, { borderColor: markingGuidePdf ? Colors.success : Colors.primary + "50" }]}
          onPress={() => pickPdf("marking")}
        >
          {markingGuidePdf ? (
            <View style={styles.uploadedFile}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <Text style={styles.uploadedName} numberOfLines={1}>{markingGuidePdf.name}</Text>
              <TouchableOpacity onPress={() => setMarkingGuidePdf(null)}>
                <Ionicons name="close-circle" size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="document-text-outline" size={28} color={Colors.primary} />
              <Text style={[styles.uploadPlaceholderText, { color: Colors.primary }]}>
                Upload Marking Guide (Required)
              </Text>
              <Text style={styles.uploadHint}>PDF, JPG, PNG supported</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* ── Bottom bar ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()} activeOpacity={0.7}>
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
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={18} color={Colors.white} />
                <Text style={styles.submitBtnText}>Save Question</Text>
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
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, overflow: "hidden" },
  headerShapeL: {
    position: "absolute", width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)", top: -60, right: -40,
  },
  headerShapeS: {
    position: "absolute", width: 100, height: 100, borderRadius: 50,
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
  sectionLabel: {
    fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.subtext,
    textTransform: "uppercase", letterSpacing: 1.2, marginBottom: Spacing.sm,
  },
  pickerTrigger: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    gap: Spacing.sm, ...Shadows.sm,
  },
  pickerText: { flex: 1, fontSize: FontSize.sm, color: Colors.text },
  pickerPlaceholder: { color: Colors.placeholder },
  dropdown: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, ...Shadows.md,
    marginTop: 4, overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  dropdownItemActive: { backgroundColor: Colors.primaryLight },
  dropdownItemText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  dropdownItemSub: { fontSize: FontSize.xs, color: Colors.subtext, marginTop: 2 },
  emptyText: { padding: Spacing.md, color: Colors.subtext, textAlign: "center" },
  textAreaCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, ...Shadows.sm,
  },
  textArea: {
    padding: Spacing.md, fontSize: FontSize.sm, color: Colors.text,
    minHeight: 100, textAlignVertical: "top",
  },
  marksCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, gap: Spacing.sm, ...Shadows.sm,
  },
  marksInput: {
    flex: 1, fontSize: FontSize.lg, fontWeight: FontWeight.bold,
    color: Colors.text, paddingVertical: Spacing.md,
  },
  marksUnit: { fontSize: FontSize.sm, color: Colors.subtext },
  uploadDesc: { fontSize: FontSize.xs, color: Colors.subtext, marginBottom: Spacing.sm },
  uploadBox: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1.5, borderColor: Colors.border, borderStyle: "dashed",
    overflow: "hidden", ...Shadows.sm,
  },
  uploadPlaceholder: {
    alignItems: "center", padding: Spacing.xl, gap: Spacing.sm,
  },
  uploadPlaceholderText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.subtext },
  uploadHint: { fontSize: FontSize.xs, color: Colors.placeholder },
  uploadedFile: {
    flexDirection: "row", alignItems: "center",
    padding: Spacing.md, gap: Spacing.md,
  },
  uploadedName: { flex: 1, fontSize: FontSize.sm, color: Colors.text, fontWeight: FontWeight.medium },
  bottomBar: {
    flexDirection: "row", paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border,
    gap: Spacing.md, ...Shadows.md,
  },
  cancelBtn: {
    flex: 1, alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.lg, paddingVertical: Spacing.md,
  },
  cancelBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.subtext },
  submitBtn: { flex: 2, borderRadius: Radius.lg, overflow: "hidden", ...Shadows.colored },
  submitBtnDisabled: { opacity: 0.6 },
  submitGradient: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: Spacing.md, gap: Spacing.sm,
  },
  submitBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.white },
});
