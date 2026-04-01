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

// TODO: Replace with real API call later
const STUDENTS = [
  {
    id: 1,
    name: "John Doe",
    reg_no: "23/U/1234",
    no: "2300712345",
    course: "BICT",
    courseColor: Colors.cardBlue,
  },
  {
    id: 2,
    name: "Jane Smith",
    reg_no: "23/U/5678",
    no: "2300756789",
    course: "BCS",
    courseColor: Colors.cardTeal,
  },
  {
    id: 3,
    name: "Peter Okello",
    reg_no: "23/U/9101",
    no: "2300791011",
    course: "BSE",
    courseColor: Colors.cardGreen,
  },
  {
    id: 4,
    name: "Mary Akello",
    reg_no: "23/U/1121",
    no: "2300711213",
    course: "BICT",
    courseColor: Colors.cardBlue,
  },
  {
    id: 5,
    name: "David Onen",
    reg_no: "23/U/1415",
    no: "2300714151",
    course: "BCS",
    courseColor: Colors.cardTeal,
  },
];

// Course filter options
const FILTERS = ["All", "BICT", "BCS", "BSE"];

export default function StudentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Filter students by search and course
  const filtered = STUDENTS.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.reg_no.toLowerCase().includes(search.toLowerCase()) ||
      s.no.includes(search);
    const matchFilter =
      activeFilter === "All" || s.course === activeFilter;
    return matchSearch && matchFilter;
  });

  const handleOptions = (student: { id: number; name: string }) => {
    Alert.alert(student.name, "What would you like to do?", [
      {
        text: "Edit",
        onPress: () =>
          router.push({
            pathname: "/(admin)/students/edit",
            params: { id: student.id },
          }),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDelete(student.id),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const confirmDelete = (id: number) => {
    Alert.alert(
      "Delete Student",
      "Are you sure you want to delete this student?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("Delete student:", id),
        },
      ]
    );
  };

  return (
    <View style={styles.root}>

      {/* ── Gradient header ── */}
      <LinearGradient
        colors={["#0D1F6B", "#1A3BAA", Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
      >
        <View style={styles.headerShapeL} />
        <View style={styles.headerShapeS} />

        {/* Title row */}
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Students</Text>
            <Text style={styles.headerSub}>
              {STUDENTS.length} registered students
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              router.push({ pathname: "/(admin)/students/register" })
            }
          >
            <Ionicons name="add" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.subtext} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name, reg no, student no..."
            placeholderTextColor={Colors.placeholder}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
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

      {/* ── Filter chips ── */}
      <View style={styles.filtersRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              activeFilter === f && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(f)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === f && styles.filterChipTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Results count ── */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          Showing{" "}
          <Text style={styles.resultsCount}>{filtered.length}</Text>{" "}
          {filtered.length === 1 ? "student" : "students"}
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
            <View style={styles.emptyIconBox}>
              <Ionicons
                name="people-outline"
                size={40}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>No Students Found</Text>
            <Text style={styles.emptyText}>
              {search
                ? "Try a different search term"
                : "Tap + to register a new student"}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>

            {/* Left — avatar with course color */}
            <LinearGradient
              colors={[item.courseColor, item.courseColor + "CC"]}
              style={styles.cardAvatar}
            >
              <Text style={styles.cardAvatarText}>{item.name[0]}</Text>
            </LinearGradient>

            {/* Middle — info */}
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{item.name}</Text>
              <View style={styles.cardMetaRow}>
                <Ionicons
                  name="card-outline"
                  size={12}
                  color={Colors.subtext}
                />
                <Text style={styles.cardMeta}>{item.reg_no}</Text>
              </View>
              <View style={styles.cardMetaRow}>
                <Ionicons
                  name="person-outline"
                  size={12}
                  color={Colors.subtext}
                />
                <Text style={styles.cardMeta}>{item.no}</Text>
              </View>
            </View>

            {/* Right — course badge + menu */}
            <View style={styles.cardRight}>
              <View
                style={[
                  styles.courseBadge,
                  { backgroundColor: item.courseColor + "18" },
                ]}
              >
                <Text
                  style={[
                    styles.courseBadgeText,
                    { color: item.courseColor },
                  ]}
                >
                  {item.course}
                </Text>
              </View>
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

          </View>
        )}
      />

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
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
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

  // Search
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

  // ── Filters ──
  filtersRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.subtext,
  },
  filterChipTextActive: {
    color: Colors.white,
  },

  // Results
  resultsRow: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  resultsText: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
  },
  resultsCount: {
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },

  // ── List ──
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
  card: {
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
  cardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  cardAvatarText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  cardName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardMeta: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },
  cardRight: {
    alignItems: "flex-end",
    gap: Spacing.xs,
  },
  courseBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  courseBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  menuBtn: {
    padding: Spacing.xs,
  },

  // ── Empty state ──
  emptyContainer: {
    alignItems: "center",
    paddingTop: Spacing.xl * 2,
  },
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