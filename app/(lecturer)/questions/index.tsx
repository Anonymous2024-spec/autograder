import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function QuestionsScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Questions List</Text>

      <TouchableOpacity onPress={() => router.push({ pathname: '/questions/create' })}>
        <Text>+ Add Question</Text>
      </TouchableOpacity>
    </View>
  );
}