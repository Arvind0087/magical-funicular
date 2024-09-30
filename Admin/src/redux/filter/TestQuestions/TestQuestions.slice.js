import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getTestQuestionsFilterAsync } from "./TestQuestions.async";

const initialState = {
  testQuestionsFilterLoader: false,
  testQuestionsFilter: [],
};

export const testQuestionsFilterSlice = createSlice({
  name: "TestQuestionsFilter",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(getTestQuestionsFilterAsync.pending),
      (state) => {
        state.testQuestionsFilterLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getTestQuestionsFilterAsync.fulfilled),
      (state, action) => {
        state.testQuestionsFilterLoader = false;
        state.testQuestionsFilter = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getTestQuestionsFilterAsync.rejected),
      (state, action) => {
        state.testQuestionsFilterLoader = false;
      }
    );
  },
  reducers: {
    emptytestQuestionsfilter: () => initialState,
  },
});

export const { emptytestQuestionsfilter } = testQuestionsFilterSlice.actions;

export default testQuestionsFilterSlice.reducer;
