import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { Colors, FontSize, Radius, Spacing } from "../../../constants";

export default function EditStaff() {
  const router = useRouter();

  // Get staff id passed from list screen
  const { id } = useLocalSearchParams();

  // Pre-filled form values
  // TODO: Replace with real API call to fetch staff by id
  const [username, setUsername] = useState("Dr. Okello");
  const [email, setEmail] = useState("okello@gulu.ac.ug");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lecturer");

  // Handle form submission
  const handleSubmit = () => {
    if (!username || !email) {
      alert("Please fill in all fields");
      return;
    }

    // TODO: Send updated data to API
    console.log("Update staff:", { id, username, email, role });

    // Go back to staff list
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Form title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Edit Staff</Text>
            <Text style={styles.subtitle}>
              Update the staff member details below
            </Text>
          </View>

          {/* Form fields */}
          <View style={styles.form}>
            <Input
              label="Username"
              placeholder="e.g. Dr. Okello"
              value={username}
              onChangeText={setUsername}
            />

            <Input
              label="Email"
              placeholder="e.g. okello@gulu.ac.ug"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Input
              label="New Password"
              placeholder="Leave blank to keep current"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Role selector */}
            <Text style={styles.roleLabel}>Role</Text>
            <View style={styles.roleRow}>
              <TouchableOpacity
                style={[
                  styles.roleBtn,
                  role === "lecturer" && styles.roleBtnActive,
                ]}
                onPress={() => setRole("lecturer")}
              >
                <Text
                  style={[
                    styles.roleBtnText,
                    role === "lecturer" && styles.roleBtnTextActive,
                  ]}
                >
                  Lecturer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleBtn,
                  role === "admin" && styles.roleBtnActive,
                ]}
                onPress={() => setRole("admin")}
              >
                <Text
                  style={[
                    styles.roleBtnText,
                    role === "admin" && styles.roleBtnTextActive,
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>

            <Button title="Update Staff" onPress={handleSubmit} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  titleContainer: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  roleLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  roleRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  roleBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 2,
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  roleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleBtnText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.subtext,
  },
  roleBtnTextActive: {
    color: Colors.white,
  },
});
