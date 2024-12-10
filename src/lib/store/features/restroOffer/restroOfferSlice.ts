// store/restroOfferSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Offer } from "@/types/types";

interface OfferState {
  currentOffer: Offer | null;
}

const initialState: OfferState = {
  currentOffer: null,
};

const restroOfferSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {
    setOfferData: (state, action: PayloadAction<Offer>) => {
      state.currentOffer = action.payload;
    },
    clearOfferData: (state) => {
      state.currentOffer = null;
    },
  },
});

export const { setOfferData, clearOfferData } = restroOfferSlice.actions;
export default restroOfferSlice.reducer;
