// store/CuisineSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cuisine } from "@/types/types";

interface CuisineState {
  currentCuisine: Cuisine | null;
}

const initialState: CuisineState = {
  currentCuisine: null,
};

const CuisineSlice = createSlice({
  name: "cuisine",
  initialState,
  reducers: {
    setCuisineItem: (state, action: PayloadAction<Cuisine>) => {
      state.currentCuisine = action.payload;
    },
    clearCuisineItem: (state) => {
      state.currentCuisine = null;
    },
  },
});

export const { setCuisineItem, clearCuisineItem } = CuisineSlice.actions;
export default CuisineSlice.reducer;