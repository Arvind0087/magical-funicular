import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getLiveClassHistoryAsync } from "./history.async";

const initialState = {
  historyLoader: false,
  history: [],
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getLiveClassHistoryAsync.pending), (state) => {
      state.historyLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getLiveClassHistoryAsync.fulfilled),
      (state, action) => {
        state.historyLoader = false;
        state.history = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getLiveClassHistoryAsync.rejected),
      (state, action) => {
        state.historyLoader = false;
      }
    );
  },
  reducers: {
    emptyactivity: (state) => initialState,
  },
});
export const { emptyactivity } = historySlice.actions;

export default historySlice.reducer;
