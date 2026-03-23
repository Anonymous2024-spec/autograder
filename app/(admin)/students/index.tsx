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

export default function StudentsScreen() {
  const router = useRouter();
  
  // TODO: Replace with real API call later
  const students = [
    {
      id: 1,
      name: "John Doe",
      reg_no: "23/U/1234",
      no: "2300712345",
      course: "BICT",
    },
    {
      id: 2,
      name: "Jane Smith",
      reg_no: "23/U/5678",
      no: "2300756789",
      course: "BCS",
    },
    {
      id: 3,
      name: "Peter Okello",
      reg_no: "23/U/9101",
      no: "2300791011",
      course: "BSE",
    },
  ];

  // Handle three dot menu options
  const handleOptions = (student: { id: number; name: string }) => {
    Alert.alert(student.name, "What would you like to do?", [
      {
        text: "Edit",
        onPress: () =>
          router.push({
            pathname: "/students/edit",
            params: { id: student.id },
          }),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDelete(student.id),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const confirmDelete = (id: number) => {
    Alert.alert(
      "Delete Student",
      "Are you sure you want to delete this student?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          // TODO: Replace with real API delete call later
          onPress: () => console.log("Delete student with id:", id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="people-outline"
              size={48}
              color={Colors.border}
            />
            <Text style={styles.emptyText}>No students found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>

            {/* Avatar with first letter of name */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>

            {/* Student details */}
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>

              {/* Reg no and student no on same row */}
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{item.reg_no}</Text>
                <View style={styles.dot} />
                <Text style={styles.meta}>{item.no}</Text>
              </View>

              {/* Course badge */}
              <View style={styles.courseBadge}>
                <Text style={styles.courseBadgeText}>{item.course}</Text>
              </View>
            </View>

            {/* Three dot menu */}
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
        onPress={() => router.push({ pathname: "/students/register" })}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.white,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  // Row for reg no and student no
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  meta: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
  },
  // Separator dot between reg no and student no
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.subtext,
    marginHorizontal: Spacing.xs,
  },
  courseBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  courseBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.primary,
  },
  menuButton: {
    padding: Spacing.xs,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: Spacing.xl * 2,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.subtext,
    marginTop: Spacing.md,
  },
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
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});