import { useRouter } from "expo-router";
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

export default function RegisterCourse() {
  const router = useRouter();

  // State to store form values
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  // Handle form submission
  // TODO: Replace with real API call later
  const handleSubmit = () => {
    // Basic validation
    if (!name || !code) {
      alert("Please fill in all fields");
      return;
    }

    // TODO: Send data to API
    console.log({ name, code });

    // Go back to courses list
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
            <Text style={styles.title}>Course Details</Text>
            <Text style={styles.subtitle}>
              Fill in the form to register a new course
            </Text>
          </View>

          {/* Form fields */}
          <View style={styles.form}>
            {/* Course name input */}
            <Input
              label="Course Name"
              placeholder="e.g. Bachelor of Computer Science"
              value={name}
              onChangeText={setName}
            />

            {/* Course code input */}
            <Input
              label="Course Code"
              placeholder="e.g. BCS"
              value={code}
              onChangeText={setCode}
            />

            {/* Submit button */}
            <Button title="Register Course" onPress={handleSubmit} />
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
    fontWeight: "bold",
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
});
