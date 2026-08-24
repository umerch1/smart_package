import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "@/components/CustomButton";
import { InputField } from "@/components/InputField";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  getApiErrorMessage,
  useGetProfileQuery,
  useLogoutUserMutation,
} from "@/services/authApi";
import { clearCredentials, TOKEN_STORAGE_KEY } from "@/store/authSlice";
import { useDispatch } from "react-redux";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { data, isLoading, isError, error } = useGetProfileQuery();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (data?.data) {
      setName(data.data.name);
      setEmail(data.data.email);
    }
  }, [data]);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } finally {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      dispatch(clearCredentials());
    }
  };
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
          {isLoading && <ThemedText>Loading profile...</ThemedText>}
          {isError && (
            <ThemedText style={styles.error}>
              {getApiErrorMessage(error, "Unable to load your profile.")}
            </ThemedText>
          )}
          <CustomButton label="Save profile" onPress={() => undefined} />
          <CustomButton
            label={isLoggingOut ? "Logging out..." : "Log out"}
            variant="outline"
            onPress={handleLogout}
          />
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
  error: { color: "#B42318", fontSize: 14 },
});
