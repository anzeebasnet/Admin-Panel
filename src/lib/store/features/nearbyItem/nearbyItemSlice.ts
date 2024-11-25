// store/nearbyStationMenuItemSlice.ts
import { NearbyStationMenuItem, RestroFoodItem } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NearbyItemState {
  currentNearbyItem: NearbyStationMenuItem | null;
}

const initialState: NearbyItemState = {
  currentNearbyItem: null,
};

const nearbyStationMenuItemSlice = createSlice({
  name: "nearbyItem",
  initialState,
  reducers: {
    setNearbyItem: (state, action: PayloadAction<NearbyStationMenuItem>) => {
      state.currentNearbyItem = action.payload;
    },
    clearNearbyItem: (state) => {
      state.currentNearbyItem = null;
    },
  },
});

export const { setNearbyItem, clearNearbyItem } = nearbyStationMenuItemSlice.actions;
export default nearbyStationMenuItemSlice.reducer;