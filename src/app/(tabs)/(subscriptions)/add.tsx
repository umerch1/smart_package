import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "@/components/CustomButton";
import { InputField } from "@/components/InputField";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getApiErrorMessage } from "@/services/authApi";
import { useAddSubscriptionMutation } from "@/services/subscriptionApi";

export default function AddSubscriptionScreen() {
  const router = useRouter();
  const today = getToday();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [startDate, setStartDate] = useState<string>(() => formatDate(today));
  const [renewalDate, setRenewalDate] = useState<string>(() => formatDate(today));
  const [expiryDate, setExpiryDate] = useState("");
  const [startDateValue, setStartDateValue] = useState(() => today);
  const [renewalDateValue, setRenewalDateValue] = useState(() => today);
  const [expiryDateValue, setExpiryDateValue] = useState<Date>();
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showRenewalCalendar, setShowRenewalCalendar] = useState(false);
  const [showExpiryCalendar, setShowExpiryCalendar] = useState(false);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [addSubscription, { isLoading, isError, error }] = useAddSubscriptionMutation();
  const save = async () => {
    const selectedCategory = category === "__custom__" ? customCategory.trim() : category.trim();
    if (!name.trim() || !selectedCategory || !startDate.trim() || !renewalDate.trim()) {
      Alert.alert("Missing details", "Please complete the required fields.");
      return;
    }
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(startDate) || !datePattern.test(renewalDate)) {
      Alert.alert("Invalid date", "Use YYYY-MM-DD for dates.");
      return;
    }
    if (startDate < formatDate(today) || renewalDate < formatDate(today)) {
      Alert.alert("Invalid date", "Dates cannot be earlier than today.");
      return;
    }
    const parsedAmount = amount.trim() ? Number(amount) : undefined;
    if (parsedAmount !== undefined && (!Number.isFinite(parsedAmount) || parsedAmount < 0)) {
      Alert.alert("Invalid amount", "Enter a valid non-negative amount.");
      return;
    }
    try {
      await addSubscription({
        packageName: name.trim(),
        category: selectedCategory,
        startDate,
        renewalDate,
        ...(expiryDate ? { expiryDate } : {}),
        ...(parsedAmount !== undefined ? { amount: parsedAmount } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      }).unwrap();
      setName("");
      setCategory("");
      setCustomCategory("");
      setStartDate(formatDate(today));
      setRenewalDate(formatDate(today));
      setExpiryDate("");
      setStartDateValue(today);
      setRenewalDateValue(today);
      setExpiryDateValue(undefined);
      setAmount("");
      setNotes("");
      Alert.alert("Success", "Subscription added successfully.", [{ text: "OK", onPress: () => router.replace("/(tabs)/(subscriptions)") }]);
    } catch {
      // The API error is shown below the form.
    }
  };
  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText style={styles.title}>Add subscription</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.intro}>
            Keep the details handy so renewals never catch you by surprise.
          </ThemedText>
          <View style={styles.pickerLabel}><ThemedText style={styles.label}>Subscription Name</ThemedText></View>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={name} onValueChange={setName}>
              <Picker.Item label="Select a subscription" value="" />
              <Picker.Item label="Netflix" value="Netflix" />
              <Picker.Item label="Jazz" value="Jazz" />
              <Picker.Item label="Gym membership" value="Gym membership" />
              <Picker.Item label="Spotify" value="Spotify" />
              <Picker.Item label="YouTube Premium" value="YouTube Premium" />
              <Picker.Item label="Amazon Prime" value="Amazon Prime" />
              <Picker.Item label="Microsoft 365" value="Microsoft 365" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          <View style={styles.pickerLabel}><ThemedText style={styles.label}>Category</ThemedText></View>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={category} onValueChange={setCategory}>
              <Picker.Item label="Select a category" value="" />
              <Picker.Item label="Entertainment" value="Entertainment" />
              <Picker.Item label="Bills" value="Bills" />
              <Picker.Item label="Health" value="Health" />
              <Picker.Item label="Education" value="Education" />
              <Picker.Item label="Finance" value="Finance" />
              <Picker.Item label="Utilities" value="Utilities" />
              <Picker.Item label="Mobile Package" value="Mobile Package" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          {category === "__custom__" && <InputField label="Custom Category" value={customCategory} onChangeText={setCustomCategory} placeholder="e.g. Travel" />}
          <InputField
            label="Amount (optional)"
            value={amount}
            onChangeText={setAmount}
            placeholder="e.g. 15.49"
            keyboardType="decimal-pad"
          />
          <DateField
            label="Start Date"
            value={startDateValue}
            minimumDate={today}
            displayValue={startDate}
            visible={showStartCalendar}
            onPress={() => setShowStartCalendar((visible) => !visible)}
            onChange={(event, date) => {
              setShowStartCalendar(false);
              if (event.type === "set" && date) {
                setStartDateValue(date);
                setStartDate(formatDate(date));
              }
            }}
          />
          <DateField
            label="Renewal Date"
            value={renewalDateValue}
            minimumDate={today}
            displayValue={renewalDate}
            visible={showRenewalCalendar}
            onPress={() => setShowRenewalCalendar((visible) => !visible)}
            onChange={(event, date) => {
              setShowRenewalCalendar(false);
              if (event.type === "set" && date) {
                setRenewalDateValue(date);
                setRenewalDate(formatDate(date));
              }
            }}
          />
          <DateField
            label="Expiry Date (optional)"
            value={expiryDateValue}
            minimumDate={renewalDateValue}
            displayValue={expiryDate}
            visible={showExpiryCalendar}
            onPress={() => setShowExpiryCalendar((visible) => !visible)}
            onChange={(event, date) => {
              setShowExpiryCalendar(false);
              if (event.type === "set" && date) {
                setExpiryDateValue(date);
                setExpiryDate(formatDate(date));
              }
            }}
          />
          <InputField
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional information"
            multiline
          />
          {isError && <ThemedText style={styles.error}>{getApiErrorMessage(error, "Unable to add subscription.")}</ThemedText>}
          <CustomButton label={isLoading ? "Saving..." : "Save subscription"} onPress={() => void save()} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function DateField({
  label,
  value,
  minimumDate,
  displayValue,
  visible,
  onPress,
  onChange,
}: {
  label: string;
  value?: Date;
  minimumDate: Date;
  displayValue: string;
  visible: boolean;
  onPress: () => void;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
}) {
  return (
    <View style={styles.dateField}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Pressable style={styles.dateButton} onPress={onPress}>
        <ThemedText style={displayValue ? styles.dateValue : styles.datePlaceholder}>
          {displayValue || "Choose date"}
        </ThemedText>
      </Pressable>
      {visible && <DateTimePicker value={value ?? minimumDate} minimumDate={minimumDate} mode="date" display="default" onChange={onChange} />}
    </View>
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
  pickerLabel: { marginBottom: -10 },
  label: { fontSize: 14, fontWeight: "700", color: "#102F55" },
  pickerContainer: { height: 52, borderWidth: 1, borderColor: "#D7E5F0", borderRadius: 12, justifyContent: "center", backgroundColor: "#FFFFFF", overflow: "hidden" },
  dateField: { gap: 8 },
  dateButton: { height: 52, borderWidth: 1, borderColor: "#D7E5F0", borderRadius: 12, paddingHorizontal: 15, justifyContent: "center", backgroundColor: "#FFFFFF" },
  dateValue: { color: "#102F55", fontSize: 16 },
  datePlaceholder: { color: "#5C7187", fontSize: 16 },
  error: { color: "#B42318" },
});
