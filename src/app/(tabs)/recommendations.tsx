import { Link } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "@/components/CustomButton";
import { RecommendationCard } from "@/components/RecommendationCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getApiErrorMessage } from "@/services/authApi";
import { useRecommendations } from "@/hooks/useRecommendations";

export default function RecommendationsScreen() {
  const {
    recommendations,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useRecommendations();

  const listHeader = (
    <View style={styles.headerContent}>
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
        Suggestions based on your subscriptions.
      </ThemedText>
    </View>
  );

  const emptyState = isLoading ? (
    <View style={styles.state}>
      <ActivityIndicator size="large" color="#10A889" />
    </View>
  ) : isError ? (
    <View style={styles.state}>
      <ThemedText style={styles.emptyTitle}>
        Unable to load recommendations
      </ThemedText>
      <ThemedText themeColor="textSecondary">
        {getApiErrorMessage(error, "Please check your connection and try again.")}
      </ThemedText>
      <CustomButton
        label="Try again"
        variant="outline"
        onPress={() => void refetch()}
      />
    </View>
  ) : (
    <View style={styles.state}>
      <ThemedText style={styles.emptyTitle}>No recommendations right now</ThemedText>
      <ThemedText themeColor="textSecondary">
        Recommendations appear when a subscription needs attention.
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <FlatList
          data={recommendations}
          keyExtractor={(recommendation) => recommendation.id}
          renderItem={({ item }) => (
            <RecommendationCard recommendation={item} />
          )}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={emptyState}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={() => void refetch()}
              tintColor="#10A889"
            />
          }
          contentContainerStyle={[
            styles.content,
            recommendations.length === 0 && styles.emptyContent,
          ]}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7FAFE" },
  safe: { flex: 1 },
  content: {
    padding: 22,
    paddingBottom: 40,
    maxWidth: 760,
    width: "100%",
    alignSelf: "center",
  },
  emptyContent: { flexGrow: 1 },
  headerContent: { gap: 18, marginBottom: 18 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: { fontSize: 11, letterSpacing: 1, fontWeight: "700" },
  title: { fontSize: 28, fontWeight: "800", color: "#102F55", marginTop: 5 },
  intro: { lineHeight: 22 },
  separator: { height: 12 },
  state: { flex: 1, justifyContent: "center", gap: 12, paddingVertical: 24 },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: "#102F55" },
});
