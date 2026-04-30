import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />

      {/* students */}
      <Stack.Screen
        name="students"
        options={{ headerShown: true, title: "Students" }}
      />
      <Stack.Screen name="students/register" options={{ headerShown: false }} />
      <Stack.Screen name="students/edit" options={{ headerShown: false }} />
      <Stack.Screen name="students/enroll" options={{ headerShown: false }} />
      <Stack.Screen name="students/detail" options={{ headerShown: false }} />

      {/* staff/index.tsx → name is "staff" */}
      <Stack.Screen
        name="staff"
        options={{ headerShown: true, title: "Staff" }}
      />
      <Stack.Screen name="staff/register" options={{ headerShown: false }} />
      <Stack.Screen name="staff/edit" options={{ headerShown: false }} />

      {/* courses/index.tsx → name is "courses" */}
      <Stack.Screen
        name="courses"
        options={{ headerShown: true, title: "Courses" }}
      />
      <Stack.Screen name="courses/register" options={{ headerShown: false }} />
      <Stack.Screen name="courses/edit" options={{ headerShown: false }} />

       {/* course units */}
       <Stack.Screen name="courses/units" options={{ headerShown: false }} />
       <Stack.Screen
         name="courses/units/create"
         options={{ headerShown: false }}
       />
       <Stack.Screen
         name="courses/units/edit"
         options={{ headerShown: false }}
       />

       {/* units standalone */}
       <Stack.Screen
         name="units"
         options={{ headerShown: true, title: "Course Units" }}
       />
       <Stack.Screen name="units/create" options={{ headerShown: false }} />
       <Stack.Screen name="units/edit" options={{ headerShown: false }} />

       <Stack.Screen
         name="questions"
         options={{ headerShown: true, title: "Questions" }}
       />
       <Stack.Screen name="questions/create" options={{ headerShown: false }} />
    </Stack>
  );
}
