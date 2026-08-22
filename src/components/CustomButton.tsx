import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "./themed-text";

export function CustomButton({
  label,
  onPress,
  variant = "primary",
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline";
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "outline" && styles.outline,
        pressed && styles.pressed,
      ]}
    >
      <ThemedText
        style={[styles.text, variant === "outline" && styles.outlineText]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    backgroundColor: "#102F55",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#10A889",
    minHeight: 42,
  },
  text: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  outlineText: { color: "#10A889", fontSize: 13 },
  pressed: { opacity: 0.75 },
});
