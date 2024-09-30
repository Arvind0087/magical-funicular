import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { filterAllDoubtsAsync } from "./doubts.async";

const initialState = {
  filterDoubtsLoader: false,
  filterDoubts: [],
};

export const FilterDoubtsSlice = createSlice({
  name: "FilterDoubts",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(filterAllDoubtsAsync.pending), (state) => {
      state.filterDoubtsLoader = true;
    });
    builder.addMatcher(
      isAnyOf(filterAllDoubtsAsync.fulfilled),
      (state, action) => {
        state.filterDoubtsLoader = false;
        state.filterDoubts = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(filterAllDoubtsAsync.rejected),
      (state, action) => {
        state.filterDoubtsLoader = false;
      }
    );
  },
  reducers: {
    emptyfilterDoubts: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyfilterDoubts } = FilterDoubtsSlice.actions;
export default FilterDoubtsSlice.reducer;
