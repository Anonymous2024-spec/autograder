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
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing.xl }}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.role}>Administrator</Text>
          </View>

          <View style={styles.headerIcons}>
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

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => {
                Alert.alert("Logout", "Are you sure you want to logout?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => { await logout(); },
                  },
                ]);
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={28}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Section title ── */}
        <Text style={styles.sectionTitle}>Manage</Text>

        {/* ── Dashboard cards ── */}
        <Card
          title="Students"
          description="Register and manage students"
          icon={
            <Ionicons
              name="people-outline"
              size={24}
              color={Colors.primary}
            />
          }
          onPress={() => router.push({ pathname: "/(admin)/students" })}
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
          onPress={() => router.push({ pathname: "/(admin)/staff" })}
        />

        <Card
          title="Courses"
          description="Register and manage courses"
          icon={
            <Ionicons
              name="book-outline"
              size={24}
              color={Colors.primary}
            />
          }
          onPress={() => router.push({ pathname: "/(admin)/courses" })}
        />

        {/* ── Questions section ── */}
        <Text style={styles.sectionTitle}>Academic</Text>

        <Card
          title="Questions"
          description="View and manage MCQ questions per course"
          icon={
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={Colors.primary}
            />
          }
          onPress={() => router.push({ pathname: "/questions" })}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.primary,
  },
  greeting: {
    fontSize: FontSize.lg,
    color: Colors.white,
    fontWeight: "600",
  },
  role: {
    fontSize: FontSize.sm,
    color: Colors.primaryLight,
    marginTop: Spacing.xs,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconBtn: {
    padding: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.text,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
});