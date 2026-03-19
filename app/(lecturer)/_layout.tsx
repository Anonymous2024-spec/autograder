import { Stack } from "expo-router";

export default function LecturerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="questions/index" options={{ headerShown: true, title: "Questions" }} />
      <Stack.Screen name="questions/create" options={{ headerShown: true, title: "Add Question" }} />
      <Stack.Screen name="questions/edit" options={{ headerShown: true, title: "Edit Question" }} />
      <Stack.Screen name="grading/index" options={{ headerShown: true, title: "Grade Student" }} />
      <Stack.Screen name="grading/result" options={{ headerShown: true, title: "Grade Report" }} />
      <Stack.Screen name="profile" options={{ headerShown: true, title: "Profile" }} />
    </Stack>
  );
}