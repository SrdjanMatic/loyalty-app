import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../keycloak/interceptors.ts";

export interface UserLoyalty {
  userId: string;
  restaurantId: number;
  availablePoints: number;
  totalPoints: number;
  joinedAt: Date;
  active: boolean;
}

interface UserLoyaltyState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  data: UserLoyalty | null;
}

const initialState: UserLoyaltyState = {
  status: "idle",
  error: null,
  data: null,
};

export const createUserLoyalty = createAsyncThunk(
  "userLoyalty/createUserLoyalty",
  async (restaurantId: number, { rejectWithValue }) => {
    try {
      const response = await api.post("/user-loyalty", { restaurantId });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create user loyalty"
      );
    }
  }
);

export const fetchUserLoyalty = createAsyncThunk<
  UserLoyalty,
  number | undefined
>("coupons/fetchUserLoyalty", async (restaurantId: number | undefined) => {
  const response = await api.get<UserLoyalty>(`/user-loyalty/${restaurantId}`);
  return response.data;
});

export const promoteUserLoyalty = createAsyncThunk<UserLoyalty, number>(
  "coupons/promoteUserLoyalty",
  async (restaurantId: number) => {
    const response = await api.post<UserLoyalty>(
      `/user-loyalty/promote-user/${restaurantId}`
    );
    return response.data;
  }
);

const userLoyaltySlice = createSlice({
  name: "userLoyalty",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUserLoyalty.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createUserLoyalty.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(createUserLoyalty.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchUserLoyalty.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserLoyalty.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUserLoyalty.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(promoteUserLoyalty.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(promoteUserLoyalty.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(promoteUserLoyalty.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default userLoyaltySlice.reducer;
