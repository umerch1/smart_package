export type SubscriptionHistoryRecord = {
  id: string;
  subscriptionName: string;
  status: "Expired" | "Cancelled" | "Renewed";
  relevantDate: string;
};

export type PaymentHistoryRecord = {
  id: string;
  subscriptionName: string;
  amount: string;
  paymentDate: string;
  paymentStatus: "Paid" | "Failed" | "Refunded";
};

const subscriptionHistory: SubscriptionHistoryRecord[] = [
  {
    id: "gym-membership",
    subscriptionName: "Gym Membership",
    status: "Expired",
    relevantDate: "Jul 15, 2026",
  },
  {
    id: "adobe-creative-cloud",
    subscriptionName: "Adobe Creative Cloud",
    status: "Cancelled",
    relevantDate: "Jun 30, 2026",
  },
];

const paymentHistory: PaymentHistoryRecord[] = [
  {
    id: "netflix-jul",
    subscriptionName: "Netflix",
    amount: "$15.49",
    paymentDate: "Jul 22, 2026",
    paymentStatus: "Paid",
  },
  {
    id: "spotify-jul",
    subscriptionName: "Spotify",
    amount: "$11.99",
    paymentDate: "Jul 31, 2026",
    paymentStatus: "Paid",
  },
  {
    id: "gym-jun",
    subscriptionName: "Gym Membership",
    amount: "$29.00",
    paymentDate: "Jun 15, 2026",
    paymentStatus: "Paid",
  },
];

export function getSubscriptionHistory() {
  return subscriptionHistory;
}

export function getPaymentHistory() {
  return paymentHistory;
}
