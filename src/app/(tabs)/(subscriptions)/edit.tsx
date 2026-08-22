import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "@/components/CustomButton";
import { InputField } from "@/components/InputField";
import {
  Subscription,
  updateSubscription,
  useSubscriptions,
} from "@/components/SubscriptionCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function EditSubscriptionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const subscriptions = useSubscriptions();
  const subscription = subscriptions.find((item) => item.id === id);
  const [form, setForm] = useState<Omit<Subscription, "id">>({
    name: "",
    category: "",
    cost: "",
    renewalDate: "",
    expiryDate: "",
  });
  useEffect(() => {
    if (subscription) {
      const { id: _id, ...values } = subscription;
      setForm(values);
    }
  }, [subscription]);
  const setField = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));
  const save = () => {
    if (!subscription || Object.values(form).some((value) => !value)) {
      Alert.alert("Missing details", "Please complete every field.");
      return;
    }
    updateSubscription(subscription.id, form);
    router.replace("/(tabs)/(subscriptions)");
  };
  if (!subscription)
    return (
      <ThemedView style={styles.page}>
        <SafeAreaView style={styles.safe}>
          <ThemedText style={styles.title}>Subscription not found</ThemedText>
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
            value={form.name}
            onChangeText={(value) => setField("name", value)}
          />
          <InputField
            label="Category"
            value={form.category}
            onChangeText={(value) => setField("category", value)}
          />
          <InputField
            label="Cost"
            value={form.cost}
            onChangeText={(value) => setField("cost", value)}
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
          <CustomButton label="Save changes" onPress={save} />
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
});
