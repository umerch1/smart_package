import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "@/components/CustomButton";
import { NotificationCard } from "@/components/NotificationCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getApiErrorMessage } from "@/services/authApi";
import { useMarkNotificationAsReadMutation } from "@/services/notificationApi";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsScreen() {
  const { notifications, isLoading, isFetching, isError, error, refetch } =
    useNotifications();
  const [markAsRead, markResult] = useMarkNotificationAsReadMutation();
  const [markingId, setMarkingId] = useState<string | null>(null);

  const handleMarkAsRead = async (id: string) => {
    setMarkingId(id);
    try {
      await markAsRead({ id }).unwrap();
    } catch {
      // The mutation error is shown in the list header.
    } finally {
      setMarkingId(null);
    }
  };

  const listHeader = (
    <View style={styles.headerContent}>
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
      {markResult.isError && (
        <ThemedText style={styles.error}>
          {getApiErrorMessage(
            markResult.error,
            "Unable to mark this notification as read.",
          )}
        </ThemedText>
      )}
    </View>
  );

  const emptyState = isLoading ? (
    <View style={styles.state}>
      <ActivityIndicator size="large" color="#10A889" />
    </View>
  ) : isError && !notifications.length ? (
    <View style={styles.state}>
      <ThemedText style={styles.emptyTitle}>
        Unable to load notifications
      </ThemedText>
      <ThemedText themeColor="textSecondary">
        {getApiErrorMessage(error, "Please check your connection and try again.")}
      </ThemedText>
      <CustomButton
        label="Try again"
        variant="outline"
        onPress={() => void refetch()}
      />
    </View>
  ) : (
    <View style={styles.state}>
      <ThemedText style={styles.emptyTitle}>You&apos;re all caught up</ThemedText>
      <ThemedText themeColor="textSecondary">
        New renewal and expiry reminders will appear here.
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <FlatList
          data={notifications}
          keyExtractor={(notification) => notification._id}
          renderItem={({ item }) => (
            <NotificationCard
              notification={item}
              onMarkAsRead={() => void handleMarkAsRead(item._id)}
              isMarking={markingId === item._id}
            />
          )}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={emptyState}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={() => void refetch()}
              tintColor="#10A889"
            />
          }
          contentContainerStyle={[
            styles.content,
            notifications.length === 0 && styles.emptyContent,
          ]}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7FAFE" },
  safe: { flex: 1 },
  content: {
    padding: 22,
    paddingBottom: 40,
    maxWidth: 760,
    width: "100%",
    alignSelf: "center",
  },
  emptyContent: { flexGrow: 1 },
  headerContent: { gap: 18, marginBottom: 18 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: { fontSize: 11, letterSpacing: 1, fontWeight: "700" },
  title: { fontSize: 28, fontWeight: "800", color: "#102F55", marginTop: 5 },
  intro: { lineHeight: 22 },
  separator: { height: 12 },
  state: { flex: 1, justifyContent: "center", gap: 12, paddingVertical: 24 },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: "#102F55" },
  error: { color: "#B42318" },
});
