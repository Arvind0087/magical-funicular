import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { userActivationAsync } from "./dashboard.async";

const initialState = {
  activatedLoader: false,
  activated: [],
};

export const dashboardSlice = createSlice({
  name: "register",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(userActivationAsync.pending), (state) => {
      state.activatedLoader = true;
    });

    builder.addMatcher(
      isAnyOf(userActivationAsync.fulfilled),
      (state, action) => {
        state.activatedLoader = false;
        state.activated = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(userActivationAsync.rejected),
      (state, action) => {
        state.activatedLoader = false;
      }
    );
  },
});

export default dashboardSlice.reducer;
