import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getFilterAsync } from "./banner.async";

const initialState = {
  bannerLoader: false,
  bannerFilter: []
};

export const bannerFilterSlice = createSlice({
  name: "banner",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getFilterAsync.pending), (state) => {
      state.bannerLoader = true;
    });
    builder.addMatcher(isAnyOf(getFilterAsync.fulfilled), (state, action) => {
      state.bannerLoader = false;
      state.bannerFilter = action.payload.data;
    });
    builder.addMatcher(isAnyOf(getFilterAsync.rejected), (state, action) => {
      state.bannerLoader = false;
    });
  },
  reducers: {
    emptybanner: () => initialState
  }
});

export const { emptybanner } = bannerFilterSlice.actions;

export default bannerFilterSlice.reducer;
