import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing, Radius } from '../../../constants';

export default function StudentsScreen() {
  const router = useRouter();

  // Temporary mock data for now
  // TODO: Replace with real API call later
  const students = [
    { id: 1, name: 'John Doe', reg_no: '23/U/1234', course: 'BICT' },
    { id: 2, name: 'Jane Smith', reg_no: '23/U/5678', course: 'BCS' },
    { id: 3, name: 'Peter Okello', reg_no: '23/U/9101', course: 'BICT' },
  ];

  // Handle three dot menu options
  const handleOptions = (student: { id: number; name: string }) => {
    Alert.alert(
      // Alert title
      student.name,
      // Alert message
      'What would you like to do?',
      [
        // Edit option - navigates to edit screen with student id
        {
          text: 'Edit',
          onPress: () => router.push({
            pathname: '/students/edit',
            params: { id: student.id }
          }),
        },
        // Delete option - shows confirmation first
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDelete(student.id),
        },
        // Cancel option
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  // Confirm before deleting
  const confirmDelete = (id: number) => {
    Alert.alert(
      'Delete Student',
      'Are you sure you want to delete this student?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          // TODO: Replace with real API delete call later
          onPress: () => console.log('Delete student with id:', id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* List of students */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}

        // Show this when list is empty
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>No students found</Text>
          </View>
        }

        // How each student card looks
        renderItem={({ item }) => (
          <View style={styles.card}>

            {/* Avatar circle with first letter of name */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>

            {/* Student details */}
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.regNo}>{item.reg_no} • {item.course}</Text>
            </View>

            {/* Three dot menu button */}
            <TouchableOpacity onPress={() => handleOptions(item)}>
              <Ionicons name="ellipsis-vertical" size={20} color={Colors.subtext} />
            </TouchableOpacity>

          </View>
        )}
      />

      {/* Floating add button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push({ pathname: '/students/register' })}
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

  // Each student card
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

  // Student info container
  info: {
    flex: 1,
  },

  // Student name
  name: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text,
  },

  // Registration number and course
  regNo: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginTop: Spacing.xs,
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
