import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Card from "../../components/Card";
import { Colors, FontSize, Spacing } from "../../constants";

export default function LecturerDashboard() {
  const router = useRouter();

  return (
    // SafeAreaView prevents content from hiding behind notch/status bar
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.role}>Lecturer</Text>
          </View>

          {/* Avatar circle with initial */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>L</Text>
          </View>
        </View>

        {/* Section title */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {/* Dashboard cards */}
        <Card
          title="Questions"
          description="Enter MCQ questions and options"
          icon={
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={Colors.primary}
            />
          }
          onPress={() => router.push({ pathname: "/questions" })}
        />

        <Card
          title="Grade Students"
          description="Evaluate and record student marks"
          icon={
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={Colors.primary}
            />
          }
          onPress={() => router.push({ pathname: "/grading" })}
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
