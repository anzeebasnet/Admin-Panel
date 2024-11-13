// store/stationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StationData } from "@/types/types";

interface StationState {
  currentStation: StationData | null;
}

const initialState: StationState = {
  currentStation: null,
};

const stationSlice = createSlice({
  name: "station",
  initialState,
  reducers: {
    setStationData: (state, action: PayloadAction<StationData>) => {
      state.currentStation = action.payload;
    },
    clearStationData: (state) => {
      state.currentStation = null;
    },
  },
});

export const { setStationData, clearStationData } = stationSlice.actions;
export default stationSlice.reducer;
