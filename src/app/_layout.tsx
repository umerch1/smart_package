import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  useSegments,
  useRouter,
} from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";

import { useGetProfileQuery } from "@/services/authApi";
import { api } from "@/store/api";
import {
  clearCredentials,
  setCredentials,
  setHydrated,
  setUser,
  TOKEN_STORAGE_KEY,
} from "@/store/authSlice";
import { store, type RootState } from "@/store/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthGate />
    </Provider>
  );
}

function AuthGate() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const segments = useSegments();
  const { token, isAuthenticated, isHydrated } = useSelector(
    (state: RootState) => state.auth,
  );
  const profile = useGetProfileQuery(undefined, {
    skip: !isHydrated || !token,
  });

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_STORAGE_KEY)
      .then((storedToken) => {
        if (storedToken)
          dispatch(setCredentials({ token: storedToken, user: null }));
      })
      .finally(() => dispatch(setHydrated()));
  }, [dispatch]);

  useEffect(() => {
    if (profile.data?.data) dispatch(setUser(profile.data.data));
  }, [dispatch, profile.data]);

  useEffect(() => {
    if (!profile.isError || !token || profile.error?.status !== 401) return;
    AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    dispatch(clearCredentials());
    dispatch(api.util.resetApiState());
  }, [dispatch, profile.error, profile.isError, token]);

  useEffect(() => {
    if (!isHydrated || profile.isLoading || profile.isFetching) return;
    const isAuthRoute = segments[0] === "(auth)";
    const isRootRoute = segments.length === 0;
    if (isAuthenticated && (isAuthRoute || isRootRoute))
      router.replace("/(tabs)");
    else if (!isAuthenticated && !isAuthRoute) router.replace("/(auth)/login");
  }, [
    isAuthenticated,
    isHydrated,
    profile.isFetching,
    profile.isLoading,
    router,
    segments,
  ]);

  if (!isHydrated || (token && profile.isLoading)) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#10A889" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
});
