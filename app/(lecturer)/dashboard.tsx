import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import {
  Alert,
  Dimensions,
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
} from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { lecturerAPI } from "../../services/api";

const { width } = Dimensions.get("window");

export default function LecturerDashboard() {
  const router = useRouter();
  const { user, logout, token } = useAuth();
  const insets = useSafeAreaInsets();

  const [questionCount, setQuestionCount] = useState(0);
  const [gradedCount, setGradedCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [pendingCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchDashboardStats();
      }
    }, [token])
  );

  const fetchDashboardStats = async () => {
    try {
      const courses = await lecturerAPI.getCourses(token!);
      const courseList = Array.isArray(courses) ? courses : [];
      setCourseCount(courseList.length);

      let totalQuestions = 0;
      let totalGrades = 0;
      let totalStudents = 0;

      for (const course of courseList) {
        try {
          const questions = await lecturerAPI.getCourseQuestions(course.id, token!);
          if (Array.isArray(questions)) {
            totalQuestions += questions.length;
          }
        } catch (err) {
          console.error(`Error fetching questions for course ${course.id}:`, err);
        }

        try {
          const grades = await lecturerAPI.getCourseGrades(course.id, token!);
          if (Array.isArray(grades)) {
            totalGrades += grades.length;
          }
        } catch (err) {
          console.error(`Error fetching grades for course ${course.id}:`, err);
        }

        try {
          const students = await lecturerAPI.getCourseStudents(course.id, token!);
          if (Array.isArray(students)) {
            totalStudents += students.length;
          }
        } catch (err) {
          console.error(`Error fetching students for course ${course.id}:`, err);
        }
      }

      setQuestionCount(totalQuestions);
      setGradedCount(totalGrades);
      setStudentCount(totalStudents);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const ACTIONS = [
    {
      id: "courses",
      title: "My Courses",
      subtitle: "View & manage course units",
      icon: "book",
      route: "/(lecturer)/courses",
      gradient: ["#0D7377", "#14919B"] as [string, string],
      stat: courseCount.toString(),
      statLabel: "courses assigned",
      tag: "Courses",
    },
    {
      id: "questions",
      title: "Questions",
      subtitle: "Create & manage MCQ questions",
      icon: "help-circle",
      route: "/(lecturer)/questions",
      gradient: ["#1A56DB", "#0D3492"] as [string, string],
      stat: questionCount.toString(),
      statLabel: "questions added",
      tag: "Question Bank",
    },
    {
      id: "grading",
      title: "Grade Students",
      subtitle: "Scan answer sheets & auto-mark",
      icon: "scan",
      route: "/(lecturer)/grading",
      gradient: ["#0EA5E9", "#0369A1"] as [string, string],
      stat: gradedCount.toString(),
      statLabel: "students graded",
      tag: "Auto Marking",
    },
    {
      id: "students",
      title: "My Students",
      subtitle: "View student results & progress",
      icon: "people",
      route: "/(lecturer)/students",
      gradient: ["#DC2626", "#B91C1C"] as [string, string],
      stat: studentCount.toString(),
      statLabel: "students enrolled",
      tag: "Student Progress",
    },
  ];

  return (
    <View style={styles.root}>
      {/* ── Gradient header ── */}
      <LinearGradient
        colors={["#062B6E", "#1044B2", "#1A56DB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
      >
        {/* Decorative shapes */}
        <View style={styles.shapeLarge} />
        <View style={styles.shapeSmall} />
        <View style={styles.shapeMini} />

        {/* Top row */}
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push({ pathname: "/(lecturer)/profile" })}
          >
            <Text style={styles.avatarText}>
              {getInitials(user?.full_name ?? "LT")}
            </Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerLabel}>Signed in as</Text>
            <Text style={styles.headerName} numberOfLines={1}>
              {user?.full_name ?? "Lecturer"}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push({ pathname: "/(lecturer)/profile" })}
            >
              <Ionicons name="person-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingLine}>Good day 👋</Text>
          <Text style={styles.greetingBig}>{user?.full_name ?? "Lecturer"}</Text>
          <View style={styles.rolePill}>
            <View style={styles.roleDot} />
            <Text style={styles.rolePillText}>Lecturer · Active</Text>
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{questionCount}</Text>
            <Text style={styles.statLbl}>Questions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{gradedCount}</Text>
            <Text style={styles.statLbl}>Graded</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{courseCount}</Text>
            <Text style={styles.statLbl}>Courses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{pendingCount}</Text>
            <Text style={styles.statLbl}>Pending</Text>
          </View>
        </View>
      </LinearGradient>

      {/* ── Body ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
      >
        {/* ── Main action cards ── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionSub}>What do you want to do?</Text>
        </View>

        {ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            onPress={() => router.push({ pathname: action.route as any })}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={action.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              {/* Decoration */}
              <View style={styles.actionDecorBig} />
              <View style={styles.actionDecorSmall} />

              {/* Left content */}
              <View style={styles.actionLeft}>
                {/* Tag */}
                <View style={styles.actionTag}>
                  <Text style={styles.actionTagText}>{action.tag}</Text>
                </View>

                {/* Title */}
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>

                {/* Stat */}
                <View style={styles.actionStatRow}>
                  <Text style={styles.actionStat}>{action.stat}</Text>
                  <Text style={styles.actionStatLabel}>
                    {" "}
                    {action.statLabel}
                  </Text>
                </View>
              </View>

              {/* Right — icon + arrow */}
              <View style={styles.actionRight}>
                <View style={styles.actionIconBig}>
                  <Ionicons
                    name={action.icon as any}
                    size={36}
                    color="rgba(255,255,255,0.9)"
                  />
                </View>
                <View style={styles.actionArrow}>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={Colors.white}
                  />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        {/* ── Quick tools row ── */}
        <View style={styles.toolsCard}>
          <TouchableOpacity
            style={styles.toolItem}
            onPress={() =>
              router.push({ pathname: "/(lecturer)/questions/create" as any })
            }
          >
            <LinearGradient
              colors={[Colors.primaryLight, "#D1E3FF"]}
              style={styles.toolIcon}
            >
              <Ionicons name="add" size={22} color={Colors.primary} />
            </LinearGradient>
            <Text style={styles.toolLabel}>New{"\n"}Question</Text>
          </TouchableOpacity>

          <View style={styles.toolDivider} />

          <TouchableOpacity
            style={styles.toolItem}
            onPress={() =>
              router.push({ pathname: "/(lecturer)/grading" as any })
            }
          >
            <LinearGradient
              colors={[Colors.accentLight, "#BAE8FF"]}
              style={styles.toolIcon}
            >
              <Ionicons name="scan-outline" size={22} color={Colors.accent} />
            </LinearGradient>
            <Text style={styles.toolLabel}>Scan{"\n"}Sheet</Text>
          </TouchableOpacity>

          <View style={styles.toolDivider} />

          <TouchableOpacity
            style={styles.toolItem}
            onPress={() =>
              router.push({ pathname: "/(lecturer)/questions" as any })
            }
          >
            <LinearGradient
              colors={[Colors.successLight, "#A7F3D0"]}
              style={styles.toolIcon}
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color={Colors.success}
              />
            </LinearGradient>
            <Text style={styles.toolLabel}>Answer{"\n"}Sheet</Text>
          </TouchableOpacity>

          <View style={styles.toolDivider} />

          <TouchableOpacity
            style={styles.toolItem}
            onPress={() =>
              router.push({ pathname: "/(lecturer)/profile" as any })
            }
          >
            <LinearGradient
              colors={["#EDE9FE", "#DDD6FE"]}
              style={styles.toolIcon}
            >
              <Ionicons
                name="person-outline"
                size={22}
                color={Colors.cardPurple}
              />
            </LinearGradient>
            <Text style={styles.toolLabel}>My{"\n"}Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Info bar ── */}
        <View style={styles.infoBar}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={Colors.primary}
          />
          <Text style={styles.infoBarText}>
            AutoGrader v1.0.0 · Gulu University © 2025
          </Text>
        </View>
      </ScrollView>
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
  shapeLarge: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -80,
    right: -60,
  },
  shapeSmall: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: -20,
    left: -40,
  },
  shapeMini: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: 60,
    right: 80,
  },

  // Top row
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  headerCenter: {
    flex: 1,
  },
  headerLabel: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.6)",
  },
  headerName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Greeting
  greetingSection: {
    marginBottom: Spacing.lg,
  },
  greetingLine: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  greetingBig: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: 6,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  rolePillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNum: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  statLbl: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.65)",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  // ── Body ──
  body: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  sectionSub: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },

  // ── Action cards ──
  actionCard: {
    borderRadius: Radius.xl,
    overflow: "hidden",
    marginBottom: Spacing.md,
    ...Shadows.lg,
  },
  actionGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    minHeight: 140,
    overflow: "hidden",
  },
  actionDecorBig: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -60,
    right: -40,
  },
  actionDecorSmall: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: -20,
    left: 80,
  },
  actionLeft: {
    flex: 1,
  },
  actionTag: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginBottom: Spacing.sm,
  },
  actionTagText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  actionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.75)",
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  actionStatRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  actionStat: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
  },
  actionStatLabel: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.7)",
  },
  actionRight: {
    alignItems: "center",
    gap: Spacing.md,
    marginLeft: Spacing.md,
  },
  actionIconBig: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
  },
  actionArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Tools card ──
  toolsCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    ...Shadows.sm,
  },
  toolItem: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs,
  },
  toolIcon: {
    width: 50,
    height: 50,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  toolLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  toolDivider: {
    width: 1,
    height: 50,
    backgroundColor: Colors.border,
  },

  // ── Info bar ──
  infoBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  infoBarText: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },
});
