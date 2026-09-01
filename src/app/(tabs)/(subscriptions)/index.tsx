import { Link, useRouter } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "@/components/CustomButton";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getApiErrorMessage } from "@/services/authApi";
import { type ApiSubscription, useDeactivateSubscriptionMutation, useReactivateSubscriptionMutation, useDeleteSubscriptionMutation, useGetSubscriptionsQuery } from "@/services/subscriptionApi";

export default function SubscriptionsScreen() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useGetSubscriptionsQuery();
  const [deleteSubscription] = useDeleteSubscriptionMutation();
  const [deactivateSubscription] = useDeactivateSubscriptionMutation();
  const [reactivateSubscription] = useReactivateSubscriptionMutation();
  const subscriptions: ApiSubscription[] = data?.data.subscriptions ?? [];
  const groupedSubscriptions = {
    Active: subscriptions.filter((subscription: ApiSubscription) => subscription.status === "Active"),
    Upcoming: subscriptions.filter((subscription: ApiSubscription) => subscription.status === "Upcoming"),
    Expired: subscriptions.filter((subscription: ApiSubscription) => subscription.status === "Expired"),
    Inactive: subscriptions.filter((subscription: ApiSubscription) => subscription.status === "Inactive"),
  };
  const confirmDelete = (id: string) => Alert.alert("Delete subscription", "Are you sure you want to delete this subscription?", [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", style: "destructive", onPress: async () => {
      try {
        await deleteSubscription(id).unwrap();
        Alert.alert("Success", "Subscription deleted successfully.");
      } catch {
        Alert.alert("Error", "Unable to delete subscription.");
      }
    } },
  ]);
  const confirmDeactivate = (id: string) => Alert.alert("Mark inactive", "Keep this subscription in your records but stop treating it as active?", [
    { text: "Cancel", style: "cancel" },
    { text: "Mark inactive", onPress: async () => {
      try { await deactivateSubscription(id).unwrap(); } catch { Alert.alert("Error", "Unable to mark subscription inactive."); }
    } },
  ]);
  const confirmReactivate = (id: string) => Alert.alert("Reactivate subscription", "Restore this subscription using its current dates?", [
    { text: "Cancel", style: "cancel" },
    { text: "Reactivate", onPress: async () => {
      try { await reactivateSubscription(id).unwrap(); } catch { Alert.alert("Error", "Unable to reactivate subscription."); }
    } },
  ]);
  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View>
              <ThemedText themeColor="textSecondary" style={styles.eyebrow}>
                SUBSCRIPTIONS
              </ThemedText>
              <ThemedText style={styles.title}>Your subscriptions</ThemedText>
            </View>
            <Link href="/(tabs)" asChild>
              <CustomButton
                label="Back"
                variant="outline"
                onPress={() => undefined}
              />
            </Link>
          </View>
          <Link href="/(tabs)/(subscriptions)/add" asChild>
            <CustomButton label="Add subscription" onPress={() => undefined} />
          </Link>
          {isLoading ? <ActivityIndicator size="large" color="#10A889" /> : isError ? (
              <View style={styles.empty}>
                <ThemedText style={styles.emptyTitle}>{getApiErrorMessage(error, "Unable to load subscriptions.")}</ThemedText>
                <CustomButton label="Try again" variant="outline" onPress={() => void refetch()} />
              </View>
            ) : subscriptions.length === 0 ? (
              <View style={styles.empty}>
                <ThemedText style={styles.emptyTitle}>
                  No subscriptions yet
                </ThemedText>
                <ThemedText themeColor="textSecondary">
                  Add a subscription to start tracking renewals.
                </ThemedText>
              </View>
            ) : (
              <View style={styles.sections}>
                <SubscriptionSection
                  title="Active subscriptions"
                  subscriptions={groupedSubscriptions.Active}
                  onPress={(id) => router.push({ pathname: "/(tabs)/(subscriptions)/details" as never, params: { id } })}
                  onEdit={(id) => router.push({ pathname: "/(tabs)/(subscriptions)/edit", params: { id } })}
                  onDelete={confirmDelete}
                  onDeactivate={confirmDeactivate}
                  onReactivate={confirmReactivate}
                />
                <SubscriptionSection
                  title="Upcoming renewals"
                  subscriptions={groupedSubscriptions.Upcoming}
                  onPress={(id) => router.push({ pathname: "/(tabs)/(subscriptions)/details" as never, params: { id } })}
                  onEdit={(id) => router.push({ pathname: "/(tabs)/(subscriptions)/edit", params: { id } })}
                  onDelete={confirmDelete}
                  onDeactivate={confirmDeactivate}
                  onReactivate={confirmReactivate}
                />
                <SubscriptionSection
                  title="Expired subscriptions"
                  subscriptions={groupedSubscriptions.Expired}
                  onPress={(id) => router.push({ pathname: "/(tabs)/(subscriptions)/details" as never, params: { id } })}
                  onEdit={(id) => router.push({ pathname: "/(tabs)/(subscriptions)/edit", params: { id } })}
                  onDelete={confirmDelete}
                  onDeactivate={confirmDeactivate}
                  onReactivate={confirmReactivate}
                />
                <SubscriptionSection
                  title="Inactive subscriptions"
                  subscriptions={groupedSubscriptions.Inactive}
                  onPress={(id) => router.push({ pathname: "/(tabs)/(subscriptions)/details" as never, params: { id } })}
                  onEdit={(id) => router.push({ pathname: "/(tabs)/(subscriptions)/edit", params: { id } })}
                  onDelete={confirmDelete}
                  onDeactivate={confirmDeactivate}
                  onReactivate={confirmReactivate}
                />
              </View>
            )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function SubscriptionSection({
  title,
  subscriptions,
  onPress,
  onEdit,
  onDelete,
  onDeactivate,
  onReactivate,
}: {
  title: string;
  subscriptions: ApiSubscription[];
  onPress: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDeactivate: (id: string) => void;
  onReactivate: (id: string) => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.count}>{subscriptions.length}</ThemedText>
      </View>
      {subscriptions.length === 0 ? (
        <ThemedText themeColor="textSecondary" style={styles.sectionEmpty}>None</ThemedText>
      ) : (
        <View style={styles.cards}>
          {subscriptions.map((subscription: ApiSubscription) => (
            <SubscriptionCard
              key={subscription._id}
              name={subscription.packageName}
              category={subscription.category}
              cost={subscription.amount !== undefined ? String(subscription.amount) : subscription.price !== undefined ? String(subscription.price) : undefined}
              startDate={subscription.startDate}
              renewalDate={subscription.renewalDate}
              status={subscription.status}
              onPress={() => onPress(subscription._id)}
              onEdit={() => onEdit(subscription._id)}
              onDelete={() => onDelete(subscription._id)}
              onDeactivate={() => onDeactivate(subscription._id)}
              onReactivate={() => onReactivate(subscription._id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7FAFE" },
  safe: { flex: 1 },
  content: {
    padding: 22,
    gap: 24,
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
  title: { fontSize: 28, fontWeight: "800", color: "#102F55", marginTop: 5 },
  sections: { gap: 26 },
  section: { gap: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: "#102F55" },
  count: { fontSize: 14, fontWeight: "700" },
  sectionEmpty: { paddingVertical: 8 },
  cards: { gap: 12 },
  empty: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#D7E5F0",
    padding: 24,
    gap: 5,
  },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: "#102F55" },
});
