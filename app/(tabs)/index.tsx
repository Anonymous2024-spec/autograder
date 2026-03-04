import { ThemedView } from "@/components/themed-view";
import { Text } from "@react-navigation/elements";

export default function HomeScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <Text>
        Hi there! Welcome to your new Expo + React Native app. This is the home
        screen of your app,
      </Text>
    </ThemedView>
  );
}

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: "absolute",
//   },
// });
