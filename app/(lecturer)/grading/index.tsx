import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function GradingScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Select Course & Student</Text>

      <TouchableOpacity onPress={() => router.push({ pathname: '/grading/result' })}>
        <Text>Start Grading</Text>
      </TouchableOpacity>
    </View>
  );
}