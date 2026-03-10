import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../constants';

// Define what props the Card component accepts
interface CardProps {
  title: string;          // Main title on the card
  description?: string;   // Optional smaller text below title
  onPress: () => void;    // Function called when card is tapped
  icon?: React.ReactNode; // Optional icon to show on the left
}

export default function Card({ title, description, onPress, icon }: CardProps) {
  return (
    // TouchableOpacity makes the whole card tappable
    <TouchableOpacity style={styles.card} onPress={onPress}>

      {/* Show icon only if passed */}
      {icon && <View style={styles.iconBox}>{icon}</View>}

      {/* Text section */}
      <View style={styles.textBox}>
        {/* Card title */}
        <Text style={styles.title}>{title}</Text>

        {/* Show description only if passed */}
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Card container styling
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',   // Icon and text side by side
    alignItems: 'center',
    marginBottom: Spacing.sm,
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 2,
  },
  // Icon box styling
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  // Text container takes remaining space
  textBox: {
    flex: 1,
  },
  // Title styling
  title: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  // Description styling
  description: {
    fontSize: FontSize.sm,
    color: Colors.subtext,
    marginTop: Spacing.xs,
  },
});
