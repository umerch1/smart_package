import { api } from "@/store/api";

export type ApiNotification = {
  _id: string;
  title: string;
  message: string;
  type: "Renewal" | "Expiry";
  notificationDate: string;
  isRead: boolean;
};

type NotificationsResponse = {
  success: boolean;
  message: string;
  data: { notifications: ApiNotification[] };
};

type MarkNotificationAsReadResponse = {
  success: boolean;
  message: string;
  data: { notification: ApiNotification };
};

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => "/notifications",
      providesTags: ["Notifications"],
    }),
    markNotificationAsRead: builder.mutation<
      MarkNotificationAsReadResponse,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData("getNotifications", undefined, (draft) => {
            const notification = draft.data.notifications.find(
              (item) => item._id === id,
            );
            if (notification) notification.isRead = true;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} = notificationApi;