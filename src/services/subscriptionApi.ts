import { api } from "@/store/api";

export type ApiSubscription = {
  _id: string;
  packageName: string;
  category: string;
  price: number;
  renewalDate: string;
  expiryDate?: string;
  status: "Active" | "Upcoming" | "Expired";
};

type SubscriptionsResponse = {
  success: boolean;
  message: string;
  data: { subscriptions: ApiSubscription[] };
};

export const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation<ApiSubscription, Partial<ApiSubscription>>({
      query: (body) => ({ url: "/subscriptions", method: "POST", body }),
      invalidatesTags: ["Subscriptions", "Dashboard", "Notifications"],
    }),
    updateSubscription: builder.mutation<ApiSubscription, { id: string; body: Partial<ApiSubscription> }>({
      query: ({ id, body }) => ({ url: `/subscriptions/${id}`, method: "PUT", body }),
      invalidatesTags: ["Subscriptions", "Dashboard", "Notifications"],
    }),
    deleteSubscription: builder.mutation<ApiSubscription, string>({
      query: (id) => ({ url: `/subscriptions/${id}`, method: "DELETE" }),
      invalidatesTags: ["Subscriptions", "Dashboard", "Notifications"],
    }),
    getSubscriptions: builder.query<SubscriptionsResponse, void>({
      query: () => "/subscriptions",
      providesTags: ["Subscriptions"],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetSubscriptionsQuery,
} = subscriptionApi;