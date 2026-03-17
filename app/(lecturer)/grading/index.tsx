import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing, Radius } from '../../../constants';
import { useState } from 'react';

export default function GradingScreen() {
  const router = useRouter();

  // Temporary mock data for now
  // TODO: Replace with real API call later
  const courses = [
    { id: 1, name: 'Bachelor of Information Technology', code: 'BICT' },
    { id: 2, name: 'Bachelor of Computer Science', code: 'BCS' },
  ];

  const students = [
    { id: 1, name: 'John Doe', reg_no: '23/U/1234' },
    { id: 2, name: 'Jane Smith', reg_no: '23/U/5678' },
    { id: 3, name: 'Peter Okello', reg_no: '23/U/9101' },
  ];

  // State to track selected course and student
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  // Handle start grading button
  const handleStartGrading = () => {
    // Validate selection
    if (!selectedCourse || !selectedStudent) {
      alert('Please select both a course and a student');
      return;
    }

    // Navigate to result screen with selected course and student
    router.push({
      pathname: '/grading/result',
      params: {
        courseId: selectedCourse,
        studentId: selectedStudent,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Course selection section */}
        <Text style={styles.sectionTitle}>Select Course</Text>
        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={[
              styles.selectCard,
              // Highlight selected course
              selectedCourse === course.id && styles.selectCardActive,
            ]}
            onPress={() => setSelectedCourse(course.id)}
          >

            {/* Course icon */}
            <Ionicons
              name="book-outline"
              size={22}
              color={selectedCourse === course.id ? Colors.white : Colors.primary}
            />

            {/* Course details */}
            <View style={styles.selectInfo}>
              <Text style={[
                styles.selectName,
                selectedCourse === course.id && styles.selectNameActive,
              ]}>
                {course.name}
              </Text>
              <Text style={[
                styles.selectCode,
                selectedCourse === course.id && styles.selectCodeActive,
              ]}>
                {course.code}
              </Text>
            </View>

            {/* Checkmark when selected */}
            {selectedCourse === course.id && (
              <Ionicons name="checkmark-circle" size={22} color={Colors.white} />
            )}

          </TouchableOpacity>
        ))}

        {/* Student selection section */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>
          Select Student
        </Text>
        {students.map((student) => (
          <TouchableOpacity
            key={student.id}
            style={[
              styles.selectCard,
              // Highlight selected student
              selectedStudent === student.id && styles.selectCardActive,
            ]}
            onPress={() => setSelectedStudent(student.id)}
          >

            {/* Student icon */}
            <Ionicons
              name="person-outline"
              size={22}
              color={selectedStudent === student.id ? Colors.white : Colors.primary}
            />

            {/* Student details */}
            <View style={styles.selectInfo}>
              <Text style={[
                styles.selectName,
                selectedStudent === student.id && styles.selectNameActive,
              ]}>
                {student.name}
              </Text>
              <Text style={[
                styles.selectCode,
                selectedStudent === student.id && styles.selectCodeActive,
              ]}>
                {student.reg_no}
              </Text>
            </View>

            {/* Checkmark when selected */}
            {selectedStudent === student.id && (
              <Ionicons name="checkmark-circle" size={22} color={Colors.white} />
            )}

          </TouchableOpacity>
        ))}

        {/* Start grading button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleStartGrading}
        >
          <Text style={styles.buttonText}>Start Grading</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.white} />
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

  // Section title
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },

  // Each selectable card
  selectCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 2,
  },

  // Active selected card
  selectCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Info container
  selectInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },

  // Card name text
  selectName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },

  // Active card name text
  selectNameActive: {
    color: Colors.white,
  },

  // Card code text
  selectCode: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginTop: Spacing.xs,
  },

  // Active card code text
  selectCodeActive: {
    color: 'rgba(255,255,255,0.75)',
  },

  // Start grading button
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.sm,
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 5,
  },

  // Button text
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.white,
  },
});
