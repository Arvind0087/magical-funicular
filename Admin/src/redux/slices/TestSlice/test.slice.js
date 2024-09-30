import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllTestAsync,
  createTestAsync,
  deleteTestByIdAsync,
  getTestByIdAsync,
  getStudentTestReportGraphAsync
} from "../TestSlice/async.api";

const initialState = {
  testLoader: false,
  tests: [],
  createTest: [],
  testdelete: [],
  getTestById: [],
  getStudentTestReportGraph: [],
};

export const testSlice = createSlice({
  name: "tests",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllTestAsync.pending,
        createTestAsync.pending,
        deleteTestByIdAsync.pending,
        getTestByIdAsync.pending,
        getStudentTestReportGraphAsync.pending,
      ),
      (state) => {
        state.testLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getAllTestAsync.fulfilled), (state, action) => {
      state.testLoader = false;
      state.tests = action.payload;
    });

    builder.addMatcher(isAnyOf(createTestAsync.fulfilled), (state, action) => {
      state.testLoader = false;
      state.createTest = action.payload;
    });

    builder.addMatcher(
      isAnyOf(deleteTestByIdAsync.fulfilled),
      (state, action) => {
        state.testLoader = false;
        state.testdelete = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(getTestByIdAsync.fulfilled), (state, action) => {
      state.testLoader = false;
      state.getTestById = action.payload;
    });
    builder.addMatcher(isAnyOf(getStudentTestReportGraphAsync.fulfilled), (state, action) => {
      state.testLoader = false;
      state.getStudentTestReportGraph = action.payload;
    });
    builder.addMatcher(
      isAnyOf(
        getAllTestAsync.rejected,
        createTestAsync.rejected,
        deleteTestByIdAsync.rejected,
        getTestByIdAsync.rejected,
        getStudentTestReportGraphAsync.rejected,
      ),
      (state, action) => {
        state.testLoader = false;
      }
    );
  },
  reducers: {
    emptytests: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptytests } = testSlice.actions;
export default testSlice.reducer;
