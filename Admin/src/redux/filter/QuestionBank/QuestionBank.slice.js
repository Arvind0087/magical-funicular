import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { filterAllQuestionBankAsync } from "./QuestionBank.async";

const initialState = {
  filterQuestionBankLoader: false,
  filterQuestionBank: [],
};

export const FilterQuestionBankSlice = createSlice({
  name: "FilterQuestionBank",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(filterAllQuestionBankAsync.pending), (state) => {
      state.filterQuestionBankLoader = true;
    });
    builder.addMatcher(
      isAnyOf(filterAllQuestionBankAsync.fulfilled),
      (state, action) => {
        state.filterQuestionBankLoader = false;
        state.filterQuestionBank = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(filterAllQuestionBankAsync.rejected),
      (state, action) => {
        state.filterQuestionBankLoader = false;
      }
    );
  },
  reducers: {
    emptyfilterQuestionBank: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyfilterQuestionBank } = FilterQuestionBankSlice.actions;
export default FilterQuestionBankSlice.reducer;
