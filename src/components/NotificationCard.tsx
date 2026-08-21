import { StyleSheet, View } from "react-native";

import type { SubscriptionNotification } from "@/services/notificationService";
import { ThemedText } from "./themed-text";

export function NotificationCard({
  notification,
}: {
  notification: SubscriptionNotification;
}) {
  const isExpiry = notification.type === "Subscription Expiry";
  return (
    <View style={styles.card}>
      <View
        style={[styles.icon, isExpiry ? styles.expiryIcon : styles.renewalIcon]}
      >
        <ThemedText style={styles.iconText}>{isExpiry ? "!" : "R"}</ThemedText>
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.name}>
          {notification.subscriptionName}
        </ThemedText>
        <ThemedText style={styles.type}>{notification.type}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.date}>
          Relevant date: {notification.relevantDate}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.message}>
          {notification.message}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5ECE9",
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  renewalIcon: { backgroundColor: "#E6F2EE" },
  expiryIcon: { backgroundColor: "#FFF3D6" },
  iconText: { color: "#236B5D", fontSize: 17, fontWeight: "800" },
  content: { flex: 1, gap: 3 },
  name: { color: "#173B35", fontSize: 16, fontWeight: "800" },
  type: { color: "#236B5D", fontSize: 13, fontWeight: "700" },
  date: { fontSize: 12, marginTop: 3 },
  message: { fontSize: 13, lineHeight: 19, marginTop: 5 },
});
