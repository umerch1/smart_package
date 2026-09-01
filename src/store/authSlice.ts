import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const TOKEN_STORAGE_KEY = "smart_package_auth_token";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: AuthUser | null }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setHydrated: (state) => {
      state.isHydrated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { clearCredentials, setCredentials, setHydrated, setUser } =
  authSlice.actions;
export default authSlice.reducer;