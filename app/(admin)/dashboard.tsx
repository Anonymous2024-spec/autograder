import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <View>
      <Text>Admin Dashboard</Text>

      <TouchableOpacity onPress={() => router.push("/students/index")}>
        <Text>Students</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/staff/index")}>
        <Text>Staff</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/courses/index")}>
        <Text>Courses</Text>
      </TouchableOpacity>
    </View>
  );
}
