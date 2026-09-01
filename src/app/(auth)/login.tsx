import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "@/components/CustomButton";
import { InputField } from "@/components/InputField";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiErrorMessage, useLoginUserMutation } from "@/services/authApi";
import { api } from "@/store/api";
import { setCredentials, TOKEN_STORAGE_KEY } from "@/store/authSlice";
import { useDispatch } from "react-redux";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = () => {
    const errors: string[] = [];

    if (!email.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push("Please provide a valid email address");
    }

    if (!password) {
      errors.push("Password is required");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const response = await loginUser({
        email: email.trim(),
        password,
      }).unwrap();
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);
      dispatch(api.util.resetApiState());
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
              <View>
                <ThemedText style={styles.label}>Password</ThemedText>
                <View style={styles.passwordFieldContainer}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#5C7187"
                    secureTextEntry={!showPassword}
                    style={styles.passwordInput}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <ThemedText style={styles.eyeIconText}>
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
              {validationErrors.length > 0 && (
                <View style={styles.errorsContainer}>
                  {validationErrors.map((error, index) => (
                    <ThemedText key={index} style={styles.error}>
                      • {error}
                    </ThemedText>
                  ))}
                </View>
              )}
              <CustomButton
                label={isLoading ? "Logging in..." : "Log in"}
                onPress={handleLogin}
              />
              {isError && (
                <ThemedText style={styles.error}>
                  {getApiErrorMessage(
                    error,
                    "Unable to log in. Please try again.",
                  )}
                </ThemedText>
              )}
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
  subtitle: { marginTop: 8, marginBottom: 32, fontSize: 16 },
  form: { gap: 18 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#102F55" },
  passwordFieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D7E5F0",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    height: 52,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    color: "#102F55",
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeIconText: {
    fontSize: 18,
  },
  errorsContainer: {
    backgroundColor: "#FEE4E2",
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 28 },
  link: { color: "#10A889", fontWeight: "700" },
  error: { color: "#B42318", fontSize: 14 },
});
