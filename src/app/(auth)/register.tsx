import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getApiErrorMessage,
  useRegisterUserMutation,
} from "@/services/authApi";
import { setCredentials, TOKEN_STORAGE_KEY } from "@/store/authSlice";
import { useDispatch } from "react-redux";

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [registerUser, { isLoading, isError, error }] =
    useRegisterUserMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) return;

    try {
      const response = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      }).unwrap();
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);
      dispatch(setCredentials(response.data));
      router.replace("/(tabs)");
    } catch {
      // RTK Query state displays the error below.
    }
  };
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
            <Image
              accessibilityLabel="SmartSub logo"
              source={require("../../../assets/images/icon6.png")}
              style={styles.logo}
            />
            <ThemedText style={styles.title}>Create your account</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              A clearer way to manage what you subscribe to.
            </ThemedText>
            <View style={styles.form}>
              <InputField
                label="Full name"
                value={name}
                onChangeText={setName}
                placeholder="Your full name"
              />
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
                placeholder="Create a password"
                secureTextEntry
              />
              <InputField
                label="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat your password"
                secureTextEntry
              />
              <CustomButton
                label={isLoading ? "Creating account..." : "Create account"}
                onPress={handleRegister}
              />
              {password !== confirmPassword && confirmPassword.length > 0 && (
                <ThemedText style={styles.error}>
                  Passwords do not match.
                </ThemedText>
              )}
              {isError && (
                <ThemedText style={styles.error}>
                  {getApiErrorMessage(
                    error,
                    "Unable to create your account. Please try again.",
                  )}
                </ThemedText>
              )}
            </View>
            <View style={styles.footer}>
              <ThemedText themeColor="textSecondary">
                Already have an account?{" "}
              </ThemedText>
              <Link href="/(auth)/login">
                <ThemedText style={styles.link}>Log in</ThemedText>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7FAFE" },
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
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 28,
  },
  title: { fontSize: 32, fontWeight: "800", color: "#102F55" },
  subtitle: { marginTop: 8, marginBottom: 28, fontSize: 16 },
  form: { gap: 16 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  link: { color: "#10A889", fontWeight: "700" },
  error: { color: "#B42318", fontSize: 14 },
});
