import { useSyncExternalStore } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "./themed-text";

export type SubscriptionStatus = "Active" | "Expired" | "Upcoming";
export type Subscription = {
  id: string;
  name: string;
  category: string;
  cost: string;
  renewalDate: string;
  expiryDate: string;
};

let subscriptions: Subscription[] = [];
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const notify = () => listeners.forEach((listener) => listener());
export function useSubscriptions() {
  return useSyncExternalStore(
    subscribe,
    () => subscriptions,
    () => subscriptions,
  );
}
export function addSubscription(subscription: Omit<Subscription, "id">) {
  subscriptions = [...subscriptions, { ...subscription, id: `${Date.now()}` }];
  notify();
}
export function updateSubscription(
  id: string,
  changes: Omit<Subscription, "id">,
) {
  subscriptions = subscriptions.map((subscription) =>
    subscription.id === id ? { ...changes, id } : subscription,
  );
  notify();
}
export function removeSubscription(id: string) {
  subscriptions = subscriptions.filter(
    (subscription) => subscription.id !== id,
  );
  notify();
}
export function getSubscriptionStatus(
  subscription: Subscription,
): SubscriptionStatus {
  const today = new Date().toISOString().slice(0, 10);
  if (subscription.expiryDate < today) return "Expired";
  if (subscription.renewalDate > today) return "Upcoming";
  return "Active";
}
function formatDate(value: string) {
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

type SubscriptionCardProps = {
  name: string;
  category?: string;
  cost?: string;
  startDate?: string;
  renewalDate?: string;
  status?: SubscriptionStatus;
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
  plan?: string;
  price?: string;
  renewal?: string;
  accent?: string;
};
export function SubscriptionCard({
  name,
  category,
  cost,
  startDate,
  renewalDate,
  status,
  onEdit,
  onDelete,
  onPress,
  plan,
  price,
  renewal,
  accent = "#10A889",
}: SubscriptionCardProps) {
  const isDetailed = category !== undefined;
  const statusLabel = status?.toUpperCase();
  return (
    <Pressable disabled={!onPress} onPress={onPress} style={styles.card}>
      <View style={[styles.icon, { backgroundColor: accent }]}>
        <ThemedText style={styles.iconText}>{name.charAt(0)}</ThemedText>
      </View>
      <View style={styles.details}>
        <ThemedText style={styles.name}>{name}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.plan}>
          {category ?? plan}
        </ThemedText>
        {isDetailed && (
          <>
            <ThemedText style={styles.detail}>{cost !== undefined ? `Amount: $${cost}` : "Amount: Not provided"}</ThemedText>
            <ThemedText style={styles.detail}>
              Package date: {formatDate(startDate ?? "")}
            </ThemedText>
            <ThemedText style={styles.detail}>
              Renews: {formatDate(renewalDate ?? "")}
            </ThemedText>
          </>
        )}
      </View>
      <View style={styles.meta}>
        {!isDetailed && (
          <>
            <ThemedText style={styles.price}>{price}</ThemedText>
            <ThemedText style={styles.renewal}>{renewal}</ThemedText>
          </>
        )}
        {isDetailed && (
          <ThemedText
            style={[
              styles.status,
              status === "Expired" && styles.expired,
              status === "Upcoming" && styles.upcoming,
            ]}
          >
            {statusLabel}
          </ThemedText>
        )}
        {(onEdit || onDelete) && (
          <View style={styles.actions}>
            {onEdit && (
              <Pressable onPress={onEdit}>
                <ThemedText style={styles.action}>Edit</ThemedText>
              </Pressable>
            )}
            {onDelete && (
              <Pressable onPress={onDelete}>
                <ThemedText style={[styles.action, styles.delete]}>
                  Delete
                </ThemedText>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Pressable>
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
    borderColor: "#D7E5F0",
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" },
  details: { flex: 1, gap: 3 },
  name: { fontSize: 16, fontWeight: "800", color: "#102F55" },
  plan: { fontSize: 13 },
  detail: { fontSize: 12, color: "#526863" },
  meta: { alignItems: "flex-end", gap: 7 },
  price: { fontSize: 13, fontWeight: "700", color: "#102F55" },
  renewal: { fontSize: 12, color: "#10A889", fontWeight: "700" },
  status: {
    color: "#159A68",
    backgroundColor: "#DDF5EE",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "800",
  },
  expired: { color: "#A64B4B", backgroundColor: "#FBEAEA" },
  upcoming: { color: "#946D22", backgroundColor: "#FFF3D6" },
  actions: { flexDirection: "row", gap: 10 },
  action: { color: "#10A889", fontSize: 12, fontWeight: "800" },
  delete: { color: "#B54D4D" },
});
