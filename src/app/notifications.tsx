import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NotificationCard } from "@/components/NotificationCard";
import { CustomButton } from "@/components/CustomButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsScreen() {
  const { notifications } = useNotifications();
  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View>
              <ThemedText themeColor="textSecondary" style={styles.eyebrow}>
                REMINDERS
              </ThemedText>
              <ThemedText style={styles.title}>Notifications</ThemedText>
            </View>
            <Link href="/(tabs)" asChild>
              <CustomButton
                label="Back"
                variant="outline"
                onPress={() => undefined}
              />
            </Link>
          </View>
          <ThemedText themeColor="textSecondary" style={styles.intro}>
            Renewal and expiry reminders for your subscriptions.
          </ThemedText>
          <View style={styles.cards}>
            {notifications.length === 0 ? (
              <View style={styles.empty}>
                <ThemedText style={styles.emptyTitle}>
                  You&apos;re all caught up
                </ThemedText>
                <ThemedText themeColor="textSecondary">
                  New renewal and expiry reminders will appear here.
                </ThemedText>
              </View>
            ) : (
              notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F8FAFC" },
  safe: { flex: 1 },
  content: {
    padding: 22,
    gap: 18,
    paddingBottom: 40,
    maxWidth: 760,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: { fontSize: 11, letterSpacing: 1, fontWeight: "700" },
  title: { fontSize: 28, fontWeight: "800", color: "#173B35", marginTop: 5 },
  intro: { lineHeight: 22 },
  cards: { gap: 12 },
  empty: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E5ECE9",
    padding: 24,
    gap: 5,
  },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: "#173B35" },
});
