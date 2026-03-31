import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

// TODO: Replace with real API call later
const COURSES = [
  { id: 1, name: "Bachelor of Information Technology", code: "BICT" },
  { id: 2, name: "Bachelor of Computer Science", code: "BCS" },
  { id: 3, name: "Bachelor of Software Engineering", code: "BSE" },
];

// TODO: Replace with real API call later
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

  // Track selected course
  const [selectedCourse, setSelectedCourse] = useState<
    (typeof COURSES)[0] | null
  >(null);

  // Track whether course picker is expanded
  const [pickerOpen, setPickerOpen] = useState(false);

  // Filter questions by selected course
  const questions = selectedCourse
    ? ALL_QUESTIONS.filter((q) => q.course_id === selectedCourse.id)
    : [];

  // Handle generate answer sheet
  const handleGenerateSheet = () => {
    if (!selectedCourse) {
      Alert.alert("No Course", "Please select a course first.");
      return;
    }

    if (questions.length === 0) {
      Alert.alert(
        "No Questions",
        "This course has no questions yet. Add questions first.",
      );
      return;
    }

    // Navigate to sheet screen with questions and course
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
    Alert.alert(
      "Delete Question",
      "Are you sure you want to delete this question?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          // TODO: Replace with real API delete call later
          onPress: () => console.log("Delete question with id:", id),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Course picker ── */}
      <View style={styles.pickerSection}>
        <Text style={styles.pickerLabel}>Course</Text>

        {/* Picker trigger button */}
        <TouchableOpacity
          style={styles.pickerTrigger}
          onPress={() => setPickerOpen(!pickerOpen)}
        >
          <Ionicons name="book-outline" size={18} color={Colors.primary} />
          <Text
            style={[
              styles.pickerTriggerText,
              !selectedCourse && styles.pickerPlaceholder,
            ]}
          >
            {selectedCourse ? selectedCourse.name : "Select a course..."}
          </Text>
          <Ionicons
            name={pickerOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color={Colors.subtext}
          />
        </TouchableOpacity>

        {/* Dropdown options */}
        {pickerOpen && (
          <View style={styles.pickerDropdown}>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {COURSES.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  style={[
                    styles.pickerOption,
                    selectedCourse?.id === course.id &&
                      styles.pickerOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedCourse(course);
                    setPickerOpen(false);
                  }}
                >
                  {/* Course code badge */}
                  <View
                    style={[
                      styles.courseBadge,
                      selectedCourse?.id === course.id &&
                        styles.courseBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.courseBadgeText,
                        selectedCourse?.id === course.id &&
                          styles.courseBadgeTextActive,
                      ]}
                    >
                      {course.code}
                    </Text>
                  </View>

                  {/* Course name */}
                  <Text
                    style={[
                      styles.pickerOptionText,
                      selectedCourse?.id === course.id &&
                        styles.pickerOptionTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {course.name}
                  </Text>

                  {/* Checkmark when selected */}
                  {selectedCourse?.id === course.id && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={Colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* ── Generate answer sheet banner — only visible when course is selected ── */}
      {selectedCourse && (
        <TouchableOpacity
          style={styles.generateBanner}
          onPress={handleGenerateSheet}
        >
          <View style={styles.generateIconBox}>
            <Ionicons
              name="document-text-outline"
              size={22}
              color={Colors.primary}
            />
          </View>
          <View style={styles.generateInfo}>
            <Text style={styles.generateTitle}>Generate Answer Sheet</Text>
            <Text style={styles.generateSubtitle}>
              {questions.length} question(s) for {selectedCourse.code}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
        </TouchableOpacity>
      )}

      {/* ── Questions list ── */}
      {selectedCourse ? (
        <FlatList
          data={questions}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="help-circle-outline"
                size={48}
                color={Colors.border}
              />
              <Text style={styles.emptyText}>No questions yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add your first question
              </Text>
            </View>
          }
          ListHeaderComponent={
            questions.length > 0 ? (
              <Text style={styles.listHeader}>
                {questions.length} Question
                {questions.length !== 1 ? "s" : ""} for {selectedCourse.code}
              </Text>
            ) : null
          }
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              {/* Question number */}
              <View style={styles.numberBox}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>

              {/* Question text */}
              <Text style={styles.question} numberOfLines={2}>
                {item.question}
              </Text>

              {/* Three dot menu */}
              <TouchableOpacity
                onPress={() => handleOptions(item)}
                style={styles.menuButton}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={Colors.subtext}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        // No course selected state
        <View style={styles.noCourseContainer}>
          <Ionicons name="book-outline" size={56} color={Colors.border} />
          <Text style={styles.noCourseText}>No Course Selected</Text>
          <Text style={styles.noCourseSubtext}>
            Select a course above to view and manage its questions
          </Text>
        </View>
      )}

      {/* ── Floating add button — only when course is selected ── */}
      {selectedCourse && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            router.push({ pathname: "/(lecturer)/questions/create" })
          }
        >
          <Ionicons name="add" size={28} color={Colors.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Course picker ──
  pickerSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    zIndex: 10,
  },
  pickerLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerTriggerText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: "500",
  },
  pickerPlaceholder: {
    color: Colors.placeholder,
    fontWeight: "400",
  },
  pickerDropdown: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.xs,
    maxHeight: 200,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerOptionActive: {
    backgroundColor: Colors.primaryLight,
  },
  courseBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
  },
  courseBadgeActive: {
    backgroundColor: Colors.primary + "20",
  },
  courseBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.subtext,
  },
  courseBadgeTextActive: {
    color: Colors.primary,
  },
  pickerOptionText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  pickerOptionTextActive: {
    color: Colors.primary,
    fontWeight: "600",
  },

  // ── Generate banner ──
  generateBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + "30",
    gap: Spacing.md,
  },
  generateIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  generateInfo: {
    flex: 1,
  },
  generateTitle: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.primary,
  },
  generateSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.primary + "99",
    marginTop: 2,
  },

  // ── List ──
  list: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
  listHeader: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.subtext,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  numberBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  numberText: {
    fontSize: FontSize.sm,
    fontWeight: "bold",
    color: Colors.primary,
  },
  question: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 22,
  },
  menuButton: {
    padding: Spacing.xs,
  },

  // ── No course selected state ──
  noCourseContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  noCourseText: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.subtext,
    marginTop: Spacing.md,
  },
  noCourseSubtext: {
    fontSize: FontSize.sm,
    color: Colors.placeholder,
    textAlign: "center",
    marginTop: Spacing.xs,
    lineHeight: 20,
  },

  // ── Empty state ──
  emptyContainer: {
    alignItems: "center",
    marginTop: Spacing.xl * 2,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.subtext,
    marginTop: Spacing.md,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: Colors.placeholder,
    marginTop: Spacing.xs,
  },

  // ── FAB ──
  fab: {
    position: "absolute",
    bottom: Spacing.xl,
    right: Spacing.lg,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
