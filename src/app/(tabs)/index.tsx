import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "@/components/CustomButton";
import { EmptyState } from "@/components/EmptyState";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { ReminderPrompt } from "@/components/ReminderPrompt";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function DashboardScreen() {
  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <ReminderPrompt />
          <View style={styles.header}>
            <View>
              <ThemedText themeColor="textSecondary" style={styles.eyebrow}>
                TUESDAY, AUGUST 19
              </ThemedText>
              <ThemedText style={styles.title}>Good morning, Alex</ThemedText>
            </View>
            <View style={styles.headerActions}>
              <Link href={"/notifications" as never} asChild>
                <CustomButton
                  label="Notifications"
                  variant="outline"
                  onPress={() => undefined}
                />
              </Link>
              <Link href="/(auth)/profile" asChild>
                <CustomButton
                  label="Profile"
                  variant="outline"
                  onPress={() => undefined}
                />
              </Link>
            </View>
          </View>
          <View style={styles.summary}>
            <ThemedText themeColor="textSecondary">
              Active subscriptions
            </ThemedText>
            <ThemedText style={styles.count}>4</ThemedText>
            <ThemedText themeColor="textSecondary">
              Your renewals, organized.
            </ThemedText>
          </View>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              Your subscriptions
            </ThemedText>
            <Link href="/(tabs)/(subscriptions)">
              <ThemedText style={styles.link}>See all</ThemedText>
            </Link>
          </View>
          <View style={styles.cards}>
            <SubscriptionCard
              name="Netflix"
              plan="Standard plan"
              price="$15.49 / month"
              renewal="Renews in 3 days"
              accent="#E45757"
            />
            <SubscriptionCard
              name="Spotify"
              plan="Premium individual"
              price="$11.99 / month"
              renewal="Renews in 12 days"
              accent="#55A67B"
            />
          </View>
          <View style={styles.renewal}>
            <ThemedText style={styles.sectionTitle}>
              Upcoming renewal
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.renewalCopy}>
              Netflix renews on August 22. We&apos;ll remind you before
              it&apos;s due.
            </ThemedText>
            <CustomButton
              label="Notification settings"
              variant="outline"
              onPress={() => undefined}
            />
          </View>
          <Link href="/(tabs)/(subscriptions)" asChild>
            <CustomButton
              label="Manage subscriptions"
              onPress={() => undefined}
            />
          </Link>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F8FAFC" },
  safe: { flex: 1 },
  content: {
    padding: 22,
    gap: 24,
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
  headerActions: { flexDirection: "row", gap: 8 },
  eyebrow: { fontSize: 11, letterSpacing: 1, fontWeight: "700" },
  title: { fontSize: 28, fontWeight: "800", color: "#173B35", marginTop: 5 },
  summary: {
    backgroundColor: "#E6F2EE",
    padding: 22,
    borderRadius: 20,
    gap: 5,
  },
  count: { fontSize: 42, fontWeight: "800", color: "#236B5D" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: "#173B35" },
  link: { color: "#236B5D", fontWeight: "700" },
  cards: { gap: 12 },
  renewal: {
    backgroundColor: "#FFF9EC",
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  renewalCopy: { lineHeight: 22 },
});
