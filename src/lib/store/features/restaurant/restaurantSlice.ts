// store/restaurantSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RestroDetail } from "@/types/types";

interface RestroState {
  currentRestro: RestroDetail | null;
}

const initialState: RestroState = {
  currentRestro: null,
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestroData: (state, action: PayloadAction<RestroDetail>) => {
      state.currentRestro = action.payload;
    },
    clearRestroData: (state) => {
      state.currentRestro = null;
    },
  },
});

export const { setRestroData, clearRestroData } = restaurantSlice.actions;
export default restaurantSlice.reducer;
