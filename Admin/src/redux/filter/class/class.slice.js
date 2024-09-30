import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getFilterAsync,
  getClassWithBatchFilterAsync,
} from "./class.async";

const initialState = {
  classLoader: false,
  classFilter: [],
  classWithBatchFilter: [],
};

export const classFilterSlice = createSlice({
  name: "class",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(
      getFilterAsync.pending,
      getClassWithBatchFilterAsync.pending,
    ), (state) => {
      state.subjectLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getFilterAsync.fulfilled),
      (state, action) => {
        state.classLoader = false;
        state.classFilter = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getClassWithBatchFilterAsync.fulfilled),
      (state, action) => {
        state.classLoader = false;
        state.classWithBatchFilter = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getFilterAsync.rejected,
        getClassWithBatchFilterAsync.rejected,
      ),
      (state, action) => {
        state.classLoader = false;
      }
    );
  },
  reducers: {
    emptyclass: () => initialState
  }
});

export const { emptyclass } = classFilterSlice.actions;

export default classFilterSlice.reducer;
