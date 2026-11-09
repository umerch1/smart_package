import { useGetNotificationsQuery } from "@/services/notificationApi";

export function useNotifications() {
  const query = useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  return {
    ...query,
    notifications: query.data?.data.notifications ?? [],
  };
}