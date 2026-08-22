import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HistoryCard } from "@/components/HistoryCard";
import { CustomButton } from "@/components/CustomButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getPaymentHistory } from "@/services/historyService";

export default function PaymentHistoryScreen() {
  const records = getPaymentHistory();
  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View>
              <ThemedText themeColor="textSecondary" style={styles.eyebrow}>
                HISTORY
              </ThemedText>
              <ThemedText style={styles.title}>Payment history</ThemedText>
            </View>
            <Link href="/(tabs)/(history)" asChild>
              <CustomButton
                label="All history"
                variant="outline"
                onPress={() => undefined}
              />
            </Link>
          </View>
          <View style={styles.tabs}>
            <Link href="/(tabs)/(history)/subscriptions" asChild>
              <CustomButton
                label="Subscription history"
                variant="outline"
                onPress={() => undefined}
              />
            </Link>
            <Link href="/(tabs)/(history)/payments" asChild>
              <CustomButton label="Payment history" onPress={() => undefined} />
            </Link>
          </View>
          <View style={styles.cards}>
            {records.map((record) => (
              <HistoryCard key={record.id} record={record} />
            ))}
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
    gap: 18,
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
  tabs: { gap: 10 },
  cards: { gap: 12 },
});
