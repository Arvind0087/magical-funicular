import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import { getAllMobileAsync, updateWebByIdAsync } from "./WebAsync.api";

const initialState = {
  mobileLoader: false,
  mobile: [],
  updatemobile: [],
};

export const MobileSlice = createSlice({
  name: "mobile",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(getAllMobileAsync.pending, updateWebByIdAsync.pending),
      (state) => {
        state.mobileLoader = true;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllMobileAsync.fulfilled),
      (state, action) => {
        state.mobileLoader = false;
        state.mobile = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateWebByIdAsync.fulfilled),
      (state, action) => {
        state.mobileLoader = false;
        state.updatemobile = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllMobileAsync.rejected, updateWebByIdAsync.rejected),
      (state, action) => {
        state.mobileLoader = false;
      }
    );
  },
  reducers: {
    emptymobile: (state) => {
      state.updatemobile = [];
    },
  },
});

export const { emptymobile } = MobileSlice.actions;

export default MobileSlice.reducer;
