import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery.ts";

export interface UserPreferences {
  foodPreferences: string[];
  visitPreferences: string[];
}

export const userPreferencesApi = createApi({
  reducerPath: "userPreferencesApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    submitUserPreferences: builder.mutation<void, UserPreferences>({
      query: (preferences) => ({
        url: "/user-preference",
        method: "POST",
        body: preferences,
      }),
    }),
  }),
});

export const { useSubmitUserPreferencesMutation } = userPreferencesApi;
