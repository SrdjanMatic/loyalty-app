import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery.ts";
import { QUERY_TAGS } from "./tagConstants.ts";

// Interfaces
export interface Restaurant {
  id?: number;
  name: string;
  address: string;
  phone: string;
  active?: boolean;
}

export interface RestaurantWithUserLoyalty extends Restaurant {
  availablePoints: number;
  totalPoints: number;
  joinedAt: Date;
}

export interface RestaurantConfigData {
  premiumCouponLimit: number;
  vipCouponLimit: number;
}

export interface Challenge {
  id: any;
  period: number;
  visitsRequired: number;
  visitsCompleted: number;
}

export const restaurantsApi = createApi({
  reducerPath: "restaurantsApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.RESTAURANTS],
  endpoints: (builder) => ({
    getRestaurants: builder.query<Restaurant[], void>({
      query: () => "/restaurants",
      providesTags: [QUERY_TAGS.RESTAURANTS],
    }),
    getRestaurantsWithUserLoyalty: builder.query<
      RestaurantWithUserLoyalty[],
      void
    >({
      query: () => "/restaurants/userLoyalty",
      providesTags: [QUERY_TAGS.RESTAURANTS],
    }),
    getRestaurantConfigData: builder.query<any, number | undefined>({
      query: (restaurantId) => `/restaurants/config-data/${restaurantId}`,
      providesTags: [QUERY_TAGS.RESTAURANTS],
    }),
    getRestaurantChallenge: builder.query<Challenge[], number | undefined>({
      query: (restaurantId) =>
        `/restaurant-configs/restaurant-challenge/${restaurantId}/user`,
      providesTags: [QUERY_TAGS.RESTAURANTS],
    }),
  }),
});

export const {
  useGetRestaurantsQuery,
  useGetRestaurantsWithUserLoyaltyQuery,
  useGetRestaurantConfigDataQuery,
  useGetRestaurantChallengeQuery,
} = restaurantsApi;
