import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery.ts";
import { QUERY_TAGS } from "./tagConstants.ts";

export interface UserLoyalty {
  userId: string;
  restaurantId: number;
  availablePoints: number;
  totalPoints: number;
  joinedAt: Date;
  active: boolean;
  level: string; // Optional field for user loyalty level
}

export const userLoyaltyApi = createApi({
  reducerPath: "userLoyaltyApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.USER_LOYALTY],
  endpoints: (builder) => ({
    getUserLoyalty: builder.query<UserLoyalty, number>({
      query: (restaurantId) => ({
        url: `/user-loyalty`,
        params: { restaurantId },
      }),
      providesTags: [QUERY_TAGS.USER_LOYALTY],
    }),
    createUserLoyalty: builder.mutation<UserLoyalty, number>({
      query: (restaurantId) => ({
        url: "/user-loyalty",
        method: "POST",
        body: { restaurantId },
      }),
      invalidatesTags: [QUERY_TAGS.USER_LOYALTY],
    }),
    promoteUserLoyalty: builder.mutation<UserLoyalty, number>({
      query: (restaurantId) => ({
        url: `/user-loyalty/promote-user`,
        method: "POST",
        params: { restaurantId },
      }),
      invalidatesTags: [QUERY_TAGS.USER_LOYALTY],
    }),
  }),
});

export const {
  useGetUserLoyaltyQuery,
  useCreateUserLoyaltyMutation,
  usePromoteUserLoyaltyMutation,
} = userLoyaltyApi;
