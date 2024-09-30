import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getOnlySiteSettingAsync } from "../async.api";

const initialState = {
    getOnlySiteSettingLoader: false,
    getOnlySiteSettingData: [],
};

export const getOnlySiteSettingSlice = createSlice({
  name: "getOnlySiteSetting",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getOnlySiteSettingAsync.pending), (state) => {
      state.getOnlySiteSettingLoader = true;
      state.getOnlySiteSettingData = [];
    });
    builder.addMatcher(
      isAnyOf(getOnlySiteSettingAsync.fulfilled),
      (state, action) => {
        state.getOnlySiteSettingLoader = false;
        state.getOnlySiteSettingData = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(getOnlySiteSettingAsync.rejected),
      (state, action) => {
        state.getOnlySiteSettingLoader = false;
        state.getOnlySiteSettingData = [];
      }
    );
  },
});

export default getOnlySiteSettingSlice.reducer;
