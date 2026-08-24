import { StyleSheet, View } from "react-native";

import type { Recommendation } from "@/services/recommendationService";
import { ThemedText } from "./themed-text";

export function RecommendationCard({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <ThemedText style={styles.iconText}>i</ThemedText>
      </View>
      <View style={styles.content}>
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
    backgroundColor: "#DDF5EE",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { color: "#10A889", fontSize: 19, fontWeight: "800" },
  content: { flex: 1, gap: 5 },
  title: { color: "#102F55", fontSize: 16, fontWeight: "800" },
  explanation: { fontSize: 13, lineHeight: 20 },
  related: { color: "#10A889", fontSize: 13, fontWeight: "700", marginTop: 2 },
});
