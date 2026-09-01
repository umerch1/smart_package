import { api } from "@/store/api";
import type { AuthUser } from "@/store/authSlice";

type AuthResponse = {
  success: boolean;
  message: string;
  data: { user: AuthUser; token: string };
};

type ProfileResponse = {
  success: boolean;
  message: string;
  data: AuthUser;
};

type Credentials = { email: string; password: string };
type Registration = Credentials & { firstName: string; lastName: string; gender: string };

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<AuthResponse, Registration>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    loginUser: builder.mutation<AuthResponse, Credentials>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "/users/profile",
      providesTags: ["Profile"],
    }),
    logoutUser: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetProfileQuery,
  useLogoutUserMutation,
} = authApi;

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }

  if (typeof error === "object" && error !== null && "error" in error) {
    return "Network error. Check the backend address and your connection.";
  }

  return fallback;
}