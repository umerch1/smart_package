import { api } from "@/store/api";

export type DashboardData = {
  totalActiveSubscriptions: number;
  activeSubscriptions: number;
  upcomingSubscriptions: number;
  expiredSubscriptions: number;
};

type DashboardResponse = {
  success: boolean;
  message: string;
  data: DashboardData;
};

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => "/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;