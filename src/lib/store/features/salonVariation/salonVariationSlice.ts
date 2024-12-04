// store/salonServiceSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SalonVariation } from "@/types/types";

interface VariationState {
  currentVariation: SalonVariation | null;
}

const initialState: VariationState = {
  currentVariation: null,
};

const SalonVariationSlice = createSlice({
  name: "variation",
  initialState,
  reducers: {
    setSalonVariation: (state, action: PayloadAction<SalonVariation>) => {
      state.currentVariation = action.payload;
    },
    clearSalonVariation: (state) => {
      state.currentVariation = null;
    },
  },
});

export const { setSalonVariation, clearSalonVariation } = SalonVariationSlice.actions;
export default SalonVariationSlice.reducer;
