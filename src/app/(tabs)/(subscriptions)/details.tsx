import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "@/components/CustomButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getApiErrorMessage } from "@/services/authApi";
import { useDeleteSubscriptionMutation, useGetSubscriptionByIdQuery } from "@/services/subscriptionApi";

function displayDate(value?: string) {
  if (!value) return "Not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function SubscriptionDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const details = useGetSubscriptionByIdQuery(id ?? "", { skip: !id });
  const [deleteSubscription, { isLoading: isDeleting }] = useDeleteSubscriptionMutation();
  const subscription = details.data?.data.subscription;

  const remove = () => Alert.alert("Delete subscription", "Are you sure you want to delete this subscription?", [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", style: "destructive", onPress: async () => {
      try {
        await deleteSubscription(id ?? "").unwrap();
        Alert.alert("Success", "Subscription deleted successfully.", [{ text: "OK", onPress: () => router.replace("/(tabs)/(subscriptions)") }]);
      } catch {
        Alert.alert("Error", "Unable to delete subscription.");
      }
    } },
  ]);

  return <ThemedView style={styles.page}><SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <Link href="/(tabs)/(subscriptions)" asChild><CustomButton label="Back to subscriptions" variant="outline" onPress={() => undefined} /></Link>
    {details.isLoading ? <ActivityIndicator size="large" color="#10A889" /> : details.isError ? <View style={styles.message}><ThemedText style={styles.error}>{getApiErrorMessage(details.error, "Subscription not found.")}</ThemedText><CustomButton label="Try again" variant="outline" onPress={() => void details.refetch()} /></View> : subscription ? <>
      <ThemedText style={styles.title}>{subscription.packageName}</ThemedText>
      <View style={styles.card}><Detail label="Category" value={subscription.category} /><Detail label="Start Date" value={displayDate(subscription.startDate)} /><Detail label="Amount" value={subscription.amount !== undefined ? `$${subscription.amount}` : subscription.price !== undefined ? `$${subscription.price}` : "Not provided"} /><Detail label="Renewal Date" value={displayDate(subscription.renewalDate)} /><Detail label="Expiry Date" value={displayDate(subscription.expiryDate)} /><Detail label="Notes" value={subscription.notes || "Not provided"} /><Detail label="Usage Pattern" value={subscription.usagePattern || "Not provided"} /><Detail label="Status" value={subscription.status} /></View>
      <Link href={{ pathname: "/(tabs)/(subscriptions)/edit", params: { id: subscription._id } }} asChild><CustomButton label="Edit" onPress={() => undefined} /></Link>
      <CustomButton label={isDeleting ? "Deleting..." : "Delete"} variant="outline" onPress={remove} />
    </> : <ThemedText style={styles.title}>Subscription not found</ThemedText>}
  </ScrollView></SafeAreaView></ThemedView>;
}

function Detail({ label, value }: { label: string; value: string }) { return <View style={styles.detail}><ThemedText themeColor="textSecondary">{label}</ThemedText><ThemedText style={styles.value}>{value}</ThemedText></View>; }
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: "#F7FAFE" }, safe: { flex: 1 }, content: { padding: 22, gap: 18, paddingBottom: 40, maxWidth: 620, width: "100%", alignSelf: "center" }, title: { fontSize: 28, fontWeight: "800", color: "#102F55" }, card: { backgroundColor: "#FFFFFF", borderRadius: 17, borderWidth: 1, borderColor: "#D7E5F0", padding: 20, gap: 16 }, detail: { gap: 4 }, value: { color: "#102F55", fontSize: 16, fontWeight: "700" }, message: { gap: 14 }, error: { color: "#B42318" } });
