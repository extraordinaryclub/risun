// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // import the auth slice

const store = configureStore({
  reducer: {
    auth: authReducer, // add auth slice to the store
  },
});

export default store;
