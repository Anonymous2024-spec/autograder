import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { Colors, FontSize, Spacing, Radius } from '../../../constants';
import { useState } from 'react';

export default function EditQuestion() {
  const router = useRouter();

  // Get question id passed from list screen
  const { id } = useLocalSearchParams();

  // Pre-filled form values
  // TODO: Replace with real API call to fetch question by id
  const [question, setQuestion] = useState('What is the full meaning of CPU?');
  const [courseUnitId, setCourseUnitId] = useState('1');

  // Pre-filled options
  // TODO: Replace with real API call to fetch options by question id
  const [options, setOptions] = useState([
    { id: 1, text: 'Central Processing Unit', is_correct: true },
    { id: 2, text: 'Computer Personal Unit', is_correct: false },
    { id: 3, text: 'Central Program Utility', is_correct: false },
    { id: 4, text: 'Core Processing Unit', is_correct: false },
  ]);

  // Labels for the four options
  const labels = ['A', 'B', 'C', 'D'];

  // Update the text of a specific option
  const updateOptionText = (index: number, text: string) => {
    const updated = [...options];
    updated[index].text = text;
    setOptions(updated);
  };

  // Mark a specific option as the correct answer
  const markCorrect = (index: number) => {
    const updated = options.map((opt, i) => ({
      ...opt,
      is_correct: i === index,
    }));
    setOptions(updated);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Basic validation
    if (!question || !courseUnitId) {
      alert('Please fill in the question and course unit');
      return;
    }

    // Check all options are filled
    if (options.some((opt) => !opt.text)) {
      alert('Please fill in all options');
      return;
    }

    // Check a correct answer is selected
    if (!options.some((opt) => opt.is_correct)) {
      alert('Please mark the correct answer');
      return;
    }

    // TODO: Send updated data to API
    console.log('Update question:', { id, question, courseUnitId, options });

    // Go back to questions list
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >

          {/* Form title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Edit Question</Text>
            <Text style={styles.subtitle}>Update the question and options below</Text>
          </View>

          <View style={styles.form}>

            {/* Course unit input */}
            <Input
              label="Course Unit ID"
              placeholder="e.g. 1"
              value={courseUnitId}
              onChangeText={setCourseUnitId}
              keyboardType="numeric"
            />

            {/* Question input */}
            <Input
              label="Question"
              placeholder="Enter your MCQ question here..."
              value={question}
              onChangeText={setQuestion}
            />

            {/* Options section */}
            <Text style={styles.optionsLabel}>Answer Options</Text>
            <Text style={styles.optionsHint}>
              Tap the circle to mark the correct answer
            </Text>

            {/* Render each option */}
            {options.map((opt, index) => (
              <View key={opt.id} style={styles.optionRow}>

                {/* Radio button to mark correct answer */}
                <TouchableOpacity
                  style={styles.radio}
                  onPress={() => markCorrect(index)}
                >
                  {opt.is_correct ? (
                    <Ionicons name="radio-button-on" size={24} color={Colors.primary} />
                  ) : (
                    <Ionicons name="radio-button-off" size={24} color={Colors.border} />
                  )}
                </TouchableOpacity>

                {/* Option label A, B, C, D */}
                <View style={styles.optionLabel}>
                  <Text style={styles.optionLetter}>{labels[index]}</Text>
                </View>

                {/* Option text input */}
                <View style={styles.optionInputContainer}>
                  <Input
                    label=""
                    placeholder={`Option ${labels[index]}`}
                    value={opt.text}
                    onChangeText={(text) => updateOptionText(index, text)}
                  />
                </View>

              </View>
            ))}

            {/* Submit button */}
            <Button
              title="Update Question"
              onPress={handleSubmit}
            />

          </View>

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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

  // Title section container
  titleContainer: {
    marginBottom: Spacing.lg,
  },

  // Form title
  title: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },

  // Form subtitle
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
  },

  // Form container
  form: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 3,
  },

  // Options section label
  optionsLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },

  // Options hint text
  optionsHint: {
    fontSize: FontSize.xs,
    color: Colors.subtext,
    marginBottom: Spacing.md,
  },

  // Each option row
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },

  // Radio button
  radio: {
    marginRight: Spacing.sm,
  },

  // Option label box A, B, C, D
  optionLabel: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },

  // Option letter text
  optionLetter: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    color: Colors.primary,
  },

  // Option input container
  optionInputContainer: {
    flex: 1,
  },
});
