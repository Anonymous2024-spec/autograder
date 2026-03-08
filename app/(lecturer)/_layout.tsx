import { Stack } from 'expo-router';

export default function LecturerLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="dashboard" options={{ title: 'Lecturer Dashboard' }} />
      <Stack.Screen name="questions/index" options={{ title: 'Questions' }} />
      <Stack.Screen name="questions/create" options={{ title: 'Add Question' }} />
      <Stack.Screen name="grading/index" options={{ title: 'Grade Student' }} />
      <Stack.Screen name="grading/result" options={{ title: 'Grade Report' }} />
    </Stack>
  );
}