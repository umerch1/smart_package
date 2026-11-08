import { SymbolView } from "expo-symbols";
import { Platform, StyleSheet, View } from "react-native";

import type { ApiRecommendation } from "@/services/recommendationApi";
import { ThemedText } from "./themed-text";

function getRecommendationKind(id: string) {
  if (id.endsWith("-low-usage")) return "low-usage";
  if (id.endsWith("-expired")) return "expired";
  if (id.endsWith("-renewal")) return "renewal";
  return "general";
}

export function RecommendationCard({
  recommendation,
}: {
  recommendation: ApiRecommendation;
}) {
  const kind = getRecommendationKind(recommendation.id);
  const indicator = {
    "low-usage": {
      label: "LOW USAGE",
      icon: { ios: "chart.bar.xaxis", android: "bar_chart" },
      fallback: "↓",
      style: styles.lowUsage,
    },
    expired: {
      label: "EXPIRED",
      icon: { ios: "exclamationmark.triangle.fill", android: "warning" },
      fallback: "!",
      style: styles.expired,
    },
    renewal: {
      label: "RENEWAL SOON",
      icon: { ios: "calendar.badge.clock", android: "event" },
      fallback: "↻",
      style: styles.renewal,
    },
    general: {
      label: "RECOMMENDATION",
      icon: { ios: "lightbulb.fill", android: "lightbulb" },
      fallback: "i",
      style: styles.general,
    },
  }[kind];

  return (
    <View style={styles.card}>
      <View style={[styles.icon, indicator.style]}>
        {Platform.OS === "web" ? (
          <ThemedText style={styles.iconText}>{indicator.fallback}</ThemedText>
        ) : (
          <SymbolView
            name={indicator.icon}
            tintColor={kind === "expired" ? "#B42318" : "#10A889"}
            size={20}
            fallback={
              <ThemedText style={styles.iconText}>
                {indicator.fallback}
              </ThemedText>
            }
          />
        )}
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.kind}>{indicator.label}</ThemedText>
        <ThemedText style={styles.title}>{recommendation.title}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.explanation}>
          {recommendation.explanation}
        </ThemedText>
        {recommendation.relatedSubscription && (
          <ThemedText style={styles.related}>
            Related subscription: {recommendation.relatedSubscription}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
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
  lowUsage: { backgroundColor: "#EAF3FC" },
  expired: { backgroundColor: "#FBEAEA" },
  renewal: { backgroundColor: "#DDF5EE" },
  general: { backgroundColor: "#EAECF0" },
  iconText: { color: "#10A889", fontSize: 19, fontWeight: "800" },
  content: { flex: 1, gap: 5 },
  kind: { color: "#5C7187", fontSize: 10, fontWeight: "800" },
  title: { color: "#102F55", fontSize: 16, fontWeight: "800" },
  explanation: { fontSize: 13, lineHeight: 20 },
  related: { color: "#10A889", fontSize: 13, fontWeight: "700", marginTop: 2 },
});
