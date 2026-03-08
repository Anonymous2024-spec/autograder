import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Login Screen</Text>

      <TouchableOpacity onPress={() => router.replace("/dashboard")}>
        <Text>Go to Admin Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/dashboard")}>
        <Text>Go to Lecturer Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}
