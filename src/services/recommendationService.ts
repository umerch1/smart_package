import type { Subscription } from "@/components/SubscriptionCard";

export type Recommendation = {
  id: string;
  title: string;
  explanation: string;
  relatedSubscription?: string;
};

function daysUntil(dateValue: string, today: Date) {
  const date = new Date(`${dateValue}T00:00:00`);
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return Math.ceil((date.getTime() - startOfToday.getTime()) / 86400000);
}

export function generateRecommendations(
  subscriptions: Subscription[],
  today = new Date(),
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  subscriptions.forEach((subscription) => {
    const renewalIn = daysUntil(subscription.renewalDate, today);
    if (renewalIn >= 0 && renewalIn <= 7) {
      recommendations.push({
        id: `${subscription.id}-renewal`,
        title: "Subscription Recommendation",
        explanation:
          "Based on your upcoming renewal pattern, consider reviewing this subscription before it renews.",
        relatedSubscription: subscription.name,
      });
    }
    if (subscription.expiryDate < today.toISOString().slice(0, 10)) {
      recommendations.push({
        id: `${subscription.id}-expired`,
        title: "Subscription Recommendation",
        explanation:
          "This subscription has passed its expiry date. Review its status to keep your subscription list current.",
        relatedSubscription: subscription.name,
      });
    }
  });

  const categoryCounts = subscriptions.reduce<Record<string, number>>(
    (counts, subscription) => ({
      ...counts,
      [subscription.category]: (counts[subscription.category] ?? 0) + 1,
    }),
    {},
  );
  const repeatedCategory = Object.entries(categoryCounts).find(
    ([, count]) => count > 1,
  );
  if (repeatedCategory) {
    recommendations.push({
      id: `category-${repeatedCategory[0]}`,
      title: "Subscription Recommendation",
      explanation: `You have several subscriptions in the ${repeatedCategory[0]} category. Reviewing their renewal dates together may help keep this group organized.`,
    });
  }

  return recommendations;
}

export function getRecommendations(subscriptions: Subscription[]) {
  return generateRecommendations(subscriptions);
}
