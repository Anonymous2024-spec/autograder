import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, Radius, Spacing } from "../../../constants";

export default function StaffScreen() {
  const router = useRouter();

  // Temporary mock data for now
  // TODO: Replace with real API call later
  const staff = [
    {
      id: 1,
      username: "Dr. Okello",
      email: "okello@gulu.ac.ug",
      role: "lecturer",
    },
    {
      id: 2,
      username: "Dr. Achen",
      email: "achen@gulu.ac.ug",
      role: "lecturer",
    },
    { id: 3, username: "Admin User", email: "admin@gulu.ac.ug", role: "admin" },
  ];

  // Handle three dot menu options
  const handleOptions = (member: { id: number; username: string }) => {
    Alert.alert(member.username, "What would you like to do?", [
      // Edit option
      {
        text: "Edit",
        onPress: () =>
          router.push({
            pathname: "/staff/edit",
            params: { id: member.id },
          }),
      },
      // Delete option
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDelete(member.id),
      },
      // Cancel option
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  // Confirm before deleting
  const confirmDelete = (id: number) => {
    Alert.alert(
      "Delete Staff",
      "Are you sure you want to delete this staff member?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          // TODO: Replace with real API delete call later
          onPress: () => console.log("Delete staff with id:", id),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* List of staff */}
      <FlatList
        data={staff}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        // Show this when list is empty
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="person-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>No staff found</Text>
          </View>
        }
        // How each staff card looks
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Avatar circle with first letter of username */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.username[0]}</Text>
            </View>

            {/* Staff details */}
            <View style={styles.info}>
              <Text style={styles.name}>{item.username}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>

            {/* Role badge */}
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    item.role === "admin" ? "#EDE9FE" : Colors.primaryLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: item.role === "admin" ? "#8B5CF6" : Colors.primary },
                ]}
              >
                {item.role}
              </Text>
            </View>

            {/* Three dot menu button */}
            <TouchableOpacity
              onPress={() => handleOptions(item)}
              style={styles.menuButton}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={20}
                color={Colors.subtext}
              />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Floating add button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push({ pathname: "/staff/register" })}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // List padding
  list: {
    padding: Spacing.lg,
  },

  // Each staff card
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 2,
  },

  // Avatar circle
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },

  // Initial letter inside avatar
  avatarText: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.white,
  },

  // Staff info container
  info: {
    flex: 1,
  },

  // Staff name
  name: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text,
  },

  // Staff email
  email: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginTop: Spacing.xs,
  },

  // Role badge container
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginRight: Spacing.sm,
  },

  // Role badge text
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  // Three dot menu button
  menuButton: {
    padding: Spacing.xs,
  },

  // Empty state container
  emptyContainer: {
    alignItems: "center",
    marginTop: Spacing.xl * 2,
  },

  // Empty state text
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.subtext,
    marginTop: Spacing.md,
  },

  // Floating action button
  fab: {
    position: "absolute",
    bottom: Spacing.xl,
    right: Spacing.lg,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 5,
  },
});
