import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, FontSize, FontWeight, Radius, Shadows, Spacing } from "../constants";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "outline" | "ghost" | "danger";
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  loading,
  variant = "primary",
  icon,
  fullWidth = true,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "outline" && styles.outline,
        variant === "ghost" && styles.ghost,
        variant === "danger" && styles.danger,
        !fullWidth && styles.inline,
        loading && styles.disabled,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" || variant === "danger"
            ? Colors.white
            : Colors.primary}
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[
              styles.text,
              variant === "outline" && styles.outlineText,
              variant === "ghost" && styles.ghostText,
              variant === "danger" && styles.dangerText,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.colored,
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  ghost: {
    backgroundColor: Colors.primaryLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  danger: {
    backgroundColor: Colors.error,
    shadowColor: Colors.error,
  },
  disabled: {
    opacity: 0.65,
  },
  inline: {
    alignSelf: "flex-start",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  icon: {
    marginRight: 2,
  },
  text: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.3,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.white,
  },
});