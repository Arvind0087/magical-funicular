import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { filterAllActivityAsync } from "./activity.async";

const initialState = {
  filterActivtyLoader: false,
  filterActivity: [],
};

export const FilterActivitySlice = createSlice({
  name: "FilterActivty",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(filterAllActivityAsync.pending), (state) => {
      state.filterActivtyLoader = true;
    });
    builder.addMatcher(
      isAnyOf(filterAllActivityAsync.fulfilled),
      (state, action) => {
        state.filterActivtyLoader = false;
        state.filterActivity = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(filterAllActivityAsync.rejected),
      (state, action) => {
        state.filterActivtyLoader = false;
      }
    );
  },
  reducers: {
    emptyfilterActivty: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyfilterActivity } = FilterActivitySlice.actions;
export default FilterActivitySlice.reducer;
