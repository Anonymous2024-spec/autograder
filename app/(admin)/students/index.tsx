import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function StudentsScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Students List</Text>

      <TouchableOpacity onPress={() => router.push({ pathname: '/students/register' })}>
        <Text>+ Add Student</Text>
      </TouchableOpacity>
    </View>
  );
}