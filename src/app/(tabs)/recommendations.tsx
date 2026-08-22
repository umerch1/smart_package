import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "@/components/CustomButton";
import { RecommendationCard } from "@/components/RecommendationCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRecommendations } from "@/hooks/useRecommendations";

export default function RecommendationsScreen() {
  const { recommendations } = useRecommendations();
  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View>
              <ThemedText themeColor="textSecondary" style={styles.eyebrow}>
                SMARTSUB
              </ThemedText>
              <ThemedText style={styles.title}>Recommendations</ThemedText>
            </View>
            <Link href="/(tabs)" asChild>
              <CustomButton
                label="Back"
                variant="outline"
                onPress={() => undefined}
              />
            </Link>
          </View>
          <ThemedText themeColor="textSecondary" style={styles.intro}>
            Helpful suggestions based on your subscription patterns.
          </ThemedText>
          <View style={styles.cards}>
            {recommendations.length === 0 ? (
              <View style={styles.empty}>
                <ThemedText style={styles.emptyTitle}>
                  No recommendations yet
                </ThemedText>
                <ThemedText themeColor="textSecondary">
                  Recommendations will appear as your subscription list grows.
                </ThemedText>
              </View>
            ) : (
              recommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                />
              ))
            )}
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
  intro: { lineHeight: 22 },
  cards: { gap: 12 },
  empty: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#D7E5F0",
    padding: 24,
    gap: 5,
  },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: "#102F55" },
});
