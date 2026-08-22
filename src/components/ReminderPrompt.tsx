import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";

import { useNotifications } from "@/hooks/useNotifications";
import { ThemedText } from "./themed-text";

export function ReminderPrompt() {
  const { notifications } = useNotifications();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || notifications.length === 0) return null;

  const notification = notifications[0];
  const extraCount = notifications.length - 1;

  return (
    <View style={styles.prompt}>
      <View style={styles.icon}>
        <ThemedText style={styles.iconText}>!</ThemedText>
      </View>
      <View style={styles.copy}>
        <ThemedText style={styles.title}>
          Upcoming subscription reminder
        </ThemedText>
        <ThemedText style={styles.message}>
          {notification.subscriptionName}{" "}
          {notification.type === "Subscription Renewal" ? "renews" : "expires"}{" "}
          on {notification.relevantDate}.
          {extraCount > 0
            ? ` +${extraCount} more reminder${extraCount === 1 ? "" : "s"}.`
            : ""}
        </ThemedText>
        <Link href="/notifications" asChild>
          <Pressable>
            <ThemedText style={styles.action}>View notifications</ThemedText>
          </Pressable>
        </Link>
      </View>
      <Pressable
        accessibilityLabel="Dismiss reminder"
        onPress={() => setDismissed(true)}
        hitSlop={10}
      >
        <ThemedText style={styles.dismiss}>×</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  prompt: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6C878",
    backgroundColor: "#FFF8E5",
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2C94C",
  },
  iconText: { color: "#493600", fontSize: 20, fontWeight: "800" },
  copy: { flex: 1, gap: 4 },
  title: { color: "#493600", fontSize: 15, fontWeight: "800" },
  message: { color: "#6A5520", fontSize: 13, lineHeight: 19 },
  action: { color: "#10A889", fontSize: 13, fontWeight: "800", marginTop: 3 },
  dismiss: { color: "#806C38", fontSize: 24, lineHeight: 22 },
});
