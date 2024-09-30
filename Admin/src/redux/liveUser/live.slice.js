import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getLiveUserAsync } from "./live.async";

const initialState = {
  liveClassLoader: false,
  liveClassUser: [],
};

export const liveClassUserSlice = createSlice({
  name: "liveClassUser",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getLiveUserAsync.pending), (state) => {
      state.liveClassLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getLiveUserAsync.fulfilled),
      (state, action) => {
        state.liveClassLoader = false;
        state.liveClassUser = action.payload.data;
      }
    );
    builder.addMatcher(isAnyOf(getLiveUserAsync.rejected), (state, action) => {
      state.liveClassLoader = false;
    });
  },
  reducers: {
    emptyLiveClass: (state) => initialState,
  },
});

export const { emptyLiveClass } = liveClassUserSlice.actions;

export default liveClassUserSlice.reducer;
