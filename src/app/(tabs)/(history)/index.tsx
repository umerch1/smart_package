import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "@/components/CustomButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HistoryScreen() {
  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View>
              <ThemedText themeColor="textSecondary" style={styles.eyebrow}>
                HISTORY
              </ThemedText>
              <ThemedText style={styles.title}>Your history</ThemedText>
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
            Review previous subscriptions and payments in one place.
          </ThemedText>
          <View style={styles.tabs}>
            <Link href="/(tabs)/(history)/subscriptions" asChild>
              <CustomButton
                label="Subscription history"
                onPress={() => undefined}
              />
            </Link>
            <Link href="/(tabs)/(history)/payments" asChild>
              <CustomButton
                label="Payment history"
                variant="outline"
                onPress={() => undefined}
              />
            </Link>
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
  tabs: { gap: 12, marginTop: 6 },
});
