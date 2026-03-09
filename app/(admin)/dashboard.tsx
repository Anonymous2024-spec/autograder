import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <View>
      <Text>Admin Dashboard</Text>

      <TouchableOpacity onPress={() => router.push({ pathname: "/students" })}>
        <Text>Students</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push({ pathname: "/staff" })}>
        <Text>Staff</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push({ pathname: "/courses" })}>
        <Text>Courses</Text>
      </TouchableOpacity>
    </View>
  );
}
