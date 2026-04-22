import React from "react";
import { ActivityIndicator, View, StyleSheet, Text } from "react-native";
import { Colors, Spacing } from "../constants";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export default function LoadingOverlay({ visible, message = "Loading..." }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
}

interface LoadingIndicatorProps {
  size?: "small" | "large";
  color?: string;
}

export function LoadingIndicator({ size = "small", color = Colors.primary }: LoadingIndicatorProps) {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.md,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  message: {
    fontSize: 14,
    color: Colors.text,
    marginTop: Spacing.sm,
  },
});
