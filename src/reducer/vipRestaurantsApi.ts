import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery.ts";
import { QUERY_TAGS } from "./tagConstants.ts";

export interface RestaurantView {
  id: number;
  name: string;
}

export interface VipRestaurant {
  id: number;
  restaurantName: string;
  generalDiscount: number;
  backgroundImage: string;
  levelDiscount: number;
  level: string;
}

export const vipRestaurantsApi = createApi({
  reducerPath: "vipRestaurantsApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.VIP_RESTAURANTS],
  endpoints: (builder) => ({
    getVipRestaurants: builder.query<VipRestaurant[], void>({
      query: () => "/vip-restaurants/user",
      providesTags: [QUERY_TAGS.VIP_RESTAURANTS],
    }),
  }),
});

export const { useGetVipRestaurantsQuery } = vipRestaurantsApi;
