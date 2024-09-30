import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getTestReportFilterAsync } from "./TestReport.async";

const initialState = {
  testReportFilterLoader: false,
  testReportFilter: [],
};

export const testReportFilterSlice = createSlice({
  name: "TestReportFilter",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getTestReportFilterAsync.pending), (state) => {
      state.testReportFilterLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getTestReportFilterAsync.fulfilled),
      (state, action) => {
        state.testReportFilterLoader = false;
        state.testReportFilter = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getTestReportFilterAsync.rejected),
      (state, action) => {
        state.testReportFilterLoader = false;
      }
    );
  },
  reducers: {
    emptytestReportfilter: () => initialState,
  },
});

export const { emptytestReportfilter } = testReportFilterSlice.actions;

export default testReportFilterSlice.reducer;
