import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LecturerDashboard() {
  const router = useRouter();

  return (
    <View>
      <Text>Lecturer Dashboard</Text>

      <TouchableOpacity onPress={() => router.push({ pathname: '/questions' })}>
        <Text>Questions</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push({ pathname: '/grading' })}>
        <Text>Grade Students</Text>
      </TouchableOpacity>
    </View>
  );
}