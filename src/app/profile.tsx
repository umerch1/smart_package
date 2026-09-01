import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

import { CustomButton } from "@/components/CustomButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  getApiErrorMessage,
  useGetProfileQuery,
  useLogoutUserMutation,
} from "@/services/authApi";
import { api } from "@/store/api";
import { clearCredentials, TOKEN_STORAGE_KEY } from "@/store/authSlice";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const profile = useGetProfileQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutUserMutation();
  const user = profile.data?.data;
  const displayName = user ? `${user.firstName} ${user.lastName}` : "";

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      dispatch(clearCredentials());
      dispatch(api.util.resetApiState());
      router.replace("/(auth)/login");
    }
  };

  return (
    <ThemedView style={styles.page}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Link href="/(tabs)" asChild>
            <CustomButton
              label="Back to dashboard"
              variant="outline"
              onPress={() => undefined}
            />
          </Link>
          <ThemedText themeColor="textSecondary" style={styles.eyebrow}>
            ACCOUNT
          </ThemedText>
          <ThemedText style={styles.title}>Your profile</ThemedText>
          {profile.isLoading ? (
            <ActivityIndicator size="large" color="#10A889" />
          ) : profile.isError ? (
            <View style={styles.message}>
              <ThemedText style={styles.error}>
                {getApiErrorMessage(
                  profile.error,
                  "Unable to load your profile.",
                )}
              </ThemedText>
              <CustomButton
                label="Try again"
                variant="outline"
                onPress={() => void profile.refetch()}
              />
            </View>
          ) : user ? (
            <View style={styles.card}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {user.firstName.charAt(0).toUpperCase()}
                </ThemedText>
              </View>
              <ThemedText style={styles.name}>{displayName}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.email}>
                {user.email}
              </ThemedText>
            </View>
          ) : null}
          <CustomButton
            label={isLoggingOut ? "Logging out..." : "Log out"}
            variant="outline"
            onPress={() => void handleLogout()}
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
    padding: 22,
    gap: 18,
    paddingBottom: 40,
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
    flexGrow: 1,
  },
  eyebrow: { fontSize: 11, letterSpacing: 1, fontWeight: "700", marginTop: 10 },
  title: { fontSize: 32, fontWeight: "800", color: "#102F55" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D7E5F0",
    padding: 26,
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#10A889",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: { color: "#FFFFFF", fontSize: 32, fontWeight: "800" },
  name: { color: "#102F55", fontSize: 21, fontWeight: "800" },
  email: { fontSize: 15 },
  message: { gap: 14 },
  error: { color: "#B42318" },
});
