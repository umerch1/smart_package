import { Link, useRouter } from "expo-router";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "@/components/CustomButton";
import { ReminderPrompt } from "@/components/ReminderPrompt";
import {
  getSubscriptionStatus,
  removeSubscription,
  SubscriptionCard,
  useSubscriptions,
} from "@/components/SubscriptionCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function SubscriptionsScreen() {
  const router = useRouter();
  const subscriptions = useSubscriptions();
  const confirmDelete = (id: string) =>
    Alert.alert(
      "Delete subscription",
      "Are you sure you want to delete this subscription?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeSubscription(id),
        },
      ],
    );
  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <ReminderPrompt />
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
          <View style={styles.cards}>
            {subscriptions.length === 0 ? (
              <View style={styles.empty}>
                <ThemedText style={styles.emptyTitle}>
                  No subscriptions yet
                </ThemedText>
                <ThemedText themeColor="textSecondary">
                  Add a subscription to start tracking renewals.
                </ThemedText>
              </View>
            ) : (
              subscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  {...subscription}
                  status={getSubscriptionStatus(subscription)}
                  onEdit={() =>
                    router.push({
                      pathname: "/(tabs)/(subscriptions)/edit",
                      params: { id: subscription.id },
                    })
                  }
                  onDelete={() => confirmDelete(subscription.id)}
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
  title: { fontSize: 28, fontWeight: "800", color: "#173B35", marginTop: 5 },
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
