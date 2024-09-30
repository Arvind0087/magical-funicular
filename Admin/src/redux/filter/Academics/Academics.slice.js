import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { filterAllAcademicsAsync } from "./faq.async";

const initialState = {
  filterAcademicsLoader: false,
  filterAcademics: [],
};

export const FilterFaqSlice = createSlice({
  name: "FilterAcademics",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(filterAllAcademicsAsync.pending), (state) => {
      state.filterAcademicsLoader = true;
    });
    builder.addMatcher(
      isAnyOf(filterAllAcademicsAsync.fulfilled),
      (state, action) => {
        state.filterAcademicsLoader = false;
        state.filterAcademics = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(filterAllAcademicsAsync.rejected),
      (state, action) => {
        state.filterAcademicsLoader = false;
      }
    );
  },
  reducers: {
    emptyfilterAcademics: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyfilterAcademics } = FilterAcademicsSlice.actions;
export default FilterAcademicsSlice.reducer;
