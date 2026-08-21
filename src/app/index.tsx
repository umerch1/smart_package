import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Loading } from "@/components/Loading";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const transition = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 1400);

    return () => clearTimeout(transition);
  }, [router]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logo}>
          <ThemedText style={styles.logoText}>S</ThemedText>
        </View>
        <ThemedText style={styles.brand}>SmartSub</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.tagline}>
          Keep every subscription in sight.
        </ThemedText>
        <Loading label="Preparing your dashboard" />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: "#236B5D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoText: { color: "#FFFFFF", fontSize: 42, fontWeight: "800" },
  brand: { fontSize: 38, fontWeight: "800", color: "#173B35" },
  tagline: { fontSize: 16, marginTop: 8, marginBottom: 48 },
});
