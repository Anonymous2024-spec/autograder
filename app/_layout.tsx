import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Separated so it can call useAuth (which needs AuthProvider above it)
function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Wait until SecureStore restore is done
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Not logged in and not on login screen → send to login
      router.replace('/(auth)/login');

    } else if (user && inAuthGroup) {
      // Already logged in but sitting on login screen → send to dashboard
      if (user.role === 'admin') {
        router.replace('/(admin)/dashboard');
      } else {
        router.replace('/(lecturer)/dashboard');
      }
    }
  }, [user, loading, segments]);

  // Show nothing while restoring session (prevents flash of wrong screen)
  if (loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)"     options={{ headerShown: false }} />
      <Stack.Screen name="(admin)"    options={{ headerShown: false }} />
      <Stack.Screen name="(lecturer)" options={{ headerShown: false }} />
    </Stack>
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