import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: !!localStorage.getItem("isAuthenticated"), // Check local storage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
      localStorage.setItem("isAuthenticated", "true"); // Save to local storage
    },
    logout(state) {
      state.isAuthenticated = false;
      localStorage.removeItem("isAuthenticated"); // Remove from local storage
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;



