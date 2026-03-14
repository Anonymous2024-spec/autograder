import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Card from "../../components/Card";
import { Colors, FontSize, Spacing } from "../../constants";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    // SafeAreaView prevents content from hiding behind notch/status bar
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.role}>Administrator</Text>
          </View>

          {/* Avatar circle with initial */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
        </View>

        {/* Section title */}
        <Text style={styles.sectionTitle}>Manage</Text>

        {/* Dashboard cards */}
        <Card
          title="Students"
          description="Register and manage students"
          icon={
            <Ionicons name="people-outline" size={24} color={Colors.primary} />
          }
          onPress={() => router.push({ pathname: "/students" })}
        />

        <Card
          title="Staff / Users"
          description="Register and manage staff"
          icon={
            <Ionicons
              name="person-add-outline"
              size={24}
              color={Colors.primary}
            />
          }
          onPress={() => router.push({ pathname: "/staff" })}
        />

        <Card
          title="Courses"
          description="Register and manage courses"
          icon={
            <Ionicons name="book-outline" size={24} color={Colors.primary} />
          }
          onPress={() => router.push({ pathname: "/courses" })}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Main container background
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header row - name and avatar side by side
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.primary,
  },

  // Welcome text
  greeting: {
    fontSize: FontSize.lg,
    color: Colors.white,
    fontWeight: "600",
  },

  // Role text below greeting
  role: {
    fontSize: FontSize.sm,
    color: Colors.primaryLight,
    marginTop: Spacing.xs,
  },

  // Avatar circle
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  // Initial letter inside avatar
  avatarText: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.primary,
  },

  // Section title above cards
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.text,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
});
