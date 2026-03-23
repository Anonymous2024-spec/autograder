import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { Colors, FontSize, Spacing, Radius } from '../../../constants';
import { useState } from 'react';

export default function RegisterCourse() {
  const router = useRouter();

  // State to store form values
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  // Field-level errors
  const [errors, setErrors] = useState({ name: '', code: '' });

  // Validate each field individually
  const validate = () => {
    const newErrors = { name: '', code: '' };
    let valid = true;

    if (!name.trim()) {
      newErrors.name = 'Course name is required';
      valid = false;
    }

    if (!code.trim()) {
      newErrors.code = 'Course code is required';
      valid = false;
    } else if (code.trim().length > 10) {
      newErrors.code = 'Course code must be 10 characters or less';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  // TODO: Replace with real API call later
  const handleSubmit = () => {
    if (!validate()) return;

    // TODO: Send data to API
    console.log({ name: name.trim(), code: code.trim().toUpperCase() });

    // Go back to courses list
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
            <Text style={styles.title}>New Course</Text>
            <Text style={styles.subtitle}>
              Fill in the details to register a new course
            </Text>
          </View>

          {/* Form fields */}
          <View style={styles.form}>

            {/* Course name input */}
            <Input
              label="Course Name"
              placeholder="e.g. Bachelor of Computer Science"
              value={name}
              onChangeText={(text) => {
                setName(text);
                // Clear error as user types
                setErrors((prev) => ({ ...prev, name: '' }));
              }}
              error={errors.name}
            />

            {/* Course code input */}
            <Input
              label="Course Code"
              placeholder="e.g. BCS"
              value={code}
              onChangeText={(text) => {
                // Always store as uppercase
                setCode(text.toUpperCase());
                setErrors((prev) => ({ ...prev, code: '' }));
              }}
              error={errors.code}
            />

            {/* Submit button */}
            <Button
              title="Register Course"
              onPress={handleSubmit}
            />

          </View>

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  titleContainer: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});