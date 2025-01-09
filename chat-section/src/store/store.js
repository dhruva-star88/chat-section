import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

// Create and export the store
export const store = configureStore({
  reducer: {
    user: userReducer, // Add the user reducer here
  },
});