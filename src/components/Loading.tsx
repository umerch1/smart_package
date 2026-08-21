import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "./themed-text";

export function Loading({ label = "Loading" }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#236B5D" size="small" />
      <ThemedText themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 12 },
  label: { fontSize: 13 },
});
