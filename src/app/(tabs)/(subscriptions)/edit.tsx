import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "@/components/CustomButton";
import { InputField } from "@/components/InputField";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getApiErrorMessage } from "@/services/authApi";
import { useGetSubscriptionByIdQuery, useUpdateSubscriptionMutation } from "@/services/subscriptionApi";

export default function EditSubscriptionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const details = useGetSubscriptionByIdQuery(id ?? "", { skip: !id });
  const subscription = details.data?.data.subscription;
  const [updateSubscription, { isLoading: isSaving, isError, error }] = useUpdateSubscriptionMutation();
  const [form, setForm] = useState({
    packageName: "",
    category: "",
    price: "",
    renewalDate: "",
    expiryDate: "",
  });
  useEffect(() => {
    if (subscription) {
      setForm({ packageName: subscription.packageName, category: subscription.category, price: String(subscription.price), renewalDate: subscription.renewalDate.slice(0, 10), expiryDate: subscription.expiryDate?.slice(0, 10) ?? "" });
    }
  }, [subscription]);
  const setField = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));
  const save = async () => {
    if (!subscription || Object.values(form).some((value) => !value)) {
      Alert.alert("Missing details", "Please complete every field.");
      return;
    }
    const price = Number(form.price);
    if (!Number.isFinite(price)) {
      Alert.alert("Invalid price", "Enter a valid price.");
      return;
    }
    try {
      await updateSubscription({ id: subscription._id, body: { packageName: form.packageName.trim(), category: form.category, price, renewalDate: form.renewalDate, expiryDate: form.expiryDate, status: subscription.status } }).unwrap();
      Alert.alert("Success", "Subscription updated successfully.", [{ text: "OK", onPress: () => router.replace("/(tabs)/(subscriptions)") }]);
    } catch {
      // The API error is displayed below the form.
    }
  };
  if (details.isLoading)
    return <ThemedView style={styles.page}><SafeAreaView style={styles.safe}><ActivityIndicator size="large" color="#10A889" /></SafeAreaView></ThemedView>;
  if (details.isError || !subscription)
    return (
      <ThemedView style={styles.page}>
        <SafeAreaView style={styles.safe}>
          <ThemedText style={styles.title}>{getApiErrorMessage(details.error, "Subscription not found")}</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText style={styles.title}>Edit subscription</ThemedText>
          <InputField
            label="Subscription Name"
            value={form.packageName}
            onChangeText={(value) => setField("packageName", value)}
          />
          <InputField
            label="Category"
            value={form.category}
            onChangeText={(value) => setField("category", value)}
          />
          <InputField
            label="Cost"
            value={form.price}
            onChangeText={(value) => setField("price", value)}
            keyboardType="decimal-pad"
          />
          <InputField
            label="Renewal Date"
            value={form.renewalDate}
            onChangeText={(value) => setField("renewalDate", value)}
            placeholder="YYYY-MM-DD"
          />
          <InputField
            label="Expiry Date"
            value={form.expiryDate}
            onChangeText={(value) => setField("expiryDate", value)}
            placeholder="YYYY-MM-DD"
          />
          {isError && <ThemedText style={styles.error}>{getApiErrorMessage(error, "Unable to update subscription.")}</ThemedText>}
          <CustomButton label={isSaving ? "Saving..." : "Save changes"} onPress={() => void save()} />
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
    gap: 18,
    paddingBottom: 40,
    maxWidth: 760,
    width: "100%",
    alignSelf: "center",
  },
  title: { fontSize: 28, fontWeight: "800", color: "#102F55" },
  error: { color: "#B42318" },
});
