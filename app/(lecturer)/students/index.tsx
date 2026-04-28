import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { lecturerAPI } from "../../../services/api";

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
    loadStudents();
  }, [token]);

  const loadStudents = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const courses = await lecturerAPI.getCourses(token);
      const seen = new Set<number>();
      const allStudents: any[] = [];
      for (const course of (courses ?? [])) {
        try {
          const courseStudents = await lecturerAPI.getCourseStudents(course.id, token);
          for (const s of (courseStudents ?? [])) {
            if (!seen.has(s.user_id)) {
              seen.add(s.user_id);
              allStudents.push({ ...s, courseCode: course.code, courseTitle: course.title });
            }
          }
        } catch {
          // skip courses with errors
        }
      }
      setStudents(allStudents);
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter((s) => {
    const name = s.name ?? "";
    const regNo = s.student_id_number ?? "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      regNo.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleViewDetails = (student: any) => {
    router.push({
      pathname: "/(lecturer)/students/detail",
      params: { id: student.student_id, userId: student.user_id, name: student.name },
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
              {students.length} student{students.length !== 1 ? "s" : ""} in your courses
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
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")} activeOpacity={0.6}>
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.placeholder}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </LinearGradient>

      {/* Students List */}
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.user_id.toString()}
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
                {search ? "Try adjusting your search criteria" : "No students enrolled in your courses"}
              </Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
            return (
              <TouchableOpacity
                style={styles.studentCard}
                onPress={() => handleViewDetails(item)}
                activeOpacity={0.85}
              >
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.avatarBox,
                      { backgroundColor: color + "20" },
                    ]}
                  >
                    <Text style={[styles.avatarText, { color }]}>
                      {(item.name ?? "?").charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.studentMeta}>{item.student_id_number}</Text>
                    <Text style={styles.studentNo}>{item.email}</Text>
                  </View>
                </View>
                <View style={styles.cardRight}>
                  <View
                    style={[
                      styles.courseBadge,
                      { backgroundColor: color + "20" },
                    ]}
                  >
                    <Text
                      style={[styles.courseBadgeText, { color }]}
                    >
                      {item.courseCode}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.subtext}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        />
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
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
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
