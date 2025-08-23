import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './roomSlice';
import authReducer from './authSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'syncflix',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    room: roomReducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false, // we’ll keep peers in refs anyway
    }),
})

export const persistor = persistStore(store);
export default store;







