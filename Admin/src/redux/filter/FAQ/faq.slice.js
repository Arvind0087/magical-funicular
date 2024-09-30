import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { filterAllFaqAsync } from "./faq.async";

const initialState = {
  filterFaqLoader: false,
  filterFaq: [],
};

export const FilterFaqSlice = createSlice({
  name: "FilterFaq",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(filterAllFaqAsync.pending), (state) => {
      state.filterFaqLoader = true;
    });
    builder.addMatcher(
      isAnyOf(filterAllFaqAsync.fulfilled),
      (state, action) => {
        state.filterFaqLoader = false;
        state.filterFaq = action.payload;
      }
    );

    builder.addMatcher(isAnyOf(filterAllFaqAsync.rejected), (state, action) => {
      state.filterFaqLoader = false;
    });
  },
  reducers: {
    emptyfilterFaq: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyfilterFaq } = FilterFaqSlice.actions;
export default FilterFaqSlice.reducer;
