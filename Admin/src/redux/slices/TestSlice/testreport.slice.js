import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getallTestReportsAsync,
  getTestReportByIdAsync,
  getTestAttemptedCountAsync,
  getTestReportByCountAsync,

} from "../TestSlice/async.api";

const initialState = {
  testreportLoader: false,
  testreport: [],
  reportById: [],
  testCount : [],
  countTestResult : [],
};

export const testreportSlice = createSlice({
  name: "testreport",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(getallTestReportsAsync.pending,
        getTestReportByIdAsync.pending,
        getTestAttemptedCountAsync.pending,
        getTestReportByCountAsync.pending,
      ),
      (state) => {
        state.testreportLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getallTestReportsAsync.fulfilled),
      (state, action) => {
        state.testreportLoader = false;
        state.testreport = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getTestReportByIdAsync.fulfilled),
      (state, action) => {
        state.testreportLoader = false;
        state.reportById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getTestAttemptedCountAsync.fulfilled),
      (state, action) => {
        state.testreportLoader = false;
        state.testCount = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getTestReportByCountAsync.fulfilled),
      (state, action) => {
        state.testreportLoader = false;
        state.countTestResult = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(getallTestReportsAsync.rejected,
        getTestReportByIdAsync.rejected,
        getTestAttemptedCountAsync.rejected,
        getTestReportByCountAsync.rejected,
      ),
      (state, action) => {
        state.testreportLoader = false;
      }
    );
  },
  reducers: {
    emptyreport: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyreport } = testreportSlice.actions;
export default testreportSlice.reducer;
