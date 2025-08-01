import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery.ts";
import { QUERY_TAGS } from "./tagConstants.ts";

export interface VipRestaurant {
  id: number;
  restaurantId: number;
  discount: string;
  backgroundImage: string;
}

export const vipRestaurantsApi = createApi({
  reducerPath: "vipRestaurantsApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.VIP_RESTAURANTS],
  endpoints: (builder) => ({
    getVipRestaurants: builder.query<VipRestaurant[], void>({
      query: () => "/vip-restaurants",
      providesTags: [QUERY_TAGS.VIP_RESTAURANTS],
    }),
  }),
});

export const { useGetVipRestaurantsQuery } = vipRestaurantsApi;
