import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types";
import { RootState } from "../store";

export type AuthState = {
  user: null | User;
  accessToken: null | string;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCreds: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    removeCreds: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

// Action creators are generated for each  reducer function
export const { setCreds, removeCreds } = authSlice.actions;

export const selectIsLoggedIn = (state: RootState) => state.auth.user !== null;
export default authSlice.reducer;
