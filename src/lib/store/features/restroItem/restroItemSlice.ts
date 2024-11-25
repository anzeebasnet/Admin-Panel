// store/restroItemSlice.ts
import { RestroFoodItem } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RestroItemState {
  currentRestroItem: RestroFoodItem | null;
}

const initialState: RestroItemState = {
  currentRestroItem: null,
};

const restroItemSlice = createSlice({
  name: "restroitem",
  initialState,
  reducers: {
    setRestroItem: (state, action: PayloadAction<RestroFoodItem>) => {
      state.currentRestroItem = action.payload;
    },
    clearRestroItem: (state) => {
      state.currentRestroItem = null;
    },
  },
});

export const { setRestroItem, clearRestroItem } = restroItemSlice.actions;
export default restroItemSlice.reducer;