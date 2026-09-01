import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "@/components/CustomButton";
import { InputField } from "@/components/InputField";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getApiErrorMessage } from "@/services/authApi";
import { useGetSubscriptionByIdQuery, useUpdateSubscriptionMutation } from "@/services/subscriptionApi";

export default function EditSubscriptionScreen() {
  const router = useRouter();
  const today = getToday();
  const { id } = useLocalSearchParams<{ id: string }>();
  const details = useGetSubscriptionByIdQuery(id ?? "", { skip: !id });
  const subscription = details.data?.data.subscription;
  const [updateSubscription, { isLoading: isSaving, isError, error }] = useUpdateSubscriptionMutation();
  const [form, setForm] = useState({
    packageName: "",
    category: "",
    startDate: "",
    renewalDate: "",
    amount: "",
    notes: "",
  });
  const [startDateValue, setStartDateValue] = useState<Date>(today);
  const [renewalDateValue, setRenewalDateValue] = useState<Date>(today);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showRenewalCalendar, setShowRenewalCalendar] = useState(false);
  useEffect(() => {
    if (subscription) {
      setForm({ packageName: subscription.packageName, category: subscription.category, startDate: subscription.startDate?.slice(0, 10) ?? formatDate(today), renewalDate: subscription.renewalDate.slice(0, 10), amount: subscription.amount !== undefined ? String(subscription.amount) : subscription.price !== undefined ? String(subscription.price) : "", notes: subscription.notes ?? "" });
      setStartDateValue(parseDate(subscription.startDate) ?? today);
      setRenewalDateValue(parseDate(subscription.renewalDate) ?? today);
    }
  }, [subscription]);
  const setField = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));
  const save = async () => {
    if (!subscription || !form.packageName.trim() || !form.category.trim() || !form.startDate || !form.renewalDate) {
      Alert.alert("Missing details", "Please complete the required fields.");
      return;
    }
    const amount = form.amount.trim() ? Number(form.amount) : undefined;
    if (amount !== undefined && (!Number.isFinite(amount) || amount < 0)) {
      Alert.alert("Invalid amount", "Enter a valid non-negative amount.");
      return;
    }
    try {
      await updateSubscription({ id: subscription._id, body: { packageName: form.packageName.trim(), category: form.category.trim(), startDate: form.startDate, renewalDate: form.renewalDate, ...(amount !== undefined ? { amount } : {}), ...(form.notes.trim() ? { notes: form.notes.trim() } : {}), status: subscription.status } }).unwrap();
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
          <View style={styles.pickerLabel}><ThemedText style={styles.label}>Subscription Name</ThemedText></View>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={form.packageName} onValueChange={(value) => setField("packageName", value)}>
              <Picker.Item label="Select a subscription" value="" />
              <Picker.Item label="Netflix" value="Netflix" /><Picker.Item label="Jazz" value="Jazz" /><Picker.Item label="Gym membership" value="Gym membership" /><Picker.Item label="Spotify" value="Spotify" /><Picker.Item label="YouTube Premium" value="YouTube Premium" /><Picker.Item label="Amazon Prime" value="Amazon Prime" /><Picker.Item label="Microsoft 365" value="Microsoft 365" /><Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          <View style={styles.pickerLabel}><ThemedText style={styles.label}>Category</ThemedText></View>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={form.category} onValueChange={(value) => setField("category", value)}>
              <Picker.Item label="Select a category" value="" />
              <Picker.Item label="Entertainment" value="Entertainment" /><Picker.Item label="Bills" value="Bills" /><Picker.Item label="Health" value="Health" /><Picker.Item label="Education" value="Education" /><Picker.Item label="Finance" value="Finance" /><Picker.Item label="Mobile Package" value="Mobile Package" /><Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          <InputField
            label="Amount (optional)"
            value={form.amount}
            onChangeText={(value) => setField("amount", value)}
            keyboardType="decimal-pad"
          />
          <DateField label="Start Date" value={startDateValue} minimumDate={today} displayValue={form.startDate} visible={showStartCalendar} onPress={() => setShowStartCalendar((visible) => !visible)} onChange={(event, date) => { setShowStartCalendar(false); if (event.type === "set" && date) { setStartDateValue(date); setField("startDate", formatDate(date)); } }} />
          <DateField label="Renewal Date" value={renewalDateValue} minimumDate={today} displayValue={form.renewalDate} visible={showRenewalCalendar} onPress={() => setShowRenewalCalendar((visible) => !visible)} onChange={(event, date) => { setShowRenewalCalendar(false); if (event.type === "set" && date) { setRenewalDateValue(date); setField("renewalDate", formatDate(date)); } }} />
          <InputField
            label="Notes (optional)"
            value={form.notes}
            onChangeText={(value) => setField("notes", value)}
            placeholder="Additional information"
            multiline
          />
          {isError && <ThemedText style={styles.error}>{getApiErrorMessage(error, "Unable to update subscription.")}</ThemedText>}
          <CustomButton label={isSaving ? "Saving..." : "Save changes"} onPress={() => void save()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function formatDate(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function getToday() { const today = new Date(); today.setHours(0, 0, 0, 0); return today; }
function parseDate(value?: string) { if (!value) return undefined; const date = new Date(value); return Number.isNaN(date.getTime()) ? undefined : date; }
function DateField({ label, value, minimumDate, displayValue, visible, onPress, onChange }: { label: string; value: Date; minimumDate: Date; displayValue: string; visible: boolean; onPress: () => void; onChange: (event: DateTimePickerEvent, date?: Date) => void; }) {
  const pickerValue = value < minimumDate ? minimumDate : value;
  return <View style={styles.dateField}><ThemedText style={styles.label}>{label}</ThemedText><Pressable style={styles.dateButton} onPress={onPress}><ThemedText style={displayValue ? styles.dateValue : styles.datePlaceholder}>{displayValue || "Choose date"}</ThemedText></Pressable>{visible && <DateTimePicker value={pickerValue} minimumDate={minimumDate} mode="date" display="default" onChange={onChange} />}</View>;
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
  pickerLabel: { marginBottom: -10 },
  label: { fontSize: 14, fontWeight: "700", color: "#102F55" },
  pickerContainer: { height: 52, borderWidth: 1, borderColor: "#D7E5F0", borderRadius: 12, justifyContent: "center", backgroundColor: "#FFFFFF", overflow: "hidden" },
  dateField: { gap: 8 },
  dateButton: { height: 52, borderWidth: 1, borderColor: "#D7E5F0", borderRadius: 12, paddingHorizontal: 15, justifyContent: "center", backgroundColor: "#FFFFFF" },
  dateValue: { color: "#102F55", fontSize: 16 },
  datePlaceholder: { color: "#5C7187", fontSize: 16 },
  error: { color: "#B42318" },
});
