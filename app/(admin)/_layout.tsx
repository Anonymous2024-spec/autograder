import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="dashboard" options={{ title: "Admin Dashboard" }} />
      <Stack.Screen name="students/index" options={{ title: "Students" }} />
      <Stack.Screen
        name="students/register"
        options={{ title: "Register Student" }}
      />
      <Stack.Screen name="staff/index" options={{ title: "Staff" }} />
      <Stack.Screen
        name="staff/register"
        options={{ title: "Register Staff" }}
      />
      <Stack.Screen name="courses/index" options={{ title: "Courses" }} />
      <Stack.Screen
        name="courses/register"
        options={{ title: "Register Course" }}
      />
    </Stack>
  );
}
