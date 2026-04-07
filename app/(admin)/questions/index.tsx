import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
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

const COURSES = [
  {
    id: 1,
    name: "Bachelor of Information Technology",
    code: "BICT",
    color: Colors.cardBlue,
  },
  {
    id: 2,
    name: "Bachelor of Computer Science",
    code: "BCS",
    color: Colors.cardTeal,
  },
  {
    id: 3,
    name: "Bachelor of Software Engineering",
    code: "BSE",
    color: Colors.cardGreen,
  },
];

const ALL_QUESTIONS = [
  { id: 1, question: "What is the full meaning of CPU?", course_id: 1 },
  { id: 2, question: "Which data structure uses FIFO order?", course_id: 1 },
  { id: 3, question: "What does RAM stand for?", course_id: 1 },
  { id: 4, question: "What does CSS stand for?", course_id: 2 },
  { id: 5, question: "Which language runs in a web browser?", course_id: 2 },
  { id: 6, question: "What is an algorithm?", course_id: 3 },
];

export default function QuestionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedCourse, setSelectedCourse] = useState<
    (typeof COURSES)[0] | null
  >(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const questions = selectedCourse
    ? ALL_QUESTIONS.filter((q) => q.course_id === selectedCourse.id)
    : [];

  const handleGenerateSheet = () => {
    if (!selectedCourse) {
      Alert.alert("No Course", "Please select a course first.");
      return;
    }
    if (questions.length === 0) {
      Alert.alert("No Questions", "Add questions first.");
      return;
    }
    router.push({
      pathname: "/(lecturer)/questions/sheet",
      params: {
        courseId: selectedCourse.id,
        courseName: selectedCourse.name,
        courseCode: selectedCourse.code,
      },
    });
  };

  const handleOptions = (question: { id: number; question: string }) => {
    Alert.alert("Question Options", "What would you like to do?", [
      {
        text: "Edit",
        onPress: () =>
          router.push({
            pathname: "/(lecturer)/questions/edit",
            params: { id: question.id },
          }),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDelete(question.id),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const confirmDelete = (id: number) => {
    Alert.alert("Delete Question", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => console.log("Delete:", id),
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
          <View style={styles.headerIconBox}>
            <Ionicons name="help-circle" size={22} color={Colors.white} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Questions</Text>
            <Text style={styles.headerSub}>Manage MCQ question bank</Text>
          </View>
          {selectedCourse && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() =>
                router.push({ pathname: "/(lecturer)/questions/create" })
              }
            >
              <Ionicons name="add" size={22} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>

        {/* Course picker trigger */}
        <TouchableOpacity
          style={styles.pickerTrigger}
          onPress={() => setPickerOpen(!pickerOpen)}
          activeOpacity={0.85}
        >
          {selectedCourse ? (
            <View
              style={[
                styles.pickerCourseIcon,
                { backgroundColor: selectedCourse.color + "25" },
              ]}
            >
              <Ionicons name="book" size={16} color={Colors.white} />
            </View>
          ) : (
            <Ionicons name="book-outline" size={18} color={Colors.subtext} />
          )}
          <Text
            style={[
              styles.pickerTriggerText,
              !selectedCourse && styles.pickerPlaceholder,
            ]}
          >
            {selectedCourse
              ? selectedCourse.name
              : "Select a course to view questions..."}
          </Text>
          <Ionicons
            name={pickerOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color={selectedCourse ? Colors.white : Colors.subtext}
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* ── Course dropdown ── */}
      {pickerOpen && (
        <View style={styles.dropdown}>
          {COURSES.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={[
                styles.dropdownItem,
                selectedCourse?.id === course.id && styles.dropdownItemActive,
              ]}
              onPress={() => {
                setSelectedCourse(course);
                setPickerOpen(false);
              }}
            >
              <View
                style={[styles.dropdownBar, { backgroundColor: course.color }]}
              />
              <View
                style={[
                  styles.dropdownIcon,
                  { backgroundColor: course.color + "18" },
                ]}
              >
                <Ionicons name="book" size={16} color={course.color} />
              </View>
              <View style={styles.dropdownInfo}>
                <Text style={styles.dropdownName} numberOfLines={1}>
                  {course.name}
                </Text>
                <View
                  style={[
                    styles.codeBadge,
                    { backgroundColor: course.color + "18" },
                  ]}
                >
                  <Text style={[styles.codeBadgeText, { color: course.color }]}>
                    {course.code}
                  </Text>
                </View>
              </View>
              {selectedCourse?.id === course.id && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={Colors.primary}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── Generate sheet banner ── */}
      {selectedCourse && questions.length > 0 && (
        <TouchableOpacity
          style={styles.generateBanner}
          onPress={handleGenerateSheet}
        >
          <LinearGradient
            colors={[Colors.primaryLight, "#D1E3FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.generateGradient}
          >
            <View style={styles.generateIconBox}>
              <Ionicons name="document-text" size={20} color={Colors.primary} />
            </View>
            <View style={styles.generateInfo}>
              <Text style={styles.generateTitle}>Generate Answer Sheet</Text>
              <Text style={styles.generateSub}>
                {questions.length} question(s) for {selectedCourse.code}
              </Text>
            </View>
            <View style={styles.generateArrow}>
              <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* ── Questions list or empty states ── */}
      {selectedCourse ? (
        <FlatList
          data={questions}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            questions.length > 0 ? (
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderText}>
                  {questions.length} Question{questions.length !== 1 ? "s" : ""}
                </Text>
                <View
                  style={[
                    styles.courseTag,
                    {
                      backgroundColor:
                        (COURSES.find((c) => c.id === selectedCourse.id)
                          ?.color ?? Colors.primary) + "18",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.courseTagText,
                      {
                        color:
                          COURSES.find((c) => c.id === selectedCourse.id)
                            ?.color ?? Colors.primary,
                      },
                    ]}
                  >
                    {selectedCourse.code}
                  </Text>
                </View>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Ionicons
                  name="help-circle-outline"
                  size={40}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.emptyTitle}>No Questions Yet</Text>
              <Text style={styles.emptyText}>
                Tap + to add your first question for {selectedCourse.code}
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={styles.questionCard}>
              <View style={styles.questionNumBox}>
                <Text style={styles.questionNumText}>{index + 1}</Text>
              </View>
              <Text style={styles.questionText} numberOfLines={2}>
                {item.question}
              </Text>
              <TouchableOpacity
                style={styles.menuBtn}
                onPress={() => handleOptions(item)}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={18}
                  color={Colors.subtext}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={styles.noCourseContainer}>
          <View style={styles.noCourseIconBox}>
            <Ionicons name="book-outline" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.noCourseTitle}>No Course Selected</Text>
          <Text style={styles.noCourseText}>
            Tap the course picker above to view and manage questions
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    overflow: "hidden",
    zIndex: 10,
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
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
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
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  pickerCourseIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerTriggerText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
  pickerPlaceholder: {
    color: Colors.placeholder,
    fontWeight: FontWeight.regular,
  },

  // Dropdown
  dropdown: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
    zIndex: 20,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingRight: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
    overflow: "hidden",
  },
  dropdownItemActive: { backgroundColor: Colors.primaryLight },
  dropdownBar: { width: 4, height: "100%" },
  dropdownIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownInfo: { flex: 1, gap: 3 },
  dropdownName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  codeBadge: {
    alignSelf: "flex-start",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  codeBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },

  // Generate banner
  generateBanner: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: Radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.primary + "30",
  },
  generateGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.md,
  },
  generateIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.sm,
  },
  generateInfo: { flex: 1 },
  generateTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  generateSub: {
    fontSize: FontSize.xs,
    color: Colors.primary + "99",
    marginTop: 2,
  },
  generateArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  // List
  list: { padding: Spacing.lg, paddingBottom: Spacing.xl * 3 },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  listHeaderText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.subtext,
  },
  courseTag: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  courseTagText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },

  // Question cards
  questionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  questionNumBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  questionNumText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  questionText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 22,
  },
  menuBtn: { padding: Spacing.xs },

  // Empty / no course states
  noCourseContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  noCourseIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  noCourseTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  noCourseText: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    textAlign: "center",
    lineHeight: 20,
  },
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
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    textAlign: "center",
  },
});
