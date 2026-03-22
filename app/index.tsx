import { Redirect } from 'expo-router';

export default function Index() {
  // _layout.tsx handles all auth logic and redirects.
  // This just ensures expo-router has a defined entry point.
  // If logged in → guard sends to correct dashboard
  // If not logged in → guard sends to login
  return <Redirect href="/(auth)/login" />;
}