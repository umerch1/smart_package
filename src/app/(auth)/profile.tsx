import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "@/components/CustomButton";
import { InputField } from "@/components/InputField";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function ProfileScreen() {
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex@example.com");
  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText themeColor="textSecondary" style={styles.eyebrow}>
            ACCOUNT
          </ThemedText>
          <ThemedText style={styles.title}>Your profile</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Keep your account information up to date.
          </ThemedText>
          <InputField label="Name" value={name} onChangeText={setName} />
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomButton label="Save profile" onPress={() => undefined} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7FAFE" },
  safe: { flex: 1 },
  content: {
    padding: 28,
    gap: 18,
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  eyebrow: { fontSize: 11, letterSpacing: 1, fontWeight: "700" },
  title: { fontSize: 32, fontWeight: "800", color: "#102F55" },
  subtitle: { marginBottom: 14 },
});
