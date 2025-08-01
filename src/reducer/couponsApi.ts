import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery.ts";
import { QUERY_TAGS } from "./tagConstants.ts";

export interface Coupon {
  id?: number;
  name: string;
  points: number;
  restaurantId: number;
}

export const couponsApi = createApi({
  reducerPath: "couponsApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.COUPONS],
  endpoints: (builder) => ({
    getCoupons: builder.query<Coupon[], number | undefined>({
      query: (restaurantId) => `/coupons/user/${restaurantId}`,
      providesTags: [QUERY_TAGS.COUPONS],
    }),
  }),
});

export const { useGetCouponsQuery } = couponsApi;
