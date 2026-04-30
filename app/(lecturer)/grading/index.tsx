import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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

const UNIT_COLORS = [Colors.cardBlue, Colors.cardTeal, Colors.primary, Colors.accent];

export default function GradingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  const [units, setUnits] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [guideStatus, setGuideStatus] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!token) return;
    setLoadingUnits(true);
    lecturerAPI.getCourses(token)
      .then((courses) => {
        const allUnits: any[] = [];
        (courses ?? []).forEach((course: any) => {
          (course.units ?? []).forEach((unit: any) => {
            allUnits.push({ ...unit, courseCode: course.code, courseTitle: course.title, courseId: course.id });
          });
        });
        setUnits(allUnits);
        const status: Record<number, boolean> = {};
        allUnits.forEach((u) => { status[u.id] = !!u.marking_guide_path; });
        setGuideStatus(status);
      })
      .catch(console.error)
      .finally(() => setLoadingUnits(false));
  }, [token]);

  const handleSelectUnit = async (unit: any) => {
    setSelectedUnit(unit);
    setSelectedStudent(null);
    setStudents([]);
    if (!token) return;
    setLoadingStudents(true);
    try {
      const data = await lecturerAPI.getCourseStudents(unit.courseId, token);
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleStartGrading = () => {
    if (!selectedUnit || !selectedStudent) return;
    router.push({
      pathname: "/(lecturer)/grading/scan",
      params: {
        unitId: selectedUnit.id,
        unitName: selectedUnit.title,
        studentId: selectedStudent.user_id,
        studentName: selectedStudent.name,
      },
    });
  };

  const currentStep = !selectedUnit ? 1 : !selectedStudent ? 2 : 3;

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
          <View style={styles.headerIconBox}>
            <Ionicons name="scan" size={22} color={Colors.white} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Grade Students</Text>
            <Text style={styles.headerSub}>Select unit and student to begin</Text>
          </View>
        </View>

        {/* Step indicator */}
        <View style={styles.stepsRow}>
          {[
            { n: 1, label: "Unit" },
            { n: 2, label: "Student" },
            { n: 3, label: "Scan" },
          ].map((s, i, arr) => {
            const done = currentStep > s.n;
            const active = currentStep === s.n;
            return (
              <View key={s.n} style={styles.stepGroup}>
                <View style={styles.step}>
                  <View style={[styles.stepCircle, (active || done) && styles.stepCircleActive]}>
                    {done ? (
                      <Ionicons name="checkmark" size={13} color={Colors.primary} />
                    ) : (
                      <Text style={[styles.stepNum, (active || done) && styles.stepNumActive]}>
                        {s.n}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.stepLabel, (active || done) && styles.stepLabelActive]}>
                    {s.label}
                  </Text>
                </View>
                {i < arr.length - 1 && (
                  <View style={[styles.stepLine, done && styles.stepLineActive]} />
                )}
              </View>
            );
          })}
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + Spacing.xl * 2 },
        ]}
      >
        {/* ── STEP 1 ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step 1</Text>
          </View>
          <Text style={styles.sectionTitle}>Select Course Unit</Text>
          <Text style={styles.sectionSub}>Choose the unit you are grading for</Text>
        </View>

        {loadingUnits ? (
          <ActivityIndicator color={Colors.primary} style={{ marginVertical: Spacing.lg }} />
        ) : units.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="layers-outline" size={32} color={Colors.subtext} />
            <Text style={styles.emptyText}>No units found. Create a course with units first.</Text>
          </View>
        ) : (
          units.map((unit, idx) => {
            const isActive = selectedUnit?.id === unit.id;
            const color = UNIT_COLORS[idx % UNIT_COLORS.length];
            const hasGuide = guideStatus[unit.id];
            return (
              <TouchableOpacity
                key={unit.id}
                style={[styles.unitCard, isActive && styles.unitCardActive]}
                onPress={() => handleSelectUnit(unit)}
                activeOpacity={0.85}
              >
                {isActive && (
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                )}
                <View style={[styles.unitBar, { backgroundColor: isActive ? "rgba(255,255,255,0.35)" : color }]} />
                <View style={[styles.unitIcon, { backgroundColor: isActive ? "rgba(255,255,255,0.18)" : color + "18" }]}>
                  <Ionicons name="layers" size={20} color={isActive ? Colors.white : color} />
                </View>
                <View style={styles.unitInfo}>
                  <Text style={[styles.unitName, isActive && styles.whiteText]} numberOfLines={2}>
                    {unit.title}
                  </Text>
                  <View style={styles.unitMeta}>
                    <View style={[styles.codePill, { backgroundColor: isActive ? "rgba(255,255,255,0.2)" : color + "18" }]}>
                      <Text style={[styles.codePillText, { color: isActive ? Colors.white : color }]}>
                        {unit.courseCode}
                      </Text>
                    </View>
                    <View style={styles.guideStatusRow}>
                      <Ionicons
                        name={hasGuide ? "document-text" : "document-text-outline"}
                        size={12}
                        color={isActive ? "rgba(255,255,255,0.7)" : hasGuide ? Colors.success : Colors.subtext}
                      />
                      <Text style={[styles.metaText, isActive && styles.whiteSubText]}>
                        {hasGuide ? "Guide ready" : "No guide"}
                      </Text>
                    </View>
                  </View>
                </View>
                {isActive
                  ? <View style={styles.checkCircle}><Ionicons name="checkmark" size={16} color={Colors.primary} /></View>
                  : <View style={styles.radioCircle} />
                }
              </TouchableOpacity>
            );
          })
        )}

        {/* ── STEP 2 ── */}
        {selectedUnit && (
          <>
            <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
              <View style={[styles.stepBadge, { backgroundColor: Colors.accentLight }]}>
                <Text style={[styles.stepBadgeText, { color: Colors.accent }]}>Step 2</Text>
              </View>
              <Text style={styles.sectionTitle}>Select Student</Text>
              <Text style={styles.sectionSub}>Students for {selectedUnit.courseCode}</Text>
            </View>

            {loadingStudents ? (
              <ActivityIndicator color={Colors.primary} style={{ marginVertical: Spacing.md }} />
            ) : students.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="people-outline" size={32} color={Colors.subtext} />
                <Text style={styles.emptyText}>No students enrolled.</Text>
              </View>
            ) : (
              students.map((student) => {
                const isActive = selectedStudent?.user_id === student.user_id;
                return (
                  <TouchableOpacity
                    key={student.user_id}
                    style={[styles.studentCard, isActive && styles.studentCardActive]}
                    onPress={() => setSelectedStudent(student)}
                    activeOpacity={0.85}
                  >
                    {isActive && (
                      <LinearGradient
                        colors={[Colors.primary, Colors.primaryDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                    <View style={[styles.studentAvatar, isActive && styles.studentAvatarActive]}>
                      <Text style={[styles.studentAvatarText, isActive && styles.whiteText]}>
                        {student.name?.[0] ?? "?"}
                      </Text>
                    </View>
                    <View style={styles.studentInfo}>
                      <Text style={[styles.studentName, isActive && styles.whiteText]}>{student.name}</Text>
                      <View style={styles.metaRow}>
                        <Ionicons name="card-outline" size={12} color={isActive ? "rgba(255,255,255,0.7)" : Colors.subtext} />
                        <Text style={[styles.metaText, isActive && styles.whiteSubText]}>{student.student_id_number}</Text>
                      </View>
                    </View>
                    {isActive
                      ? <View style={styles.checkCircle}><Ionicons name="checkmark" size={16} color={Colors.primary} /></View>
                      : <View style={styles.radioCircle} />
                    }
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}

        {/* ── STEP 3 ── */}
        {selectedUnit && selectedStudent && (
          <>
            <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
              <View style={[styles.stepBadge, { backgroundColor: Colors.successLight }]}>
                <Text style={[styles.stepBadgeText, { color: Colors.success }]}>Step 3</Text>
              </View>
              <Text style={styles.sectionTitle}>Ready to Scan</Text>
              <Text style={styles.sectionSub}>Camera will open to capture the answer sheet</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={[styles.summaryIcon, { backgroundColor: Colors.primaryLight }]}>
                  <Ionicons name="layers-outline" size={18} color={Colors.primary} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Unit</Text>
                  <Text style={styles.summaryValue} numberOfLines={1}>{selectedUnit.title}</Text>
                </View>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <View style={[styles.summaryIcon, { backgroundColor: Colors.accentLight }]}>
                  <Ionicons name="person-outline" size={18} color={Colors.accent} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Student</Text>
                  <Text style={styles.summaryValue}>{selectedStudent.name}</Text>
                </View>
              </View>
            </View>

            {!guideStatus[selectedUnit.id] && (
              <View style={styles.warningCard}>
                <Ionicons name="warning-outline" size={20} color={Colors.warning} />
                <Text style={styles.warningText}>
                  No marking guide uploaded for this unit. Upload one first in the units screen.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.proceedBtn, !guideStatus[selectedUnit.id] && styles.proceedBtnDisabled]}
              onPress={handleStartGrading}
              activeOpacity={0.88}
              disabled={!guideStatus[selectedUnit.id]}
            >
              <LinearGradient
                colors={guideStatus[selectedUnit.id] ? [Colors.primary, Colors.primaryDark] : [Colors.subtext, Colors.subtext]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.proceedGradient}
              >
                <View style={styles.proceedIconBox}>
                  <Ionicons name="scan-outline" size={20} color={guideStatus[selectedUnit.id] ? Colors.primary : Colors.white} />
                </View>
                <Text style={styles.proceedBtnText}>Proceed to Scan</Text>
                <Ionicons name="arrow-forward" size={18} color={Colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
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
  headerIconBox: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center", alignItems: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  stepsRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.md,
  },
  stepGroup: { flexDirection: "row", alignItems: "center", flex: 1 },
  step: { alignItems: "center", gap: 4 },
  stepCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center", alignItems: "center",
  },
  stepCircleActive: { backgroundColor: Colors.white },
  stepNum: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: "rgba(255,255,255,0.6)" },
  stepNumActive: { color: Colors.primary },
  stepLabel: { fontSize: FontSize.xs, color: "rgba(255,255,255,0.6)" },
  stepLabelActive: { color: Colors.white, fontWeight: FontWeight.semibold },
  stepLine: {
    flex: 1, height: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: Spacing.xs, marginBottom: Spacing.lg,
  },
  stepLineActive: { backgroundColor: Colors.white },
  body: { paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg },
  sectionHeader: { marginBottom: Spacing.md },
  stepBadge: {
    alignSelf: "flex-start", backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full, paddingHorizontal: Spacing.sm,
    paddingVertical: 3, marginBottom: Spacing.xs,
  },
  stepBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.primary },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  sectionSub: { fontSize: FontSize.sm, color: Colors.subtext, marginTop: 2 },
  emptyBox: {
    alignItems: "center", padding: Spacing.xl,
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm,
  },
  emptyText: { fontSize: FontSize.sm, color: Colors.subtext, marginTop: Spacing.sm, textAlign: "center" },
  unitCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    marginBottom: Spacing.sm, borderWidth: 1.5, borderColor: Colors.border,
    overflow: "hidden", paddingRight: Spacing.md, paddingVertical: Spacing.md,
    gap: Spacing.md, ...Shadows.sm,
  },
  unitCardActive: { borderColor: Colors.primary },
  unitBar: { width: 5, height: "100%" },
  unitIcon: { width: 44, height: 44, borderRadius: Radius.md, justifyContent: "center", alignItems: "center" },
  unitInfo: { flex: 1 },
  unitName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: 4, lineHeight: 20 },
  unitMeta: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  codePill: { borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  codePillText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  guideStatusRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontSize: FontSize.xs, color: Colors.subtext },
  studentCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    marginBottom: Spacing.sm, borderWidth: 1.5, borderColor: Colors.border,
    overflow: "hidden", padding: Spacing.md,
    gap: Spacing.md, ...Shadows.sm,
  },
  studentCardActive: { borderColor: Colors.primary },
  studentAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center", alignItems: "center",
  },
  studentAvatarActive: { backgroundColor: "rgba(255,255,255,0.2)" },
  studentAvatarText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.primary },
  studentInfo: { flex: 1 },
  studentName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: 3 },
  whiteText: { color: Colors.white },
  whiteSubText: { color: "rgba(255,255,255,0.75)" },
  radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border },
  checkCircle: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.white, justifyContent: "center", alignItems: "center",
  },
  summaryCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.md, ...Shadows.sm, overflow: "hidden",
  },
  summaryRow: { flexDirection: "row", alignItems: "center", padding: Spacing.md, gap: Spacing.md },
  summaryDivider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.md + 44 + Spacing.md },
  summaryIcon: { width: 44, height: 44, borderRadius: Radius.md, justifyContent: "center", alignItems: "center" },
  summaryInfo: { flex: 1 },
  summaryLabel: { fontSize: FontSize.xs, color: Colors.subtext, marginBottom: 2 },
  summaryValue: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  proceedBtn: { borderRadius: Radius.xl, overflow: "hidden", marginBottom: Spacing.md, ...Shadows.colored },
  proceedBtnDisabled: { opacity: 0.6 },
  proceedGradient: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: Spacing.md + 2, paddingHorizontal: Spacing.lg, gap: Spacing.md,
  },
  proceedIconBox: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.white, justifyContent: "center", alignItems: "center",
  },
  proceedBtnText: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.white },
  warningCard: {
    flexDirection: "row", alignItems: "center", gap: Spacing.sm,
    backgroundColor: Colors.warningLight, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.warning + "30",
  },
  warningText: { flex: 1, fontSize: FontSize.sm, color: Colors.warning, lineHeight: 18 },
});
