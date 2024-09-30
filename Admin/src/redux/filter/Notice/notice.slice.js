import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { filterAllNoticeAsync } from "./notice.async";

const initialState = {
  filterNoticeLoader: false,
  filterNotice: [],
};

export const FilterNoticeSlice = createSlice({
  name: "FilterNotice",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(filterAllNoticeAsync.pending), (state) => {
      state.filterNoticeLoader = true;
    });
    builder.addMatcher(
      isAnyOf(filterAllNoticeAsync.fulfilled),
      (state, action) => {
        state.filterNoticeLoader = false;
        state.filterNotice = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(filterAllNoticeAsync.rejected),
      (state, action) => {
        state.filterNoticeLoader = false;
      }
    );
  },
  reducers: {
    emptyfilterNotice: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyfilterNotice } = FilterNoticeSlice.actions;
export default FilterNoticeSlice.reducer;
