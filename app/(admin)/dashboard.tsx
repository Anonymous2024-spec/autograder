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
import { useAuth } from "../../context/AuthContext";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
  Spacing,
} from "../../constants";
import { adminAPI } from "../../services/api";

const { width } = Dimensions.get("window");

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout, token } = useAuth();
  const insets = useSafeAreaInsets();

  // State for dashboard counts
  const [courseCount, setCourseCount] = useState(0);
  const [unitsCount, setUnitsCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [studentCount] = useState(124);
  const [staffCount] = useState(12);

  // Fetch courses count when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchCourseCount();
      }
    }, [token])
  );

  const fetchCourseCount = async () => {
    try {
      const courses = await adminAPI.getAllCourses(token);
      const courseList = Array.isArray(courses) ? courses : [];
      setCourseCount(courseList.length);
      
      // Count all units and questions from all courses
      let totalUnits = 0;
      let totalQuestions = 0;
      for (const course of courseList) {
        try {
          const courseData = await adminAPI.getCourse(course.id, token);
          if (courseData?.units) {
            totalUnits += courseData.units.length;
            for (const unit of courseData.units) {
              if (unit.questions) {
                totalQuestions += unit.questions.length;
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching course ${course.id}:`, error);
        }
      }
      setUnitsCount(totalUnits);
      setQuestionCount(totalQuestions);
    } catch (error) {
      console.error("Error fetching course count:", error);
    }
  };

  const getInitials = (name: string): string => {
    if (!name) return "AU";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Action cards with dynamic counts
  const ACTIONS = [
    {
      id: "students",
      title: "Students",
      description: "Register & manage students",
      icon: "people",
      route: "/(admin)/students",
      gradient: [Colors.cardBlue, Colors.primaryDark] as [string, string],
      count: studentCount.toString(),
      countLabel: "enrolled",
    },
    {
      id: "staff",
      title: "Staff & Users",
      description: "Manage staff accounts",
      icon: "person-add",
      route: "/(admin)/staff",
      gradient: [Colors.cardPurple, "#6D28D9"] as [string, string],
      count: staffCount.toString(),
      countLabel: "active",
    },
    {
      id: "courses",
      title: "Courses",
      description: "Register & manage courses",
      icon: "book",
      route: "/(admin)/courses",
      gradient: [Colors.cardTeal, "#0369A1"] as [string, string],
      count: courseCount.toString(),
      countLabel: "courses",
    },
    {
      id: "units",
      title: "Course Units",
      description: "Manage course units",
      icon: "layers",
      route: "/(admin)/units",
      gradient: ["#7C3AED", "#A855F7"] as [string, string],
      count: unitsCount.toString(),
      countLabel: "units",
    },
    {
      id: "questions",
      title: "Questions",
      description: "View MCQ questions",
      icon: "help-circle",
      route: "/(admin)/questions",
      gradient: [Colors.cardGreen, "#047857"] as [string, string],
      count: questionCount.toString(),
      countLabel: "questions",
    },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => { await logout(); },
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
        {/* Decorative shapes */}
        <View style={styles.headerShapeLarge} />
        <View style={styles.headerShapeSmall} />

        {/* Top row — avatar + icons */}
        <View style={styles.headerTop}>

          {/* Avatar */}
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push({ pathname: "/(admin)/profile" })}
          >
            <Text style={styles.avatarText}>
              {user ? getInitials(user.full_name) : "AU"}
            </Text>
          </TouchableOpacity>

          {/* Right icons */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.push({ pathname: "/(admin)/profile" })}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>

        </View>

        {/* Greeting */}
        <View style={styles.headerGreeting}>
          <Text style={styles.greetingSmall}>Good day 👋</Text>
          <Text style={styles.greetingName}>
            {user ? user.full_name : "Administrator"}
          </Text>
          <View style={styles.roleBadge}>
            <Ionicons
              name="shield-checkmark"
              size={12}
              color={Colors.white}
            />
            <Text style={styles.roleBadgeText}>Administrator</Text>
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{studentCount}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statSeparator} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{staffCount}</Text>
            <Text style={styles.statLabel}>Staff</Text>
          </View>
          <View style={styles.statSeparator} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{courseCount}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statSeparator} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{unitsCount}</Text>
            <Text style={styles.statLabel}>Units</Text>
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

        {/* Section label */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Manage</Text>
          <Text style={styles.sectionSubtitle}>
            Tap a card to get started
          </Text>
        </View>

        {/* 2x2 grid of action cards */}
        <View style={styles.grid}>
          {ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.gridCard}
              onPress={() => router.push({ pathname: action.route as any })}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={action.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gridCardGradient}
              >
                {/* Card decoration */}
                <View style={styles.cardDecorCircle} />

                {/* Icon */}
                <View style={styles.cardIconBox}>
                  <Ionicons
                    name={action.icon as any}
                    size={28}
                    color={Colors.white}
                  />
                </View>

                {/* Count */}
                <Text style={styles.cardCount}>{action.count}</Text>
                <Text style={styles.cardCountLabel}>{action.countLabel}</Text>

                {/* Title */}
                <Text style={styles.cardTitle}>{action.title}</Text>
                <Text style={styles.cardDescription} numberOfLines={1}>
                  {action.description}
                </Text>

                {/* Arrow */}
                <View style={styles.cardArrow}>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color="rgba(255,255,255,0.8)"
                  />
                </View>

              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Quick access strip ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
        </View>

        <View style={styles.quickStrip}>

          <TouchableOpacity
            style={styles.quickItem}
            onPress={() => router.push({ pathname: "/(admin)/students" as any })}
          >
            <View style={[styles.quickIcon, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="person-add-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.quickLabel}>Add Student</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickItem}
            onPress={() => router.push({ pathname: "/(admin)/staff" as any })}
          >
            <View style={[styles.quickIcon, { backgroundColor: "#EDE9FE" }]}>
              <Ionicons name="people-outline" size={20} color={Colors.cardPurple} />
            </View>
            <Text style={styles.quickLabel}>Add Staff</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickItem}
            onPress={() => router.push({ pathname: "/(admin)/courses" as any })}
          >
            <View style={[styles.quickIcon, { backgroundColor: Colors.accentLight }]}>
              <Ionicons name="book-outline" size={20} color={Colors.accent} />
            </View>
            <Text style={styles.quickLabel}>Add Course</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickItem}
            onPress={() => router.push({ pathname: "/(admin)/profile" as any })}
          >
            <View style={[styles.quickIcon, { backgroundColor: Colors.successLight }]}>
              <Ionicons name="settings-outline" size={20} color={Colors.success} />
            </View>
            <Text style={styles.quickLabel}>Settings</Text>
          </TouchableOpacity>

        </View>

        {/* ── App info card ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardLeft}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={Colors.primary}
            />
            <Text style={styles.infoCardText}>
              AutoGrader v1.0.0 · Gulu University
            </Text>
          </View>
          <Text style={styles.infoCardYear}>2025</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const CARD_SIZE = (width - Spacing.lg * 2 - Spacing.md) / 2;

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
  headerShapeLarge: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -80,
    right: -60,
  },
  headerShapeSmall: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: 10,
    left: -30,
  },

  // Top row
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
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
  headerActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Greeting
  headerGreeting: {
    marginBottom: Spacing.lg,
  },
  greetingSmall: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  greetingName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: 4,
  },
  roleBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
    letterSpacing: 0.5,
  },

  // Stats strip
  statsStrip: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.65)",
    marginTop: 2,
  },
  statSeparator: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  // ── Body ──
  body: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
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
  sectionSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },

  // ── 2x2 Grid ──
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  gridCard: {
    width: CARD_SIZE,
    height: CARD_SIZE + 20,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadows.lg,
  },
  gridCardGradient: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  cardDecorCircle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: -30,
    right: -30,
  },
  cardIconBox: {
    position: "absolute",
    top: Spacing.md,
    left: Spacing.md,
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardCount: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
    lineHeight: 36,
  },
  cardCountLabel: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.7)",
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  cardDescription: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.7)",
    marginBottom: Spacing.xs,
  },
  cardArrow: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Quick strip ──
  quickStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  quickItem: {
    alignItems: "center",
    gap: Spacing.xs,
    flex: 1,
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  quickLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    textAlign: "center",
  },

  // ── Info card ──
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  infoCardText: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },
  infoCardYear: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
});
