import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { clearCredentials, TOKEN_STORAGE_KEY } from "./authSlice";

// Change this address to the development machine's LAN IP for a physical device.
const BACKEND_IP = "192.168.100.4";
export const API_BASE_URL = `http://${BACKEND_IP}:5000/api`;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth?: { token: string | null } }).auth
      ?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery: async (args, apiContext, extraOptions) => {
    const result = await rawBaseQuery(args, apiContext, extraOptions);
    if (result.error?.status === 401) {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      apiContext.dispatch(clearCredentials());
    }
    return result;
  },
  tagTypes: ["Dashboard", "Subscriptions", "Notifications", "Profile"],
  endpoints: () => ({}),
});