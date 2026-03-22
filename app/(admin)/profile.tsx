import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, Radius, Spacing } from "../../constants";
import { useAuth } from "../../context/AuthContext";

export default function AdminProfile() {
  const { logout } = useAuth();

  // Mock user data for now
  const { user } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          // No navigation needed — auth guard handles redirect
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Profile avatar and name */}
        <View style={styles.profileHeader}>
          {/* Avatar circle */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.username?.[0] || "?"}</Text>
          </View>

          {/* Name and role */}
          <Text style={styles.name}>{user?.username || "User"}</Text>
          <Text style={styles.role}>{user?.role || "No role"}</Text>
        </View>

        {/* Profile details card */}
        <View style={styles.card}>
          {/* Email row */}
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="mail-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Email</Text>
              <Text style={styles.rowValue}>{user?.email || "N/A"}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Role row */}
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="shield-outline"
                size={20}
                color={Colors.primary}
              />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Role</Text>
              <Text style={styles.rowValue}>{user?.role || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Actions card */}
        <View style={styles.card}>
          {/* Change password */}
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.primary}
              />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Change Password</Text>
              <Text style={styles.rowValue}>Update your password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.subtext} />
          </TouchableOpacity>
        </View>

        {/* Logout button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Scrollview content padding
  content: {
    padding: Spacing.lg,
  },

  // Profile header section
  profileHeader: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },

  // Avatar circle
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 4,
  },

  // Avatar initial letter
  avatarText: {
    fontSize: FontSize.xxxl,
    fontWeight: "bold",
    color: Colors.white,
  },

  // Username text
  name: {
    fontSize: FontSize.xl,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },

  // Role text
  role: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
  },

  // Card container
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 3,
  },

  // Each row in card
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },

  // Row icon box
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },

  // Row info container
  rowInfo: {
    flex: 1,
  },

  // Row label text
  rowLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.text,
  },

  // Row value text
  rowValue: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginTop: Spacing.xs,
  },

  // Divider between rows
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },

  // Logout button
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 3,
  },

  // Logout text
  logoutText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.error,
  },
});
