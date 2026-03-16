import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { Colors, FontSize, Radius, Spacing } from "../../../constants";

export default function EditStudent() {
  const router = useRouter();

  // Get the student id passed from the list screen
  const { id } = useLocalSearchParams();

  // Pre-filled form values
  // TODO: Replace with real API call to fetch student by id
  const [name, setName] = useState("John Doe");
  const [regNo, setRegNo] = useState("23/U/1234");
  const [studentNo, setStudentNo] = useState("2300712345");
  const [courseId, setCourseId] = useState("1");

  // Handle form submission
  const handleSubmit = () => {
    if (!name || !regNo || !studentNo || !courseId) {
      alert("Please fill in all fields");
      return;
    }

    // TODO: Send updated data to API
    console.log("Update student:", { id, name, regNo, studentNo, courseId });

    // Go back to students list
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Form title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Edit Student</Text>
            <Text style={styles.subtitle}>
              Update the student details below
            </Text>
          </View>

          {/* Form fields */}
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              value={name}
              onChangeText={setName}
            />

            <Input
              label="Registration Number"
              placeholder="e.g. 23/U/1234"
              value={regNo}
              onChangeText={setRegNo}
            />

            <Input
              label="Student Number"
              placeholder="e.g. 2300712345"
              value={studentNo}
              onChangeText={setStudentNo}
              keyboardType="numeric"
            />

            <Input
              label="Course ID"
              placeholder="e.g. 1"
              value={courseId}
              onChangeText={setCourseId}
              keyboardType="numeric"
            />

            <Button title="Update Student" onPress={handleSubmit} />
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
    fontWeight: "bold",
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
