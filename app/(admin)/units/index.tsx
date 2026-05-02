import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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
import { adminAPI } from "../../../services/api";

interface Course {
  id: number;
  title: string;
  code: string;
}

interface CourseUnit {
  id: number;
  title: string;
  description?: string;
  order?: number;
  course_id: number;
}

const UNIT_COLORS = [Colors.cardBlue, Colors.cardTeal, Colors.cardGreen, Colors.cardPurple];

export default function AdminUnitsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  const [units, setUnits] = useState<CourseUnit[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [coursePickerOpen, setCoursePickerOpen] = useState(false);

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
      setCourses(courseArray);
      
      if (courseArray.length > 0) {
        setSelectedCourse(courseArray[0]);
        await fetchUnitsForCourse(courseArray[0].id);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      Alert.alert("Error", "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnitsForCourse = async (courseId: number) => {
    try {
      const unitsList = await adminAPI.getCourseUnits(courseId, token);
      const unitsArray = Array.isArray(unitsList) ? unitsList : [];
      setUnits(unitsArray);
    } catch (error) {
      console.error("Error fetching units:", error);
      setUnits([]);
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setCoursePickerOpen(false);
    setSearch("");
    fetchUnitsForCourse(course.id);
  };

  const filtered = units.filter(
    (u) =>
      (u.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (u.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleOptions = (unit: CourseUnit) => {
    Alert.alert(unit.title, "What would you like to do?", [
      {
        text: "Edit",
        onPress: () =>
          router.push({
            pathname: "/(admin)/units/edit",
            params: {
              id: unit.id,
              title: unit.title,
              description: unit.description ?? "",
              courseId: unit.course_id,
            },
          }),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDelete(unit.id),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const confirmDelete = (id: number) => {
    Alert.alert("Delete Unit", "Are you sure? This will also delete all questions in this unit.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!token) return;
          try {
            await adminAPI.deleteCourseUnit(id, token);
            setUnits((prev) => prev.filter((u) => u.id !== id));
            Alert.alert("Success", "Unit deleted successfully");
          } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to delete unit");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      {/* ── Header ── */}
      <LinearGradient
        colors={["#7C3AED", "#A855F7", "#D946EF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
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
            <Text style={styles.headerTitle}>Course Units</Text>
            <Text style={styles.headerSub}>
              {units.length} unit{units.length !== 1 ? "s" : ""}
            </Text>
          </View>
          {selectedCourse && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() =>
                router.push({
                  pathname: "/(admin)/units/create",
                  params: { courseId: selectedCourse.id },
                })
              }
            >
              <Ionicons name="add" size={22} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>

        {/* Course Picker */}
        {loading ? (
          <ActivityIndicator color={Colors.white} style={styles.coursePicker} />
        ) : (
          <>
            <TouchableOpacity
              style={styles.coursePicker}
              onPress={() => setCoursePickerOpen(!coursePickerOpen)}
              activeOpacity={0.85}
            >
              <Ionicons name="book-outline" size={18} color={Colors.white} />
              <Text style={styles.coursePickerText} numberOfLines={1}>
                {selectedCourse ? selectedCourse.title : "Select a course..."}
              </Text>
              <Ionicons
                name={coursePickerOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={Colors.white}
              />
            </TouchableOpacity>

            {/* Course dropdown */}
            {coursePickerOpen && (
              <View style={styles.dropdown}>
                {courses.map((course) => (
                  <TouchableOpacity
                    key={course.id}
                    style={[
                      styles.dropdownItem,
                      selectedCourse?.id === course.id && styles.dropdownItemActive,
                    ]}
                    onPress={() => handleSelectCourse(course)}
                  >
                    <Ionicons name="book" size={16} color={Colors.white} />
                    <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                      <Text style={styles.dropdownName}>{course.title}</Text>
                      <Text style={styles.dropdownCode}>{course.code}</Text>
                    </View>
                    {selectedCourse?.id === course.id && (
                      <Ionicons name="checkmark" size={20} color={Colors.white} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.white} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search unit name..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          Showing <Text style={styles.resultsCount}>{filtered.length}</Text>{" "}
          {filtered.length === 1 ? "unit" : "units"}
        </Text>
      </View>

      {/* ── List ── */}
      {loading ? (
        <ActivityIndicator
          color={Colors.primary}
          style={{ marginTop: Spacing.xl }}
        />
      ) : selectedCourse ? (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.emptyIconBox,
                  { backgroundColor: "#EDE9FE" },
                ]}
              >
                <Ionicons
                  name="layers-outline"
                  size={40}
                  color="#7C3AED"
                />
              </View>
              <Text style={styles.emptyTitle}>No Units Found</Text>
              <Text style={styles.emptyText}>
                {search
                  ? "Try a different search"
                  : "Tap + to add a unit for this course"}
              </Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const color = UNIT_COLORS[index % UNIT_COLORS.length];
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleOptions(item)}
                activeOpacity={0.85}
              >
                <View style={[styles.cardBar, { backgroundColor: color }]} />
                <View
                  style={[
                    styles.cardIconBox,
                    { backgroundColor: color + "20" },
                  ]}
                >
                  <Ionicons name="layers" size={20} color={color} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardDescription} numberOfLines={1}>
                    {item.description || "No description"}
                  </Text>
                </View>
                <Ionicons
                  name="ellipsis-vertical"
                  size={18}
                  color={Colors.subtext}
                />
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconBox,
              { backgroundColor: Colors.primaryLight },
            ]}
          >
            <Ionicons
              name="book-outline"
              size={40}
              color={Colors.primary}
            />
          </View>
          <Text style={styles.emptyTitle}>No Courses Available</Text>
          <Text style={styles.emptyText}>
            Create a course first
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

  // Course picker
  coursePicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  coursePickerText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.white,
  },

  // Dropdown
  dropdown: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
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
    backgroundColor: "#EDE9FE",
  },
  dropdownName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  dropdownCode: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
    marginTop: 2,
  },

  // Search bar
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.white,
  },

  // Results row
  resultsRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  resultsText: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },
  resultsCount: {
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },

  // ── List ──
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  card: {
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
  cardBar: {
    width: 4,
    height: 50,
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  cardDescription: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
    marginTop: 2,
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
