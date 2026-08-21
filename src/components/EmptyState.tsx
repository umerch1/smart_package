import { StyleSheet, View } from "react-native";

import { ThemedText } from "./themed-text";

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.message}>
        {message}
      </ThemedText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 28, gap: 8 },
  title: { fontSize: 18, fontWeight: "800", color: "#173B35" },
  message: { textAlign: "center", lineHeight: 21 },
});
