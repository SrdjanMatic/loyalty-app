import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery.ts";
import { QUERY_TAGS } from "./tagConstants.ts";
import type { Restaurant } from "./restaurantsSlice";

// Notification model matching your DB structure
export interface Notification {
  id?: string;
  restaurantId: number;
  title: string;
  foodTypes: string[];
  partOfDay: string[];
  validFrom: string;
  validUntil: string;
}

export interface NotificationView {
  id?: string;
  restaurant: Restaurant;
  title: string;
  type: string;
  description?: string;
  foodTypes: string;
  partOfDay: string;
  validFrom: string;
  validUntil: string;
}

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.NOTIFICATIONS],
  endpoints: (builder) => ({
    getAllNotificationsByUser: builder.query<NotificationView[], void>({
      query: () => "/notifications/user",
      providesTags: [QUERY_TAGS.NOTIFICATIONS],
    }),
    getNumberOfUnseenNotifications: builder.query<number, void>({
      query: () => "/notifications/unseen-count",
      providesTags: [QUERY_TAGS.NOTIFICATIONS],
    }),
  }),
});

export const {
  useGetAllNotificationsByUserQuery,
  useGetNumberOfUnseenNotificationsQuery,
} = notificationsApi;
