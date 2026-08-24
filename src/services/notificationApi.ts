import { api } from "@/store/api";

export type ApiNotification = {
  _id: string;
  subscriptionName: string;
  type: string;
  relevantDate: string;
  message: string;
  isRead: boolean;
};

type NotificationsResponse = {
  success: boolean;
  message: string;
  data: { notifications: ApiNotification[] };
};

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => "/notifications",
      providesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationApi;