// store/salonServiceSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SalonServices } from "@/types/types";

interface ServiceState {
  currentService: SalonServices | null;
}

const initialState: ServiceState = {
  currentService: null,
};

const salonServiceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    setSalonService: (state, action: PayloadAction<SalonServices>) => {
      state.currentService = action.payload;
    },
    clearSalonService: (state) => {
      state.currentService = null;
    },
  },
});

export const { setSalonService, clearSalonService } = salonServiceSlice.actions;
export default salonServiceSlice.reducer;
