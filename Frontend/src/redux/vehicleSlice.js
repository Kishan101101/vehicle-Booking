import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// Fetch available vehicles (customer search)
export const fetchAvailableVehicles = createAsyncThunk(
  "vehicle/fetchAvailableVehicles",
  async ({ from, to }, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/vehicles/available?from=${from}&to=${to}`
      );
      return res.data.vehicles;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load available vehicles");
    }
  }
);

// Fetch vehicles added by owner
export const fetchMyVehicles = createAsyncThunk(
  "vehicle/fetchMyVehicles",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/vehicles/mine");
      return res.data.vehicles;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load your vehicles");
    }
  }
);

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState: {
    available: [],
    owned: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.available = action.payload;
      })
      .addCase(fetchAvailableVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.owned = action.payload;
      })
      .addCase(fetchMyVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default vehicleSlice.reducer;
