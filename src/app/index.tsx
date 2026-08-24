import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
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
        <Image
          accessibilityLabel="SmartSub logo"
          source={require("../../assets/images/icon6.png")}
          style={styles.logo}
        />
        <ThemedText style={styles.brand}>Smart Package</ThemedText>
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
    width: 132,
    height: 132,
    borderRadius: 66,
    marginBottom: 20,
  },
  brand: { fontSize: 38, fontWeight: "800", color: "#102F55" },
  tagline: { fontSize: 16, marginTop: 8, marginBottom: 48 },
});
