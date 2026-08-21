import { StyleSheet, TextInput, type TextInputProps, View } from "react-native";

import { ThemedText } from "./themed-text";

export function InputField({
  label,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        {...props}
        placeholderTextColor="#8A9B96"
        style={styles.input}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { gap: 8 },
  label: { fontSize: 14, fontWeight: "700", color: "#173B35" },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D5E0DC",
    borderRadius: 12,
    paddingHorizontal: 15,
    color: "#173B35",
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
});
