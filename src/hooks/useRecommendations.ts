import { useGetRecommendationsQuery } from "@/services/recommendationApi";

export function useRecommendations() {
  const query = useGetRecommendationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  return {
    ...query,
    recommendations: query.data?.data.recommendations ?? [],
  };
}