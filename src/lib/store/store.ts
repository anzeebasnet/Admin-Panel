import { configureStore } from '@reduxjs/toolkit'
import collapsibleReducer from "./features/Collapsible/CollapsibleSlice"
import stationReducer from "./features/station/stationSlice"
import menuReducer from "./features/menu/menuSlice"
import foodItemReducer from "./features/foodItem/foodItemSlice"
import restaurantReducer from "./features/restaurant/restaurantSlice"
import cuisineReducer from "./features/cuisine/CuisineSlice"
import restroFoodItemReducer from "./features/restroItem/restroItemSlice"
import nearbyItemReducer from "./features/nearbyItem/nearbyItemSlice"
import salonDetailSliceReducer from "./features/salonDetailSlice/salonDetailSlice"
import salonServiceSliceReducer from "./features/salonService/salonServiceSlice"
import salonVariationSliceReducer from "./features/salonVariation/salonVariationSlice"
import salonStaffSliceReducer from "./features/salonStaff/salonStaffSlice"
import restroOfferSliceReducer from "./features/restroOffer/restroOfferSlice"

export const makeStore = () => {
    return configureStore({
        reducer: {
          collapsible: collapsibleReducer,
          station: stationReducer,
          menu: menuReducer,
          foodItem: foodItemReducer,
          restaurant: restaurantReducer,
          cuisine: cuisineReducer,
          restroFoodItem: restroFoodItemReducer,
          nearbyItem: nearbyItemReducer,
          salon: salonDetailSliceReducer,
          service: salonServiceSliceReducer,
          variation: salonVariationSliceReducer, 
          staff: salonStaffSliceReducer,
          offer: restroOfferSliceReducer,
        },
      })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']