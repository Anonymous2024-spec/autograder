import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

// Mock students data - students in courses/units taught by lecturer
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
    course: "BICT",
    courseColor: Colors.cardBlue,
  },
  {
    id: 3,
    name: "Peter Okello",
    reg_no: "23/U/9101",
    no: "2300791011",
    course: "BICT",
    courseColor: Colors.cardBlue,
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
    course: "BICT",
    courseColor: Colors.cardBlue,
  },
];

export default function StudentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");

  const filtered = STUDENTS.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.reg_no.toLowerCase().includes(search.toLowerCase()) ||
      s.no.includes(search);
    return matchSearch;
  });

  const handleViewDetails = (id: number) => {
    router.push({
      pathname: "/(lecturer)/students/detail",
      params: { id },
    });
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <LinearGradient
        colors={["#1A3BAA", "#1A56DB", "#0EA5E9"]}
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
            <Text style={styles.headerTitle}>My Students</Text>
            <Text style={styles.headerSub}>
              {STUDENTS.length} students in your courses
            </Text>
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.subtext} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or reg number..."
            placeholderTextColor={Colors.placeholder}
            value={search}
            onChangeText={setSearch}
          />
          {search && (
            <TouchableOpacity onPress={() => setSearch("")} activeOpacity={0.6}>
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.placeholder}
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Students List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Ionicons
                name="person-outline"
                size={40}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>No students found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search criteria
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.studentCard}
            onPress={() => handleViewDetails(item.id)}
            activeOpacity={0.85}
          >
            <View style={styles.cardLeft}>
              <View
                style={[
                  styles.avatarBox,
                  { backgroundColor: item.courseColor + "20" },
                ]}
              >
                <Text style={[styles.avatarText, { color: item.courseColor }]}>
                  {item.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.studentMeta}>{item.reg_no}</Text>
                <Text style={styles.studentNo}>{item.no}</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              <View
                style={[
                  styles.courseBadge,
                  { backgroundColor: item.courseColor + "20" },
                ]}
              >
                <Text
                  style={[styles.courseBadgeText, { color: item.courseColor }]}
                >
                  {item.course}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.subtext}
              />
            </View>
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
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: 2,
  },
  headerSub: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.7)",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.white,
    paddingVertical: 8,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  studentInfo: { flex: 1 },
  studentName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  studentMeta: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },
  studentNo: {
    fontSize: FontSize.xs,
    color: Colors.placeholder,
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  courseBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  courseBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: Spacing.xl * 4,
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
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
  },
});
