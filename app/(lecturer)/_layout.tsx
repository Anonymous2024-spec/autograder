import { Stack } from "expo-router";

export default function LecturerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />

      {/* questions/index.tsx → name is "questions" not "questions/index" */}
      <Stack.Screen
        name="questions"
        options={{ headerShown: true, title: "Questions" }}
      />
      <Stack.Screen
        name="questions/create"
        options={{ headerShown: true, title: "Add Question" }}
      />
      <Stack.Screen
        name="questions/edit"
        options={{ headerShown: true, title: "Edit Question" }}
      />

      {/* grading/index.tsx → name is "grading" not "grading/index" */}
      <Stack.Screen
        name="grading"
        options={{ headerShown: true, title: "Grade Student" }}
      />
      <Stack.Screen
        name="grading/scan"
        options={{ headerShown: true, title: "Scan Answer Sheet" }}
      />
      <Stack.Screen
        name="grading/result"
        options={{ headerShown: true, title: "Grade Report" }}
      />
      <Stack.Screen
        name="questions/sheet"
        options={{ headerShown: true, title: "Answer Sheet" }}
      />
    </Stack>
  );
}
