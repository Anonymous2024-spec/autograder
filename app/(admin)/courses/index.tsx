import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

const COURSES = [
  {
    id: 1,
    name: "Bachelor of Information Technology",
    code: "BICT",
    students: 42,
    color: Colors.cardBlue,
  },
  {
    id: 2,
    name: "Bachelor of Computer Science",
    code: "BCS",
    students: 38,
    color: Colors.cardTeal,
  },
  {
    id: 3,
    name: "Bachelor of Software Engineering",
    code: "BSE",
    students: 44,
    color: Colors.cardGreen,
  },
];

export default function CoursesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const filtered = COURSES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOptions = (course: { id: number; name: string }) => {
    Alert.alert(course.name, "What would you like to do?", [
      {
        text: "Edit",
        onPress: () =>
          router.push({
            pathname: "/(admin)/courses/edit",
            params: { id: course.id },
          }),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDelete(course.id),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const confirmDelete = (id: number) => {
    Alert.alert("Delete Course", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => console.log("Delete course:", id),
      },
    ]);
  };

  return (
    <View style={styles.root}>
      {/* ── Header ── */}
      <LinearGradient
        colors={["#064E3B", "#059669", Colors.cardGreen]}
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
            <Text style={styles.headerTitle}>Courses</Text>
            <Text style={styles.headerSub}>
              {COURSES.length} registered courses
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              router.push({ pathname: "/(admin)/courses/register" })
            }
          >
            <Ionicons name="add" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.subtext} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search course name or code..."
            placeholderTextColor={Colors.placeholder}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.placeholder}
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          Showing <Text style={styles.resultsCount}>{filtered.length}</Text>{" "}
          {filtered.length === 1 ? "course" : "courses"}
        </Text>
      </View>

      {/* ── List ── */}
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
                { backgroundColor: Colors.successLight },
              ]}
            >
              <Ionicons
                name="book-outline"
                size={40}
                color={Colors.cardGreen}
              />
            </View>
            <Text style={styles.emptyTitle}>No Courses Found</Text>
            <Text style={styles.emptyText}>
              {search ? "Try a different search" : "Tap + to add a course"}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleOptions(item)}
            activeOpacity={0.85}
          >
            {/* Color bar on left */}
            <View style={[styles.colorBar, { backgroundColor: item.color }]} />

            {/* Icon */}
            <View
              style={[styles.cardIcon, { backgroundColor: item.color + "18" }]}
            >
              <Ionicons name="book" size={22} color={item.color} />
            </View>

            {/* Info */}
            <View style={styles.cardInfo}>
              <Text style={styles.cardName} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.cardBottom}>
                <View
                  style={[
                    styles.codeBadge,
                    { backgroundColor: item.color + "18" },
                  ]}
                >
                  <Text style={[styles.codeBadgeText, { color: item.color }]}>
                    {item.code}
                  </Text>
                </View>
                <View style={styles.studentCount}>
                  <Ionicons
                    name="people-outline"
                    size={12}
                    color={Colors.subtext}
                  />
                  <Text style={styles.studentCountText}>
                    {item.students} students
                  </Text>
                </View>
              </View>
            </View>

            {/* Menu */}
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
          </TouchableOpacity>
        )}
      />
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
    bottom: 10,
    left: -20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: FontSize.xxl,
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text,
    paddingVertical: 0,
  },
  resultsRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  resultsText: { fontSize: FontSize.sm, color: Colors.subtext },
  resultsCount: { fontWeight: FontWeight.bold, color: Colors.cardGreen },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    gap: Spacing.md,
    paddingRight: Spacing.md,
    paddingVertical: Spacing.md,
    ...Shadows.sm,
  },
  colorBar: {
    width: 5,
    height: "100%",
    borderRadius: 0,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: { flex: 1 },
  cardName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  codeBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  codeBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  studentCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  studentCountText: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },
  menuBtn: { padding: Spacing.xs },
  emptyContainer: {
    alignItems: "center",
    paddingTop: Spacing.xl * 2,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
});
