import { Link } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "@/components/CustomButton";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getApiErrorMessage, useGetProfileQuery } from "@/services/authApi";
import { useGetDashboardQuery } from "@/services/dashboardApi";
import { useGetNotificationsQuery } from "@/services/notificationApi";
import { useGetSubscriptionsQuery } from "@/services/subscriptionApi";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

export default function DashboardScreen() {
  const profile = useGetProfileQuery();
  const dashboard = useGetDashboardQuery();
  const subscriptions = useGetSubscriptionsQuery();
  const notifications = useGetNotificationsQuery();
  const isLoading =
    profile.isLoading || dashboard.isLoading || subscriptions.isLoading;
  const hasError =
    profile.isError || dashboard.isError || subscriptions.isError;
  const user = profile.data?.data;
  const userName = user ? `${user.firstName} ${user.lastName}` : undefined;
  const stats = dashboard.data?.data;
  const activeSubscriptions =
    subscriptions.data?.data?.subscriptions.filter(
      (item) => item.status === "Active",
    ) ?? [];
  const retry = () => {
    void profile.refetch();
    void dashboard.refetch();
    void subscriptions.refetch();
    void notifications.refetch();
  };

  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={styles.logo}>
                <ThemedText style={styles.logoText}>S</ThemedText>
              </View>
              <View>
                <ThemedText style={styles.brand}>Smart Package</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.eyebrow}>
                  DASHBOARD
                </ThemedText>
              </View>
            </View>
            <View style={styles.headerActions}>
              <Link href="/notifications" asChild>
                <Pressable
                  accessibilityLabel="Notifications"
                  style={styles.notificationButton}
                >
                  <ThemedText style={styles.bell}>N</ThemedText>
                  {notifications.data?.data.notifications.some(
                    (item) => !item.isRead,
                  ) && <View style={styles.unread} />}
                </Pressable>
              </Link>
              <Link href="/profile" asChild>
                <Pressable
                  accessibilityLabel="Profile"
                  style={styles.avatarSmall}
                >
                  <ThemedText style={styles.avatarText}>
                    {userName?.charAt(0).toUpperCase() ?? "?"}
                  </ThemedText>
                </Pressable>
              </Link>
            </View>
          </View>
          <View style={styles.welcome}>
            <ThemedText style={styles.title}>
              Welcome back{userName ? `, ${userName}` : ""}
            </ThemedText>
            <ThemedText themeColor="textSecondary">
              Manage your subscriptions in one place.
            </ThemedText>
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color="#10A889" />
          ) : hasError ? (
            <View style={styles.message}>
              <ThemedText style={styles.error}>
                {getApiErrorMessage(
                  dashboard.error ?? subscriptions.error ?? profile.error,
                  "Unable to load your dashboard.",
                )}
              </ThemedText>
              <CustomButton
                label="Try again"
                variant="outline"
                onPress={retry}
              />
            </View>
          ) : (
            <>
              <View style={styles.summaryGrid}>
                <Summary
                  label="Active"
                  value={stats?.activeSubscriptions ?? 0}
                />
                <Summary
                  label="Upcoming"
                  value={stats?.upcomingSubscriptions ?? 0}
                />
                <Summary
                  label="Expired"
                  value={stats?.expiredSubscriptions ?? 0}
                />
              </View>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>
                  Active subscriptions
                </ThemedText>
                <Link href="/(tabs)/(subscriptions)">
                  <ThemedText style={styles.link}>View all</ThemedText>
                </Link>
              </View>
              {activeSubscriptions.length === 0 ? (
                <View style={styles.empty}>
                  <ThemedText style={styles.emptyTitle}>
                    No subscriptions yet
                  </ThemedText>
                  <Link href="/(tabs)/(subscriptions)/add" asChild>
                    <CustomButton
                      label="Add subscription"
                      onPress={() => undefined}
                    />
                  </Link>
                </View>
              ) : (
                <View style={styles.cards}>
                  {activeSubscriptions.map((item) => (
                    <SubscriptionCard
                      key={item._id}
                      name={item.packageName}
                      category={item.category}
                      cost={item.amount !== undefined ? String(item.amount) : item.price !== undefined ? String(item.price) : undefined}
                      startDate={item.startDate}
                      renewalDate={formatDate(item.renewalDate)}
                      status={item.status}
                    />
                  ))}
                </View>
              )}
              <Link href="/(tabs)/(subscriptions)/add" asChild>
                <CustomButton
                  label="Add subscription"
                  onPress={() => undefined}
                />
              </Link>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.summary}>
      <ThemedText themeColor="textSecondary">{label}</ThemedText>
      <ThemedText style={styles.count}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7FAFE" },
  safe: { flex: 1 },
  content: {
    padding: 22,
    gap: 22,
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
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#102F55",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: "#FFFFFF", fontSize: 21, fontWeight: "800" },
  brand: { color: "#102F55", fontSize: 18, fontWeight: "800" },
  eyebrow: { fontSize: 10, letterSpacing: 1, fontWeight: "700" },
  headerActions: { flexDirection: "row", gap: 10, alignItems: "center" },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#DDF5EE",
    alignItems: "center",
    justifyContent: "center",
  },
  bell: { color: "#102F55", fontWeight: "800" },
  unread: {
    position: "absolute",
    right: 8,
    top: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D85B5B",
  },
  avatarSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#10A889",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#FFFFFF", fontWeight: "800", fontSize: 17 },
  welcome: { gap: 5 },
  title: { fontSize: 28, fontWeight: "800", color: "#102F55" },
  summaryGrid: { flexDirection: "row", gap: 10 },
  summary: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#D7E5F0",
    padding: 15,
    gap: 8,
  },
  count: { fontSize: 30, fontWeight: "800", color: "#102F55" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: "#102F55" },
  link: { color: "#10A889", fontWeight: "700" },
  cards: { gap: 12 },
  empty: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#D7E5F0",
    padding: 20,
    gap: 14,
  },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: "#102F55" },
  message: { gap: 14 },
  error: { color: "#B42318" },
});
