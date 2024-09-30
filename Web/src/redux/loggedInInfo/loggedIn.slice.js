import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { loginSelectedUserAsync } from "./loggedIn.async";

const initialState = {
  userInfo: {},
  switchLoader: false,
  swicthData: [],
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(loginSelectedUserAsync.pending), (state) => {
      state.switchLoader = true;
    });

    builder.addMatcher(
      isAnyOf(loginSelectedUserAsync.fulfilled),
      (state, action) => {
        state.switchLoader = false;
        state.swicthData = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(loginSelectedUserAsync.rejected),
      (state, action) => {
        state.switchLoader = false;
      }
    );
  },

  reducers: {
    reduxSetUserLoggedInInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { reduxSetUserLoggedInInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;
