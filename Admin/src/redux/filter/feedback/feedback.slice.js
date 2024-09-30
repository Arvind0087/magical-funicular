import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getFilterAsync } from "./feedback.async";

const initialState = {
  feedbackLoader: false,
  feedbackFilter: []
};

export const feedbackFilterSlice = createSlice({
  name: "feedback",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getFilterAsync.pending), (state) => {
      state.feedbackLoader = true;
    });
    builder.addMatcher(isAnyOf(getFilterAsync.fulfilled), (state, action) => {
      state.feedbackLoader = false;
      state.feedbackFilter = action.payload.data;
    });
    builder.addMatcher(isAnyOf(getFilterAsync.rejected), (state, action) => {
      state.feedbackLoader = false;
    });
  },
  reducers: {
    emptyfeedback: () => initialState
  }
});

export const { emptyfeedback } = feedbackFilterSlice.actions;

export default feedbackFilterSlice.reducer;
