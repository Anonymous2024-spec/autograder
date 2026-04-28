import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

const AVATAR_COLORS = [Colors.cardBlue, Colors.cardTeal, Colors.cardGreen, Colors.cardPurple];

export default function StudentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) return;
    adminAPI.getAllStudents(token)
      .then((data) => setStudents(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = students.filter((s) => {
    const name = s.user?.full_name ?? "";
    const regNo = s.student_id_number ?? "";
    const email = s.user?.email ?? "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      regNo.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleOptions = (student: any) => {
    const name = student.user?.full_name ?? "Student";
    Alert.alert(name, "What would you like to do?", [
      {
        text: "View Details",
        onPress: () =>
          router.push({
            pathname: "/(admin)/students/detail",
            params: { id: student.id },
          }),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDelete(student.user_id, name),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const confirmDelete = (userId: number, name: string) => {
    Alert.alert("Delete Student", `Delete ${name}? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!token) return;
          try {
            await adminAPI.deleteUser(userId, token);
            setStudents((prev) => prev.filter((s) => s.user_id !== userId));
          } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to delete student");
          }
        },
      },
    ]);
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
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Students</Text>
            <Text style={styles.headerSub}>
              {students.length} registered student{students.length !== 1 ? "s" : ""}
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

      {/* ── Results count ── */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          Showing <Text style={styles.resultsCount}>{filtered.length}</Text>{" "}
          {filtered.length === 1 ? "student" : "students"}
        </Text>
      </View>

      {/* ── List ── */}
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="people-outline" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No Students Found</Text>
              <Text style={styles.emptyText}>
                {search ? "Try a different search term" : "No students registered yet"}
              </Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
            const name = item.user?.full_name ?? "Unknown";
            return (
              <View style={styles.card}>
                <LinearGradient
                  colors={[color, color + "CC"]}
                  style={styles.cardAvatar}
                >
                  <Text style={styles.cardAvatarText}>{name[0]}</Text>
                </LinearGradient>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{name}</Text>
                  <View style={styles.cardMetaRow}>
                    <Ionicons name="card-outline" size={12} color={Colors.subtext} />
                    <Text style={styles.cardMeta}>{item.student_id_number}</Text>
                  </View>
                  <View style={styles.cardMetaRow}>
                    <Ionicons name="mail-outline" size={12} color={Colors.subtext} />
                    <Text style={styles.cardMeta}>{item.user?.email}</Text>
                  </View>
                </View>
                <View style={styles.cardRight}>
                  <View style={[styles.courseBadge, { backgroundColor: color + "18" }]}>
                    <Text style={[styles.courseBadgeText, { color }]}>
                      {item.department ?? "N/A"}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.menuBtn} onPress={() => handleOptions(item)}>
                    <Ionicons name="ellipsis-vertical" size={18} color={Colors.subtext} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
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
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
});
