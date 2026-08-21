import { useEffect, useState } from 'react';

import { getNotifications, type SubscriptionNotification } from '@/services/notificationService';
import { useSubscriptions } from '@/components/SubscriptionCard';

export function useNotifications() {
  const subscriptions = useSubscriptions();
  const [notifications, setNotifications] = useState<SubscriptionNotification[]>(() => getNotifications(subscriptions));

  useEffect(() => {
    setNotifications(getNotifications(subscriptions));
  }, [subscriptions]);

  return { notifications, refresh: () => setNotifications(getNotifications(subscriptions)) };
}