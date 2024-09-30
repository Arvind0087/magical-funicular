import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { filterAllScholorshipAsync } from "./scholorship.async";

const initialState = {
  filterScholorshipLoader: false,
  filterScholorship: [],
};

export const FilterScholorshipSlice = createSlice({
  name: "FilterScholorship",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(filterAllScholorshipAsync.pending), (state) => {
      state.filterScholorshipLoader = true;
    });
    builder.addMatcher(
      isAnyOf(filterAllScholorshipAsync.fulfilled),
      (state, action) => {
        state.filterScholorshipLoader = false;
        state.filterScholorship = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(filterAllScholorshipAsync.rejected),
      (state, action) => {
        state.filterScholorshipLoader = false;
      }
    );
  },
  reducers: {
    emptyfilterFaq: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyfilterScholorship } = FilterScholorshipSlice.actions;
export default FilterScholorshipSlice.reducer;
