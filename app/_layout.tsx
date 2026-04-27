import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Colors } from "../constants";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)" || segments[0] === "login";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      if (user.role === "admin") {
        router.replace("/(admin)/dashboard");
      } else if (user.role === "lecturer") {
        router.replace("/(lecturer)/dashboard");
      } else if (user.role === "student") {
        router.replace("/(lecturer)/dashboard");
      } else {
        router.replace("/(lecturer)/dashboard");
      }
    }
  }, [user, loading]);

  if (loading) return null;

  return (
    <>
      {/* Light content = white icons/text in status bar
          Works on both the blue header screens and dark screens */}
      <StatusBar style="light" backgroundColor={Colors.primary} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(lecturer)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}