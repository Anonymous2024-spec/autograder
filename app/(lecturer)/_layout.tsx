import { Stack } from "expo-router";

export default function LecturerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />

      {/* courses */}
      <Stack.Screen name="courses" options={{ headerShown: false }} />
      <Stack.Screen name="courses/units" options={{ headerShown: false }} />
      <Stack.Screen
        name="courses/units/create"
        options={{ headerShown: false }}
      />

      {/* questions/index.tsx → name is "questions" not "questions/index" */}
      <Stack.Screen name="questions" options={{ headerShown: false }} />
      <Stack.Screen name="questions/create" options={{ headerShown: false }} />

      <Stack.Screen name="questions/edit" options={{ headerShown: false }} />

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
