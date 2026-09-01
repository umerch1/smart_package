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
import { Picker } from "@react-native-picker/picker";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = () => {
    const errors: string[] = [];

    if (firstName.trim().length < 2) {
      errors.push("First name must be at least 2 characters");
    }
    if (lastName.trim().length < 2) {
      errors.push("Last name must be at least 2 characters");
    }
    if (!gender) {
      errors.push("Please select a gender");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push("Please provide a valid email address");
    }
    if (password.length < 6 || password.length > 8) {
      errors.push("Password must be between 6-8 characters");
    }
    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const response = await registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        gender,
      }).unwrap();
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);
      dispatch(setCredentials(response.data));
      router.replace("/login");
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
                label="First name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Your first name"
              />
              <InputField
                label="Last name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Your last name"
              />
              <View>
                <ThemedText style={styles.label}>Gender</ThemedText>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue: any) => setGender(itemValue as "Male" | "Female" | "")}
                    style={styles.picker}
                    dropdownIconColor="#102F55"
                  >
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                  </Picker>
                </View>
              </View>
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
                    placeholder="Create a password (6-8 characters)"
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
                {password.length > 0 && (
                  <ThemedText
                    style={[
                      styles.passwordHint,
                      password.length >= 6 && password.length <= 8
                        ? styles.passwordValid
                        : styles.passwordInvalid,
                    ]}
                  >
                    {password.length}/8 characters
                  </ThemedText>
                )}
              </View>
              <View>
                <ThemedText style={styles.label}>Confirm password</ThemedText>
                <View style={styles.passwordFieldContainer}>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repeat your password"
                    placeholderTextColor="#5C7187"
                    secureTextEntry={!showConfirmPassword}
                    style={styles.passwordInput}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <ThemedText style={styles.eyeIconText}>
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
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
              {isError && (
                <ThemedText style={styles.error}>
                  {getApiErrorMessage(
                    error,
                    "Unable to create your account. Please try again.",
                  )}
                </ThemedText>
              )}
              <CustomButton
                label={isLoading ? "Creating account..." : "Create account"}
                onPress={handleRegister}
              />
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
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#102F55" },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    backgroundColor: "#F7FAFE",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#102F55",
  },
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
  passwordHint: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordValid: {
    color: "#10A889",
  },
  passwordInvalid: {
    color: "#B42318",
  },
  errorsContainer: {
    backgroundColor: "#FEE4E2",
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  link: { color: "#10A889", fontWeight: "700" },
  error: { color: "#B42318", fontSize: 14 },
});
