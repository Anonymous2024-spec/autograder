import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../constants';

// Define what props the Input component accepts
interface InputProps {
  label: string;           // Label shown above the input
  placeholder?: string;    // Placeholder text inside the input
  value: string;           // Current value of the input
  onChangeText: (text: string) => void;  // Function called when user types
  secureTextEntry?: boolean;  // Hides text for passwords
  keyboardType?: 'default' | 'email-address' | 'numeric';  // Keyboard type
  error?: string;          // Error message shown below input
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
}: InputProps) {
  return (
    <View style={styles.container}>

      {/* Label above the input */}
      <Text style={styles.label}>{label}</Text>

      {/* The actual text input */}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />

      {/* Show error message only if error prop is passed */}
      {error && <Text style={styles.error}>{error}</Text>}

    </View>
  );
}

const styles = StyleSheet.create({
  // Spacing between each input group
  container: {
    marginBottom: Spacing.md,
  },
  // Label styling
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  // Input box styling
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: FontSize.md,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  // Red border when there is an error
  inputError: {
    borderColor: Colors.error,
  },
  // Error message styling
  error: {
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});