import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");

  useEffect(() => {
    if (data?.data) {
      setFirstName(data.data.firstName || "");
      setLastName(data.data.lastName || "");
      setEmail(data.data.email || "");
      if (data.data.gender === "Male" || data.data.gender === "Female") {
        setGender(data.data.gender);
      }
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
          {isLoading ? (
            <ThemedText>Loading profile...</ThemedText>
          ) : isError ? (
            <ThemedText style={styles.error}>
              {getApiErrorMessage(error, "Unable to load your profile.")}
            </ThemedText>
          ) : (
            <>
              <ThemedText themeColor="textSecondary" style={styles.eyebrow}>
                ACCOUNT
              </ThemedText>
              <ThemedText style={styles.title}>Your profile</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                Keep your account information up to date.
              </ThemedText>
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
                keyboardType="email-address"
                placeholder="your@email.com"
              />
              <CustomButton label="Save profile" onPress={() => undefined} />
              <CustomButton
                label={isLoggingOut ? "Logging out..." : "Log out"}
                variant="outline"
                onPress={handleLogout}
              />
            </>
          )}
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
  error: { color: "#B42318", fontSize: 14 },
});
