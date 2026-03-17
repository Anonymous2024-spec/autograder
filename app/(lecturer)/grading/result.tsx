import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing, Radius } from '../../../constants';
import { useState } from 'react';

export default function GradeResult() {
  const router = useRouter();

  // Get the courseId and studentId passed from grading screen
  const { courseId, studentId } = useLocalSearchParams();

  // Track if grading has been submitted
  const [submitted, setSubmitted] = useState(false);

  // Track the final score
  const [score, setScore] = useState(0);

  // Temporary mock questions for now
  // TODO: Replace with real API call using courseId
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: 'What is the full meaning of CPU?',
      selectedOption: null as number | null,
      options: [
        { id: 1, text: 'Central Processing Unit', is_correct: true },
        { id: 2, text: 'Computer Personal Unit', is_correct: false },
        { id: 3, text: 'Central Program Utility', is_correct: false },
        { id: 4, text: 'Core Processing Unit', is_correct: false },
      ],
    },
    {
      id: 2,
      question: 'Which data structure uses FIFO order?',
      selectedOption: null as number | null,
      options: [
        { id: 5, text: 'Stack', is_correct: false },
        { id: 6, text: 'Queue', is_correct: true },
        { id: 7, text: 'Tree', is_correct: false },
        { id: 8, text: 'Graph', is_correct: false },
      ],
    },
  ]);

  // Labels for options
  const labels = ['A', 'B', 'C', 'D'];

  // Select an option for a question
  const selectOption = (questionId: number, optionId: number) => {
    // Prevent changing answers after submission
    if (submitted) return;

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, selectedOption: optionId } : q
      )
    );
  };

  // Calculate score and submit
  const handleSubmit = () => {
    // Check all questions are answered
    const unanswered = questions.filter((q) => q.selectedOption === null);
    if (unanswered.length > 0) {
      alert(`You have ${unanswered.length} unanswered question(s)`);
      return;
    }

    // Calculate score
    const correct = questions.filter((q) => {
      const selected = q.options.find((o) => o.id === q.selectedOption);
      return selected?.is_correct;
    }).length;

    // Save score and mark as submitted
    setScore(correct);
    setSubmitted(true);

    // TODO: Save marks to API
    console.log('Save marks:', { courseId, studentId, score: correct });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Show score card after submission */}
        {submitted && (
          <View style={styles.scoreCard}>
            <Ionicons name="trophy-outline" size={36} color={Colors.primary} />
            <Text style={styles.scoreLabel}>Final Score</Text>
            <Text style={styles.scoreValue}>{score} / {questions.length}</Text>
            <Text style={styles.scorePercent}>
              {Math.round((score / questions.length) * 100)}%
            </Text>
          </View>
        )}

        {/* Questions list */}
        {questions.map((q, qIndex) => (
          <View key={q.id} style={styles.questionCard}>

            {/* Question text */}
            <Text style={styles.questionText}>
              {qIndex + 1}. {q.question}
            </Text>

            {/* Options */}
            {q.options.map((opt, oIndex) => {

              // Determine option style based on state
              const isSelected = q.selectedOption === opt.id;
              const isCorrect = opt.is_correct;

              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.option,
                    // Highlight selected option
                    isSelected && styles.optionSelected,
                    // Show correct answer after submission
                    submitted && isCorrect && styles.optionCorrect,
                    // Show wrong answer after submission
                    submitted && isSelected && !isCorrect && styles.optionWrong,
                  ]}
                  onPress={() => selectOption(q.id, opt.id)}
                >

                  {/* Option label A, B, C, D */}
                  <View style={styles.optionLabelBox}>
                    <Text style={styles.optionLabel}>{labels[oIndex]}</Text>
                  </View>

                  {/* Option text */}
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                    submitted && isCorrect && styles.optionTextCorrect,
                    submitted && isSelected && !isCorrect && styles.optionTextWrong,
                  ]}>
                    {opt.text}
                  </Text>

                </TouchableOpacity>
              );
            })}

          </View>
        ))}

        {/* Submit or Done button */}
        {!submitted ? (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit & Calculate Score</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.success }]}
            onPress={() => router.replace({ pathname: '/grading' })}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        )}

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

  // Score card shown after submission
  scoreCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 3,
  },

  // Score label text
  scoreLabel: {
    fontSize: FontSize.md,
    color: Colors.subtext,
    marginTop: Spacing.sm,
  },

  // Score value e.g 8/10
  scoreValue: {
    fontSize: FontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: Spacing.xs,
  },

  // Score percentage
  scorePercent: {
    fontSize: FontSize.xl,
    color: Colors.subtext,
    marginTop: Spacing.xs,
  },

  // Each question card
  questionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 2,
  },

  // Question text
  questionText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },

  // Each option row
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.background,
  },

  // Selected option
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },

  // Correct option after submission
  optionCorrect: {
    borderColor: Colors.success,
    backgroundColor: '#ECFDF5',
  },

  // Wrong option after submission
  optionWrong: {
    borderColor: Colors.error,
    backgroundColor: '#FEF2F2',
  },

  // Option label box A, B, C, D
  optionLabelBox: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },

  // Option label text
  optionLabel: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    color: Colors.subtext,
  },

  // Option text
  optionText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    flex: 1,
  },

  // Selected option text
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },

  // Correct option text
  optionTextCorrect: {
    color: Colors.success,
    fontWeight: '600',
  },

  // Wrong option text
  optionTextWrong: {
    color: Colors.error,
  },

  // Submit/Done button
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
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
