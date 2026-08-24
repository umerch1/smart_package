import { Link, useRouter } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "@/components/CustomButton";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getApiErrorMessage } from "@/services/authApi";
import { useGetSubscriptionsQuery } from "@/services/subscriptionApi";

export default function SubscriptionsScreen() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useGetSubscriptionsQuery();
  const subscriptions = data?.data.subscriptions ?? [];
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
          <View style={styles.cards}>
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
              subscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription._id}
                  name={subscription.packageName}
                  category={subscription.category}
                  cost={String(subscription.price)}
                  renewalDate={subscription.renewalDate}
                  expiryDate={subscription.expiryDate}
                  status={subscription.status}
                  onEdit={() =>
                    router.push({
                      pathname: "/(tabs)/(subscriptions)/edit",
                      params: { id: subscription._id },
                    })
                  }
                  onDelete={() => Alert.alert("Delete subscription", "Delete is not available in this view yet.")}
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
