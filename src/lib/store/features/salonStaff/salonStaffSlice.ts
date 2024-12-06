// store/salonServiceSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SalonStaff } from "@/types/types";

interface StaffState {
  currentStaff: SalonStaff | null;
}

const initialState: StaffState = {
  currentStaff: null,
};

const SalonStaffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setSalonStaff: (state, action: PayloadAction<SalonStaff>) => {
      state.currentStaff = action.payload;
    },
    clearSalonStaff: (state) => {
      state.currentStaff = null;
    },
  },
});

export const { setSalonStaff, clearSalonStaff } = SalonStaffSlice.actions;
export default SalonStaffSlice.reducer;
