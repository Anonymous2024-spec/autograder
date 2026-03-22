import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../components/Card";
import { Colors, FontSize, Spacing } from "../../constants";

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    // SafeAreaView prevents content from hiding behind notch/status bar
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing.xl }}
      >
        {/* Header section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.role}>Administrator</Text>
          </View>

          {/* Header right icons */}
          <View style={styles.headerIcons}>
            {/* Profile icon */}
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push({ pathname: "/(admin)/profile" })}
            >
              <Ionicons
                name="person-circle-outline"
                size={28}
                color={Colors.white}
              />
            </TouchableOpacity>

            {/* Logout icon */}
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => {
                Alert.alert("Logout", "Are you sure you want to logout?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Logout",
                    style: "destructive",
                    // TODO: Clear auth token and redirect to login
                    onPress: async () => {
                      await logout();
                    },
                  },
                ]);
              }}
            >
              <Ionicons name="log-out-outline" size={28} color={Colors.white} />
            </TouchableOpacity>
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
    // Add horizontal padding to match card margins
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  // Header icons container
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  // Each icon button
  iconBtn: {
    padding: Spacing.xs,
  },
});
