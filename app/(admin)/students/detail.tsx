import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { adminAPI } from "../../../services/api";

export default function StudentDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;
    adminAPI.getStudent(Number(id), token)
      .then(setStudent)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, id]);

  const handleEdit = () => {
    if (!student) return;
    router.push({
      pathname: "/(admin)/students/edit",
      params: {
        id: student.id,
        userId: student.user_id,
        name: student.user?.full_name ?? "",
        email: student.user?.email ?? "",
        regNo: student.student_id_number ?? "",
        department: student.department ?? "",
      },
    });
  };

  const handleDelete = () => {
    if (!student) return;
    Alert.alert(
      "Delete Student",
      `Delete ${student.user?.full_name ?? "this student"}? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!token) return;
            try {
              await adminAPI.deleteUser(student.user_id, token);
              router.back();
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to delete student");
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={[styles.root, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.root}>
        <LinearGradient
          colors={["#062B6E", "#1044B2", "#1A56DB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
        </LinearGradient>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Student not found</Text>
        </View>
      </View>
    );
  }

  const name = student.user?.full_name ?? "Unknown";
  const enrollmentDate = student.enrollment_date
    ? new Date(student.enrollment_date).toLocaleDateString()
    : "N/A";

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#062B6E", "#1044B2", "#1A56DB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}
      >
        <View style={styles.headerShapeL} />
        <View style={styles.headerShapeS} />

        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Student Details</Text>
            <Text style={styles.headerSub}>{student.student_id_number}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        {/* Student Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.avatarBox}>
            <Ionicons name="person-circle" size={56} color={Colors.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.studentName}>{name}</Text>
            <Text style={styles.studentMeta}>{student.student_id_number}</Text>
            {student.user?.email ? (
              <Text style={styles.studentEmail}>{student.user.email}</Text>
            ) : null}
            {student.department ? (
              <View style={[styles.deptBadge, { backgroundColor: Colors.primaryLight }]}>
                <Text style={[styles.deptBadgeText, { color: Colors.primary }]}>
                  {student.department}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{enrollmentDate}</Text>
            <Text style={styles.statLabel}>Enrolled</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{student.department ?? "—"}</Text>
            <Text style={styles.statLabel}>Department</Text>
          </View>
        </View>

        {/* Contact info */}
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.contactCard}>
          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={18} color={Colors.primary} />
            <Text style={styles.contactText}>{student.user?.email ?? "N/A"}</Text>
          </View>
          <View style={styles.contactDivider} />
          <View style={styles.contactRow}>
            <Ionicons name="card-outline" size={18} color={Colors.primary} />
            <Text style={styles.contactText}>{student.student_id_number}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleEdit} activeOpacity={0.7}>
          <Ionicons name="create-outline" size={18} color={Colors.primary} />
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
          <Text style={[styles.actionBtnText, { color: Colors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
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
  headerTop: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center", alignItems: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  body: { paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg },
  infoCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md,
    flexDirection: "row", gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, ...Shadows.sm,
  },
  avatarBox: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center", alignItems: "center",
  },
  infoContent: { flex: 1, justifyContent: "center" },
  studentName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: 2 },
  studentMeta: { fontSize: FontSize.sm, color: Colors.subtext, marginBottom: 2 },
  studentEmail: { fontSize: FontSize.xs, color: Colors.subtext, marginBottom: Spacing.xs },
  deptBadge: {
    alignSelf: "flex-start", paddingHorizontal: Spacing.sm,
    paddingVertical: 4, borderRadius: Radius.full,
  },
  deptBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  statsRow: {
    flexDirection: "row", backgroundColor: Colors.surface,
    borderRadius: Radius.xl, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, overflow: "hidden", ...Shadows.sm,
  },
  statBox: { flex: 1, paddingVertical: Spacing.md, alignItems: "center", justifyContent: "center" },
  statNumber: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary, textAlign: "center" },
  statLabel: { fontSize: FontSize.xs, color: Colors.subtext, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  sectionTitle: {
    fontSize: FontSize.md, fontWeight: FontWeight.bold,
    color: Colors.text, marginBottom: Spacing.md, marginTop: Spacing.sm,
  },
  contactCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border, ...Shadows.sm, overflow: "hidden",
  },
  contactRow: {
    flexDirection: "row", alignItems: "center",
    gap: Spacing.md, padding: Spacing.md,
  },
  contactText: { fontSize: FontSize.sm, color: Colors.text, flex: 1 },
  contactDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: FontSize.md, color: Colors.subtext },
  actionBar: {
    flexDirection: "row", paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border,
    gap: Spacing.md, ...Shadows.md,
  },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: Spacing.md, borderWidth: 1.5, borderColor: Colors.primary,
    borderRadius: Radius.lg, gap: Spacing.xs,
  },
  deleteBtn: { borderColor: Colors.error },
  actionBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.primary },
});
