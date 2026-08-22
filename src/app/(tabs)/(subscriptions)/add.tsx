import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addSubscription } from "@/components/SubscriptionCard";
import { CustomButton } from "@/components/CustomButton";
import { InputField } from "@/components/InputField";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function AddSubscriptionScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [cost, setCost] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const save = () => {
    if (!name || !category || !cost || !renewalDate || !expiryDate) {
      Alert.alert("Missing details", "Please complete every field.");
      return;
    }
    addSubscription({ name, category, cost, renewalDate, expiryDate });
    router.replace("/(tabs)/(subscriptions)");
  };
  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText style={styles.title}>Add subscription</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.intro}>
            Keep the details handy so renewals never catch you by surprise.
          </ThemedText>
          <InputField
            label="Subscription Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Netflix"
          />
          <InputField
            label="Category"
            value={category}
            onChangeText={setCategory}
            placeholder="e.g. Entertainment"
          />
          <InputField
            label="Cost"
            value={cost}
            onChangeText={setCost}
            placeholder="e.g. 15.49"
            keyboardType="decimal-pad"
          />
          <InputField
            label="Renewal Date"
            value={renewalDate}
            onChangeText={setRenewalDate}
            placeholder="YYYY-MM-DD"
          />
          <InputField
            label="Expiry Date"
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholder="YYYY-MM-DD"
          />
          <CustomButton label="Save subscription" onPress={save} />
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
  intro: { lineHeight: 22, marginBottom: 4 },
});
