import { useEffect, useState } from 'react';

import { useSubscriptions } from '@/components/SubscriptionCard';
import { getRecommendations, type Recommendation } from '@/services/recommendationService';

export function useRecommendations() {
  const subscriptions = useSubscriptions();
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => getRecommendations(subscriptions));

  useEffect(() => {
    setRecommendations(getRecommendations(subscriptions));
  }, [subscriptions]);

  return { recommendations, refresh: () => setRecommendations(getRecommendations(subscriptions)) };
}