import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../keycloak/interceptors.ts";

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
  id?: number;
  period: number;
  visitsRequired: number;
  visitsCompleted: number;
}

interface RestaurantsState {
  items: Restaurant[];
  restaurantsUserLoyalty: RestaurantWithUserLoyalty[];
  configData: RestaurantConfigData | null;
  restaurantChallenges: Challenge[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RestaurantsState = {
  items: [],
  restaurantsUserLoyalty: [],
  restaurantChallenges: null,
  configData: null,
  status: "idle",
  error: null,
};

export const fetchRestaurants = createAsyncThunk<Restaurant[]>(
  "restaurants/fetchRestaurants",
  async () => {
    const response = api.get<Restaurant[]>("/restaurants");
    return response.then((res) => res.data);
  }
);

export const fetchRestaurantsWithUserLoyalty = createAsyncThunk<
  RestaurantWithUserLoyalty[]
>("restaurants/fetchRestaurantsWithUserLoyalty", async () => {
  const response = api.get<RestaurantWithUserLoyalty[]>(
    "/restaurants/userLoyalty"
  );
  return response.then((res) => res.data);
});

export const getRestaurantConfigData = createAsyncThunk<
  RestaurantConfigData,
  number | undefined
>(
  "restaurants/getRestaurantConfigData",
  async (restaurantId: number | undefined) => {
    const response = api.get<RestaurantConfigData>(
      `/restaurants/config-data/${restaurantId}`
    );
    return response.then((res) => res.data);
  }
);

export const getRestaurantChallenge = createAsyncThunk<
  Challenge[],
  number | undefined
>("receipts/getRestaurantChallenge", async (restaurantId) => {
  const response = api.get<Challenge[]>(
    `/restaurant-configs/restaurant-challenge/${restaurantId}/user`
  );
  return response.then((res) => res.data);
});

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchRestaurants.fulfilled,
        (state, action: PayloadAction<Restaurant[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(fetchRestaurantsWithUserLoyalty.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchRestaurantsWithUserLoyalty.fulfilled,
        (state, action: PayloadAction<RestaurantWithUserLoyalty[]>) => {
          state.status = "succeeded";
          state.restaurantsUserLoyalty = action.payload;
        }
      )
      .addCase(fetchRestaurantsWithUserLoyalty.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getRestaurantConfigData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getRestaurantConfigData.fulfilled,
        (state, action: PayloadAction<RestaurantConfigData>) => {
          state.status = "succeeded";
          state.configData = action.payload;
        }
      )
      .addCase(getRestaurantConfigData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getRestaurantChallenge.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getRestaurantChallenge.fulfilled,
        (state, action: PayloadAction<Challenge[]>) => {
          state.status = "succeeded";
          state.restaurantChallenges = action.payload;
        }
      )
      .addCase(getRestaurantChallenge.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default restaurantsSlice.reducer;
