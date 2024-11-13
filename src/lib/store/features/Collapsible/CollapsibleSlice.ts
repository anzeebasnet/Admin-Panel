import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Bookingstate {
  collapse: boolean;
}

const initialState: Bookingstate = {
  collapse: true,
}

export const CollapsibleSlice = createSlice({
  name: 'collapsible',
  initialState,
  reducers: {
    toggleSidebar: (state, action: PayloadAction<boolean>) => {
        state.collapse = action.payload;
      }
  },
})

// Action creators are generated for each case reducer function
export const { toggleSidebar } = CollapsibleSlice.actions;

export default CollapsibleSlice.reducer;