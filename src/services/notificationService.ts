import type { Subscription } from "@/components/SubscriptionCard";

export type NotificationType = "Subscription Renewal" | "Subscription Expiry";

export type SubscriptionNotification = {
  id: string;
  subscriptionName: string;
  type: NotificationType;
  relevantDate: string;
  message: string;
};

const reminderWindowDays = 30;

function daysUntil(dateValue: string, today: Date) {
  const date = new Date(`${dateValue}T00:00:00`);
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return Math.ceil((date.getTime() - startOfToday.getTime()) / 86400000);
}

function formatDate(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? dateValue
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

export function getReminderNotifications(
  subscriptions: Subscription[],
  today = new Date(),
): SubscriptionNotification[] {
  return subscriptions.flatMap((subscription) => {
    const notifications: SubscriptionNotification[] = [];
    if (
      daysUntil(subscription.renewalDate, today) >= 0 &&
      daysUntil(subscription.renewalDate, today) <= reminderWindowDays
    ) {
      notifications.push({
        id: `${subscription.id}-renewal`,
        subscriptionName: subscription.name,
        type: "Subscription Renewal",
        relevantDate: formatDate(subscription.renewalDate),
        message: `${subscription.name} subscription is approaching its renewal date.`,
      });
    }
    if (
      daysUntil(subscription.expiryDate, today) >= 0 &&
      daysUntil(subscription.expiryDate, today) <= reminderWindowDays
    ) {
      notifications.push({
        id: `${subscription.id}-expiry`,
        subscriptionName: subscription.name,
        type: "Subscription Expiry",
        relevantDate: formatDate(subscription.expiryDate),
        message: `${subscription.name} subscription is approaching its expiry date.`,
      });
    }
    return notifications;
  });
}

export function getNotifications(subscriptions: Subscription[]) {
  return getReminderNotifications(subscriptions);
}
