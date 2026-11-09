import { Pressable, StyleSheet, View } from "react-native";

import type { ApiNotification } from "@/services/notificationApi";
import { ThemedText } from "./themed-text";

export function NotificationCard({
  notification,
  onMarkAsRead,
  isMarking,
}: {
  notification: ApiNotification;
  onMarkAsRead: () => void;
  isMarking: boolean;
}) {
  const isExpiry = notification.type === "Expiry";
  const notificationDate = new Date(notification.notificationDate);
  const formattedDate = Number.isNaN(notificationDate.getTime())
    ? "Date unavailable"
    : notificationDate.toLocaleDateString(undefined, {
        timeZone: "UTC",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${notification.title}, ${notification.isRead ? "read" : "unread"}`}
      accessibilityState={{ disabled: notification.isRead || isMarking }}
      disabled={notification.isRead || isMarking}
      onPress={onMarkAsRead}
      style={[styles.card, !notification.isRead && styles.unreadCard]}
    >
      <View
        style={[styles.icon, isExpiry ? styles.expiryIcon : styles.renewalIcon]}
      >
        <ThemedText style={styles.iconText}>{isExpiry ? "!" : "R"}</ThemedText>
      </View>
      <View style={styles.content}>
        <View style={styles.heading}>
          <ThemedText style={styles.name}>{notification.title}</ThemedText>
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>
        <ThemedText style={styles.type}>{notification.type}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.message}>
          {notification.message}
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.date}>
          {formattedDate}
        </ThemedText>
        <ThemedText style={styles.readState}>
          {notification.isRead
            ? "Read"
            : isMarking
              ? "Marking as read..."
              : "Tap to mark as read"}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#D7E5F0",
  },
  unreadCard: { borderColor: "#10A889", backgroundColor: "#F6FCFA" },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  renewalIcon: { backgroundColor: "#DDF5EE" },
  expiryIcon: { backgroundColor: "#FFF3D6" },
  iconText: { color: "#10A889", fontSize: 17, fontWeight: "800" },
  content: { flex: 1, gap: 4 },
  heading: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { color: "#102F55", fontSize: 16, fontWeight: "800" },
  type: { color: "#10A889", fontSize: 13, fontWeight: "700" },
  date: { fontSize: 12, marginTop: 3 },
  message: { fontSize: 13, lineHeight: 19, marginTop: 5 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#D85B5B" },
  readState: { color: "#10A889", fontSize: 12, fontWeight: "700", marginTop: 4 },
});
