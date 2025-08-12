import { configureStore } from "@reduxjs/toolkit";
import { vipRestaurantsApi } from "../reducer/vipRestaurantsApi.ts";
import { couponsApi } from "../reducer/couponsApi.ts";
import { receiptsApi } from "../reducer/receiptsApi.ts";
import { notificationsApi } from "../reducer/notificationsApi.ts";
import { userPreferencesApi } from "../reducer/userPreferencesApi.ts";
import { restaurantsApi } from "../reducer/restaurantsApi.ts";
import { userLoyaltyApi } from "../reducer/userLoyaltyApi.ts";

export const store = configureStore({
  reducer: {
    [restaurantsApi.reducerPath]: restaurantsApi.reducer,
    [receiptsApi.reducerPath]: receiptsApi.reducer,
    [couponsApi.reducerPath]: couponsApi.reducer,
    [vipRestaurantsApi.reducerPath]: vipRestaurantsApi.reducer,
    [userPreferencesApi.reducerPath]: userPreferencesApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [userLoyaltyApi.reducerPath]: userLoyaltyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      vipRestaurantsApi.middleware,
      couponsApi.middleware,
      receiptsApi.middleware,
      notificationsApi.middleware,
      userPreferencesApi.middleware,
      restaurantsApi.middleware,
      userLoyaltyApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
