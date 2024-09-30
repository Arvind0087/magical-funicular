import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { createFeedbackAsync } from "../async.api";

const initialState = {
  feedbackLoader: false,
  feedbackadd: [],
};

export const createFeedbackSlice = createSlice({
  name: "createFeedback",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(createFeedbackAsync.pending), (state) => {
      state.feedbackLoader = true;
    });
    builder.addMatcher(isAnyOf(createFeedbackAsync.fulfilled), (state, action) => {
      state.feedbackLoader = false;
      state.feedbackadd = action.payload;
    });
    builder.addMatcher(isAnyOf(createFeedbackAsync.rejected), (state, action) => {
      state.feedbackLoader = false;
    });
  },
  reducers: {
    emptyfeedback: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyfeedback } = createFeedbackSlice.actions;

export default createFeedbackSlice.reducer;
