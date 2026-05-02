import { Stack } from "expo-router";

export default function LecturerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />

      {/* courses */}
      <Stack.Screen name="courses/index" options={{ headerShown: false }} />
      <Stack.Screen name="courses/units" options={{ headerShown: false }} />
      <Stack.Screen
        name="courses/units/create"
        options={{ headerShown: false }}
      />

      {/* questions */}
      <Stack.Screen name="questions/index" options={{ headerShown: false }} />
      <Stack.Screen name="questions/create" options={{ headerShown: false }} />
      <Stack.Screen name="questions/edit" options={{ headerShown: false }} />
      <Stack.Screen name="questions/sheet" options={{ headerShown: false }} />

      {/* grading */}
      <Stack.Screen
        name="grading/index"
        options={{ headerShown: false, title: "Grade Student" }}
      />
      <Stack.Screen
        name="grading/scan"
        options={{ headerShown: false, title: "Scan Answer Sheet" }}
      />
      <Stack.Screen
        name="grading/result"
        options={{ headerShown: false, title: "Grade Report" }}
      />

      {/* students */}
      <Stack.Screen name="students/index" options={{ headerShown: false }} />
      <Stack.Screen name="students/detail" options={{ headerShown: false }} />
    </Stack>
  );
}
