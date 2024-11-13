// store/menuSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FoodItem } from "@/types/types";

interface FoodItemState {
  currentFoodItems: FoodItem | null;
}

const initialState: FoodItemState = {
  currentFoodItems: null,
};

const foodItemSlice = createSlice({
  name: "foodItem",
  initialState,
  reducers: {
    setFoodItem: (state, action: PayloadAction<FoodItem>) => {
      state.currentFoodItems = action.payload;
    },
    clearFoodItem: (state) => {
      state.currentFoodItems = null;
    },
  },
});

export const { setFoodItem, clearFoodItem } = foodItemSlice.actions;
export default foodItemSlice.reducer;