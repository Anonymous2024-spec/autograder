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

export default function CoursesScreen() {
  const router = useRouter();

  // Temporary mock data for now
  // TODO: Replace with real API call later
  const courses = [
    { id: 1, name: "Bachelor of Information Technology", code: "BICT" },
    { id: 2, name: "Bachelor of Computer Science", code: "BCS" },
    { id: 3, name: "Bachelor of Software Engineering", code: "BSE" },
  ];

  // Handle three dot menu options
  const handleOptions = (course: { id: number; name: string }) => {
    Alert.alert(course.name, "What would you like to do?", [
      // Edit option
      {
        text: "Edit",
        onPress: () =>
          router.push({
            pathname: "/courses/edit",
            params: { id: course.id },
          }),
      },
      // Delete option
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDelete(course.id),
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
      "Delete Course",
      "Are you sure you want to delete this course?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          // TODO: Replace with real API delete call later
          onPress: () => console.log("Delete course with id:", id),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* List of courses */}
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        // Show this when list is empty
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>No courses found</Text>
          </View>
        }
        // How each course card looks
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Icon box */}
            <View style={styles.iconBox}>
              <Ionicons name="book-outline" size={22} color={Colors.primary} />
            </View>

            {/* Course details */}
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.code}>{item.code}</Text>
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
        onPress={() => router.push({ pathname: "/courses/register" })}
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

  // Each course card
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

  // Icon box
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },

  // Course info container
  info: {
    flex: 1,
  },

  // Course name
  name: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text,
  },

  // Course code
  code: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginTop: Spacing.xs,
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
