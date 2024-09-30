import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import { getAllWebAsync, updateWebByIdAsync } from "./WebAsync.api";

const initialState = {
  webLoader: false,
  web: [],
  updateweb: []
};

export const WebSlice = createSlice({
  name: "web",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(getAllWebAsync.pending, updateWebByIdAsync.pending),
      (state) => {
        state.webLoader = true;
      }
    );

    builder.addMatcher(isAnyOf(getAllWebAsync.fulfilled), (state, action) => {
      state.webLoader = false;
      state.web = action.payload.data;
    });

    builder.addMatcher(
      isAnyOf(updateWebByIdAsync.fulfilled),
      (state, action) => {
        state.webLoader = false;
        state.updateweb = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllWebAsync.rejected, updateWebByIdAsync.rejected),
      (state, action) => {
        state.webLoader = false;
      }
    );
  },
  reducers: {
    emptyweb: (state) => {
      state.updateweb = [];
    }
  }
});

export const { emptyweb } = WebSlice.actions;

export default WebSlice.reducer;
