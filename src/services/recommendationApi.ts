import { api } from "@/store/api";

export type ApiRecommendation = {
  id: string;
  title: string;
  explanation: string;
  relatedSubscription: string;
};

type RecommendationsResponse = {
  success: boolean;
  message: string;
  data: { recommendations: ApiRecommendation[] };
};

export const recommendationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendations: builder.query<RecommendationsResponse, void>({
      query: () => "/recommendations",
      providesTags: ["Recommendations"],
    }),
  }),
});

export const { useGetRecommendationsQuery } = recommendationApi;