import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "@/components/CustomButton";
import { InputField } from "@/components/InputField";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logo}>
              <ThemedText style={styles.logoText}>S</ThemedText>
            </View>
            <ThemedText style={styles.title}>Welcome back</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              Sign in to stay ahead of every renewal.
            </ThemedText>
            <View style={styles.form}>
              <InputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
              />
              <InputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
              />
              <CustomButton
                label="Log in"
                onPress={() => router.navigate("/(tabs)")}
              />
            </View>
            <View style={styles.footer}>
              <ThemedText themeColor="textSecondary">
                New to SmartSub?{" "}
              </ThemedText>
              <Link href="/(auth)/register">
                <ThemedText style={styles.link}>Create an account</ThemedText>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F8FAFC" },
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 28,
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#236B5D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  logoText: { color: "#FFF", fontSize: 27, fontWeight: "800" },
  title: { fontSize: 32, fontWeight: "800", color: "#173B35" },
  subtitle: { marginTop: 8, marginBottom: 32, fontSize: 16 },
  form: { gap: 18 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 28 },
  link: { color: "#236B5D", fontWeight: "700" },
});
