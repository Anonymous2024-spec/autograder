import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <View>
      <Text>Admin Dashboard</Text>

      <TouchableOpacity onPress={() => router.push("/(admin)/students")}>
        <Text>Students</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(admin)/staff")}>
        <Text>Staff</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(admin)/courses")}>
        <Text>Courses</Text>
      </TouchableOpacity>
    </View>
  );
}
