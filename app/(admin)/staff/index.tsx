import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function StaffScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Staff List</Text>

      <TouchableOpacity onPress={() => router.push({ pathname: '/staff/register' })}>
        <Text>+ Add Staff</Text>
      </TouchableOpacity>
    </View>
  );
}