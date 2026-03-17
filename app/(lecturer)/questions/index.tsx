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

export default function QuestionsScreen() {
  const router = useRouter();

  // Temporary mock data for now
  // TODO: Replace with real API call later
  const questions = [
    { id: 1, question: 'What is the full meaning of CPU?', course_unit_id: 1 },
    { id: 2, question: 'Which data structure uses FIFO order?', course_unit_id: 1 },
    { id: 3, question: 'What does RAM stand for?', course_unit_id: 2 },
  ];

  // Handle three dot menu options
  const handleOptions = (question: { id: number; question: string }) => {
    Alert.alert(
      'Question Options',
      'What would you like to do?',
      [
        // Edit option
        {
          text: 'Edit',
          onPress: () => router.push({
            pathname: '/questions/edit',
            params: { id: question.id }
          }),
        },
        // Delete option
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDelete(question.id),
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
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          // TODO: Replace with real API delete call later
          onPress: () => console.log('Delete question with id:', id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* List of questions */}
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}

        // Show this when list is empty
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="help-circle-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>No questions yet</Text>
          </View>
        }

        // How each question card looks
        renderItem={({ item, index }) => (
          <View style={styles.card}>

            {/* Question number circle */}
            <View style={styles.numberBox}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>

            {/* Question text */}
            <Text style={styles.question} numberOfLines={2}>
              {item.question}
            </Text>

            {/* Three dot menu button */}
            <TouchableOpacity
              onPress={() => handleOptions(item)}
              style={styles.menuButton}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={Colors.subtext} />
            </TouchableOpacity>

          </View>
        )}
      />

      {/* Floating add button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push({ pathname: '/questions/create' })}
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

  // Each question card
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 2,
  },

  // Question number circle
  numberBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  // Question number text
  numberText: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    color: Colors.primary,
  },

  // Question text
  question: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 22,
  },

  // Three dot menu button
  menuButton: {
    padding: Spacing.xs,
  },

  // Empty state container
  emptyContainer: {
    alignItems: 'center',
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
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 5,
  },
});