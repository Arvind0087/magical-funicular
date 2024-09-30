import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { deactivateUserByIdAsync } from "../async.api";
const initialState = {
  deactivateUserLoader: false,
  deactivateUser:[],
};

export const deactivateUserSlice = createSlice({
  name: "deactivateUser",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(deactivateUserByIdAsync.pending), (state) => {
      state.deactivateUserLoader = true;
    });
    builder.addMatcher(isAnyOf(deactivateUserByIdAsync.fulfilled), (state, action) => {
      state.deactivateUserLoader = false;
      state.deactivateUser = action.payload.data;
    });
    builder.addMatcher(isAnyOf(deactivateUserByIdAsync.rejected), (state, action) => {
      state.deactivateUserLoader = false;
    });
  },
});

export default deactivateUserSlice.reducer;
