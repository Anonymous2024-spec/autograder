import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
  Spacing,
} from "../constants";

interface CardProps {
  title: string;
  description?: string;
  onPress: () => void;
  icon?: React.ReactNode;
  accent?: string; // background color for icon box
  badge?: string;  // small badge text e.g. "12 students"
  arrow?: boolean;
}

export default function Card({
  title,
  description,
  onPress,
  icon,
  accent = Colors.primaryLight,
  badge,
  arrow = true,
}: CardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Icon box */}
      {icon && (
        <View style={[styles.iconBox, { backgroundColor: accent }]}>
          {icon}
        </View>
      )}

      {/* Text */}
      <View style={styles.textBox}>
        <Text style={styles.title}>{title}</Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>

      {/* Arrow */}
      {arrow && (
        <View style={styles.arrowBox}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={Colors.primary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    lineHeight: 18,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginTop: Spacing.xs,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
});