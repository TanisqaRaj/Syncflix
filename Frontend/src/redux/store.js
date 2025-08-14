// /frontend/src/redux/store.js

import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "./roomSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// 🔒 Persist config for room
const persistConfig = {
  key: "room",
  storage,
};

const persistedRoomReducer = persistReducer(persistConfig, roomReducer);

// 🏪 Create store
const store = configureStore({
  reducer: {
    room: persistedRoomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
