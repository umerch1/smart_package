import { StyleSheet, View } from "react-native";

import type {
  PaymentHistoryRecord,
  SubscriptionHistoryRecord,
} from "@/services/historyService";
import { ThemedText } from "./themed-text";

type HistoryCardProps = {
  record: SubscriptionHistoryRecord | PaymentHistoryRecord;
};

export function HistoryCard({ record }: HistoryCardProps) {
  const isPayment = "amount" in record;
  const status = isPayment ? record.paymentStatus : record.status;
  const statusStyle =
    status === "Paid" || status === "Renewed"
      ? styles.success
      : status === "Failed"
        ? styles.failed
        : styles.muted;

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.icon,
          isPayment ? styles.paymentIcon : styles.subscriptionIcon,
        ]}
      >
        <ThemedText style={styles.iconText}>
          {isPayment ? "$" : record.subscriptionName.charAt(0)}
        </ThemedText>
      </View>
      <View style={styles.details}>
        <ThemedText style={styles.name}>{record.subscriptionName}</ThemedText>
        {isPayment ? (
          <>
            <ThemedText style={styles.detail}>
              Payment amount: {record.amount}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.detail}>
              Payment date: {record.paymentDate}
            </ThemedText>
          </>
        ) : (
          <ThemedText themeColor="textSecondary" style={styles.detail}>
            Relevant date: {record.relevantDate}
          </ThemedText>
        )}
      </View>
      <ThemedText style={[styles.status, statusStyle]}>{status}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5ECE9",
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  subscriptionIcon: { backgroundColor: "#E6F2EE" },
  paymentIcon: { backgroundColor: "#FFF9EC" },
  iconText: { color: "#236B5D", fontSize: 18, fontWeight: "800" },
  details: { flex: 1, gap: 4 },
  name: { color: "#173B35", fontSize: 16, fontWeight: "800" },
  detail: { fontSize: 13, lineHeight: 19 },
  status: {
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  success: { color: "#236B5D", backgroundColor: "#E6F2EE" },
  failed: { color: "#A64B4B", backgroundColor: "#FBEAEA" },
  muted: { color: "#6B7773", backgroundColor: "#EEF1F0" },
});
