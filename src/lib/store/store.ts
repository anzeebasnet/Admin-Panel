import { configureStore } from '@reduxjs/toolkit'
import collapsibleReducer from "./features/Collapsible/CollapsibleSlice"
import stationReducer from "./features/station/stationSlice"
import menuReducer from "./features/menu/menuSlice"
import foodItemReducer from "./features/foodItem/foodItemSlice"

export const makeStore = () => {
    return configureStore({
        reducer: {
          collapsible: collapsibleReducer,
          station: stationReducer,
          menu: menuReducer,
          foodItem: foodItemReducer,
        },
      })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']