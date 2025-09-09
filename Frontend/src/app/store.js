// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import authReducer from "../redux/authSlice";
import bookingReducer from "../redux/bookingSlice";
import vehicleReducer from "../redux/vehicleSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // persist only the auth slice
};

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
  vehicle: vehicleReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
