import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function CoursesScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Courses List</Text>

      <TouchableOpacity onPress={() => router.push({ pathname: '/courses/register' })}>
        <Text>+ Add Course</Text>
      </TouchableOpacity>
    </View>
  );
}