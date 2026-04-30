import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import {
  Alert,
  ActivityIndicator,
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
import { useAuth } from "../../../context/AuthContext";
import { adminAPI } from "../../../services/api";

// Question interface
interface CourseWithUnits {
  id: number;
  title: string;
  code: string;
  description?: string;
  units?: CourseUnit[];
}

interface CourseUnit {
  id: number;
  title: string;
  description?: string;
  order?: number;
  questions?: Question[];
}

interface Question {
  id: number;
  question_text?: string;
  unit_id: number;
}

const COURSE_COLORS = [Colors.cardBlue, Colors.cardTeal, Colors.cardGreen, Colors.cardPurple];

export default function AdminQuestionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  // State
  const [courses, setCourses] = useState<CourseWithUnits[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithUnits | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<CourseUnit | null>(null);
  const [coursePickerOpen, setCoursePickerOpen] = useState(false);
  const [unitPickerOpen, setUnitPickerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch courses when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchCourses();
      }
    }, [token])
  );

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const courseList = await adminAPI.getAllCourses(token);
      const courseArray = Array.isArray(courseList) ? courseList : [];
      
      // Fetch detailed data with units for each course
      const coursesWithUnits: CourseWithUnits[] = [];
      for (const course of courseArray) {
        try {
          const courseData = await adminAPI.getCourse(course.id, token);
          coursesWithUnits.push(courseData);
        } catch (error) {
          console.error(`Error fetching course ${course.id}:`, error);
          coursesWithUnits.push(course);
        }
      }
      
      setCourses(coursesWithUnits);
    } catch (error) {
      console.error("Error fetching courses:", error);
      Alert.alert("Error", "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // Units filtered by selected course
  const courseUnits = selectedCourse?.units || [];

  // Questions filtered by selected unit
  const unitQuestions = selectedUnit
    ? selectedUnit.questions || []
    : [];

  // Selecting a course resets unit selection
  const handleSelectCourse = (course: CourseWithUnits) => {
    setSelectedCourse(course);
    setSelectedUnit(null);
    setCoursePickerOpen(false);
  };

  const handleSelectUnit = (unit: CourseUnit) => {
    setSelectedUnit(unit);
    setUnitPickerOpen(false);
  };

  const handleGenerateSheet = () => {
    if (!selectedUnit) {
      Alert.alert("No Unit", "Please select a course unit first.");
      return;
    }
    if (unitQuestions.length === 0) {
      Alert.alert("No Questions", "Add questions to this unit first.");
      return;
    }
    router.push({
      pathname: "/(admin)/questions/sheet",
      params: {
        unitId: selectedUnit.id,
        unitName: selectedUnit.title,
        unitCode: selectedUnit.description,
      },
    });
  };

  const handleOptions = (question: Question) => {
    Alert.alert("Question Options", "What would you like to do?", [
      {
        text: "Edit",
        onPress: () =>
          router.push({
            pathname: "/(admin)/questions/edit",
            params: { id: question.id, unitId: selectedUnit?.id },
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

  const getColor = (index: number) => COURSE_COLORS[index % COURSE_COLORS.length];

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

        {/* Title row */}
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Questions</Text>
            <Text style={styles.headerSub}>Manage MCQ question bank</Text>
          </View>
          {selectedUnit && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() =>
                router.push({
                  pathname: "/(admin)/questions/create",
                  params: { unitId: selectedUnit.id },
                })
              }
            >
              <Ionicons name="add" size={22} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Course picker trigger ── */}
        {loading ? (
          <ActivityIndicator color={Colors.white} style={styles.pickerTrigger} />
        ) : (
          <>
            <TouchableOpacity
              style={styles.pickerTrigger}
              onPress={() => {
                setCoursePickerOpen(!coursePickerOpen);
                setUnitPickerOpen(false);
              }}
              activeOpacity={0.85}
            >
              {selectedCourse ? (
                <View
                  style={[
                    styles.pickerIcon,
                    { backgroundColor: getColor(0) + "25" },
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
                {selectedCourse ? selectedCourse.title : "1. Select a course..."}
              </Text>
              <Ionicons
                name={coursePickerOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={selectedCourse ? Colors.white : Colors.subtext}
              />
            </TouchableOpacity>

            {/* ── Unit picker trigger — only visible after course is selected ── */}
            {selectedCourse && (
              <TouchableOpacity
                style={[styles.pickerTrigger, styles.pickerTriggerSecond]}
                onPress={() => {
                  setUnitPickerOpen(!unitPickerOpen);
                  setCoursePickerOpen(false);
                }}
                activeOpacity={0.85}
              >
                {selectedUnit ? (
                  <View
                    style={[
                      styles.pickerIcon,
                      { backgroundColor: getColor(1) + "25" },
                    ]}
                  >
                    <Ionicons name="layers" size={16} color={Colors.white} />
                  </View>
                ) : (
                  <Ionicons
                    name="layers-outline"
                    size={18}
                    color={Colors.subtext}
                  />
                )}
                <Text
                  style={[
                    styles.pickerTriggerText,
                    !selectedUnit && styles.pickerPlaceholder,
                  ]}
                >
                  {selectedUnit ? selectedUnit.title : "2. Select a course unit..."}
                </Text>
                <Ionicons
                  name={unitPickerOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={selectedUnit ? Colors.white : Colors.subtext}
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </LinearGradient>

      {/* ── Course dropdown ── */}
      {coursePickerOpen && (
        <View style={styles.dropdown}>
          {courses.length === 0 ? (
            <View style={styles.dropdownEmpty}>
              <Text style={styles.dropdownEmptyText}>
                No courses available
              </Text>
            </View>
          ) : (
            courses.map((course, index) => (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.dropdownItem,
                  selectedCourse?.id === course.id && styles.dropdownItemActive,
                ]}
                onPress={() => handleSelectCourse(course)}
              >
                <View
                  style={[styles.dropdownBar, { backgroundColor: getColor(index) }]}
                />
                <View
                  style={[
                    styles.dropdownIcon,
                    { backgroundColor: getColor(index) + "18" },
                  ]}
                >
                  <Ionicons name="book" size={16} color={getColor(index)} />
                </View>
                <View style={styles.dropdownInfo}>
                  <Text style={styles.dropdownName} numberOfLines={1}>
                    {course.title}
                  </Text>
                  <View
                    style={[
                      styles.codeBadge,
                      { backgroundColor: getColor(index) + "18" },
                    ]}
                  >
                    <Text style={[styles.codeBadgeText, { color: getColor(index) }]}>
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
            ))
          )}
        </View>
      )}

      {/* ── Unit dropdown ── */}
      {unitPickerOpen && (
        <View style={styles.dropdown}>
          {courseUnits.length === 0 ? (
            <View style={styles.dropdownEmpty}>
              <Text style={styles.dropdownEmptyText}>
                No units for this course
              </Text>
            </View>
          ) : (
            courseUnits.map((unit, index) => (
              <TouchableOpacity
                key={unit.id}
                style={[
                  styles.dropdownItem,
                  selectedUnit?.id === unit.id && styles.dropdownItemActive,
                ]}
                onPress={() => handleSelectUnit(unit)}
              >
                <View
                  style={[styles.dropdownBar, { backgroundColor: getColor(index) }]}
                />
                <View
                  style={[
                    styles.dropdownIcon,
                    { backgroundColor: getColor(index) + "18" },
                  ]}
                >
                  <Ionicons name="layers" size={16} color={getColor(index)} />
                </View>
                <View style={styles.dropdownInfo}>
                  <Text style={styles.dropdownName} numberOfLines={1}>
                    {unit.title}
                  </Text>
                  <View
                    style={[
                      styles.codeBadge,
                      { backgroundColor: getColor(index) + "18" },
                    ]}
                  >
                    <Text style={[styles.codeBadgeText, { color: getColor(index) }]}>
                      {unit.description || `${unit.questions?.length || 0} questions`}
                    </Text>
                  </View>
                </View>
                {selectedUnit?.id === unit.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={Colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* ── Generate sheet banner — only when unit has questions ── */}
      {selectedUnit && unitQuestions.length > 0 && (
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
                {unitQuestions.length} question(s) for {selectedUnit.title}
              </Text>
            </View>
            <View style={styles.generateArrow}>
              <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* ── Questions list or empty states ── */}
      {selectedUnit ? (
        <FlatList
          data={unitQuestions}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            unitQuestions.length > 0 ? (
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderText}>
                  {unitQuestions.length} question{unitQuestions.length !== 1 ? "s" : ""}
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.emptyIconBox,
                  { backgroundColor: Colors.primaryLight },
                ]}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={40}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.emptyTitle}>No Questions Yet</Text>
              <Text style={styles.emptyText}>
                Create questions for this unit
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.questionCard}
              onPress={() => handleOptions(item)}
              activeOpacity={0.85}
            >
              <View style={styles.questionCardContent}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>Q</Text>
                </View>
                <View style={styles.questionInfo}>
                  <Text style={styles.questionText} numberOfLines={2}>
                    {item.question_text || "Untitled Question"}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="ellipsis-vertical"
                size={18}
                color={Colors.subtext}
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconBox,
              { backgroundColor: Colors.accentLight },
            ]}
          >
            <Ionicons
              name="book-outline"
              size={40}
              color={Colors.accent}
            />
          </View>
          <Text style={styles.emptyTitle}>Select a Course & Unit</Text>
          <Text style={styles.emptyText}>
            Choose a course and unit to view questions
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Header ──
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    overflow: "hidden",
  },
  headerShapeL: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -80,
    right: -60,
  },
  headerShapeS: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: 10,
    left: -30,
  },

  // Header content
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  headerSub: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Picker triggers
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  pickerTriggerSecond: {
    marginBottom: 0,
  },
  pickerIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerTriggerText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.white,
  },
  pickerPlaceholder: {
    color: "rgba(255,255,255,0.6)",
    fontWeight: FontWeight.regular,
  },

  // Dropdown
  dropdown: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: "hidden",
    ...Shadows.md,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemActive: {
    backgroundColor: Colors.primaryLight,
  },
  dropdownBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  dropdownIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  dropdownInfo: {
    flex: 1,
  },
  dropdownName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  codeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  codeBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  dropdownEmpty: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownEmptyText: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
  },

  // Generate sheet banner
  generateBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadows.sm,
  },
  generateGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  generateIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  generateInfo: {
    flex: 1,
  },
  generateTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  generateSub: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
    marginTop: 2,
  },
  generateArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(25,90,220,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Questions list
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  listHeader: {
    marginBottom: Spacing.md,
  },
  listHeaderText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.subtext,
  },
  questionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  questionCardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  questionNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  questionNumberText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  questionInfo: {
    flex: 1,
  },
  questionText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },

  // Empty states
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
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
