// store/salonDetailSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SalonType } from "@/types/types";

interface SalonState {
  currentSalon: SalonType | null;
}

const initialState: SalonState = {
  currentSalon: null,
};

const salonDetailSlice = createSlice({
  name: "salon",
  initialState,
  reducers: {
    setSalonData: (state, action: PayloadAction<SalonType>) => {
      state.currentSalon = action.payload;
    },
    clearSalonData: (state) => {
      state.currentSalon = null;
    },
  },
});

export const { setSalonData, clearSalonData } = salonDetailSlice.actions;
export default salonDetailSlice.reducer;
