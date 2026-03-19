import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="students/index" options={{ headerShown: true, title: "Students" }} />
      <Stack.Screen name="students/register" options={{ headerShown: true, title: "Register Student" }} />
      <Stack.Screen name="students/edit" options={{ headerShown: true, title: "Edit Student" }} />
      <Stack.Screen name="staff/index" options={{ headerShown: true, title: "Staff" }} />
      <Stack.Screen name="staff/register" options={{ headerShown: true, title: "Register Staff" }} />
      <Stack.Screen name="staff/edit" options={{ headerShown: true, title: "Edit Staff" }} />
      <Stack.Screen name="courses/index" options={{ headerShown: true, title: "Courses" }} />
      <Stack.Screen name="courses/register" options={{ headerShown: true, title: "Register Course" }} />
      <Stack.Screen name="courses/edit" options={{ headerShown: true, title: "Edit Course" }} />
      <Stack.Screen name="profile" options={{ headerShown: true, title: "Profile" }} />
    </Stack>
  );
}