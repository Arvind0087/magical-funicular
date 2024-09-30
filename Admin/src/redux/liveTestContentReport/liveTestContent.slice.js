import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { liveTestContentAsync } from "./liveTestContent.async";

const initialState = {
  liveTestLoader: false,
  liveTestContent: [],
};

export const liveTestContentSlice = createSlice({
  name: "liveTestContent",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(liveTestContentAsync.pending), (state) => {
      state.liveTestLoader = true;
    });
    builder.addMatcher(
      isAnyOf(liveTestContentAsync.fulfilled),
      (state, action) => {
        state.liveTestLoader = false;
        state.liveTestContent = action.payload.data;
      }
    );
    builder.addMatcher(isAnyOf(liveTestContentAsync.rejected), (state, action) => {
      state.liveTestLoader = false;
    });
  },
  reducers: {
    emptyLiveTestContent: (state) => initialState,
  },
});

export const { emptyLiveTestContent } = liveTestContentSlice.actions;

export default liveTestContentSlice.reducer;
