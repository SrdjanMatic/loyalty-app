import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery.ts";
import { QUERY_TAGS } from "./tagConstants.ts";

export interface Receipt {
  id: number;
  date: string;
  amount: number;
  // Add other fields as needed
}

export interface GameDTO {
  receiptKey: string;
  gamePoints: number;
  challengeId: number;
}

export const receiptsApi = createApi({
  reducerPath: "receiptsApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.RECEIPTS],
  endpoints: (builder) => ({
    getReceipts: builder.query<Receipt[], number>({
      query: (restaurantId) => ({
        url: `/receipt`,
        params: { restaurantId },
      }),
      providesTags: [QUERY_TAGS.RECEIPTS],
    }),
    addGamePoints: builder.mutation<any, GameDTO>({
      query: (gameDTO) => ({
        url: "/receipt/game-points",
        method: "POST",
        body: gameDTO,
      }),
      invalidatesTags: [QUERY_TAGS.RECEIPTS],
    }),
  }),
});

export const { useGetReceiptsQuery, useAddGamePointsMutation } = receiptsApi;
