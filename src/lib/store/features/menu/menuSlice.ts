// store/menuSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuItem } from "@/types/types";

interface MenuState {
  currentMenu: MenuItem | null;
}

const initialState: MenuState = {
  currentMenu: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuItem: (state, action: PayloadAction<MenuItem>) => {
      state.currentMenu = action.payload;
    },
    clearMenuItem: (state) => {
      state.currentMenu = null;
    },
  },
});

export const { setMenuItem, clearMenuItem } = menuSlice.actions;
export default menuSlice.reducer;