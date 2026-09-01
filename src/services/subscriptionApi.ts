import { api } from "@/store/api";

export type ApiSubscription = {
  _id: string;
  packageName: string;
  category: string;
  startDate: string;
  renewalDate: string;
  expiryDate?: string;
  amount?: number;
  price?: number;
  notes?: string;
  status: "Active" | "Upcoming" | "Expired" | "Inactive";
  usagePattern?: string;
};

export type SubscriptionInput = {
  packageName: string;
  category: string;
  startDate: string;
  renewalDate: string;
  expiryDate?: string;
  amount?: number;
  price?: number;
  notes?: string;
  usagePattern?: string;
  status?: ApiSubscription["status"];
};

type SubscriptionsResponse = {
  success: boolean;
  message: string;
  data: { subscriptions: ApiSubscription[] };
};

type SubscriptionResponse = {
  success: boolean;
  message: string;
  data: { subscription: ApiSubscription };
};

export const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addSubscription: builder.mutation<SubscriptionResponse, SubscriptionInput>({
      query: (body) => ({ url: "/subscriptions", method: "POST", body }),
      invalidatesTags: ["Subscriptions", "Dashboard", "Notifications"],
    }),
    getSubscriptionById: builder.query<SubscriptionResponse, string>({
      query: (id) => `/subscriptions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Subscriptions", id }],
    }),
    updateSubscription: builder.mutation<SubscriptionResponse, { id: string; body: SubscriptionInput }>({
      query: ({ id, body }) => ({ url: `/subscriptions/${id}`, method: "PUT", body }),
      invalidatesTags: ["Subscriptions", "Dashboard", "Notifications"],
    }),
    deleteSubscription: builder.mutation<SubscriptionResponse, string>({
      query: (id) => ({ url: `/subscriptions/${id}`, method: "DELETE" }),
      invalidatesTags: ["Subscriptions", "Dashboard", "Notifications"],
    }),
    deactivateSubscription: builder.mutation<SubscriptionResponse, string>({
      query: (id) => ({ url: `/subscriptions/${id}/deactivate`, method: "PUT" }),
      invalidatesTags: ["Subscriptions", "Dashboard", "Notifications"],
    }),
    reactivateSubscription: builder.mutation<SubscriptionResponse, string>({
      query: (id) => ({ url: `/subscriptions/${id}/reactivate`, method: "PUT" }),
      invalidatesTags: ["Subscriptions", "Dashboard", "Notifications"],
    }),
    getSubscriptions: builder.query<SubscriptionsResponse, void>({
      query: () => "/subscriptions",
      providesTags: (result) => result
        ? ["Subscriptions", ...result.data.subscriptions.map(({ _id }) => ({ type: "Subscriptions" as const, id: _id }))]
        : ["Subscriptions"],
    }),
  }),
});

export const {
  useAddSubscriptionMutation,
  useGetSubscriptionByIdQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useDeactivateSubscriptionMutation,
  useReactivateSubscriptionMutation,
  useGetSubscriptionsQuery,
} = subscriptionApi;