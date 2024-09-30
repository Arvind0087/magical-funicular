import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllActivityAsync } from "./activity.async";

const initialState = {
  activityLoader: false,
  activity: [],
};

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllActivityAsync.pending), (state) => {
      state.activityLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllActivityAsync.fulfilled),
      (state, action) => {
        state.activityLoader = false;
        state.activity = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllActivityAsync.rejected),
      (state, action) => {
        state.activityLoader = false;
      }
    );
  },
  reducers: {
    emptyactivity: (state) => initialState,
  },
});
export const { emptyactivity } = activitySlice.actions;
export default activitySlice.reducer;
