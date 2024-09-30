import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addBatchDateAsync,
  getAllBatchDatesAsync,
  getBatchDateByIdAsync,
  updatedBatchDateByIdAsync,
} from "../async.api";

const initialState = {
  batchdateLoader: false,
  batchdate: [],
  batchdateadd: [],
  batchDateById: [],
  batchDateupdate: [],
};

export const batchdateSlice = createSlice({
  name: "batchdate",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllBatchDatesAsync.pending,
        addBatchDateAsync.pending,
        getBatchDateByIdAsync.pending,
        updatedBatchDateByIdAsync.pending
      ),
      (state) => {
        state.batchdateLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllBatchDatesAsync.fulfilled),
      (state, action) => {
        state.batchdateLoader = false;
        state.batchdate = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(addBatchDateAsync.fulfilled),
      (state, action) => {
        state.batchdateLoader = false;
        state.batchdateadd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchDateByIdAsync.fulfilled),
      (state, action) => {
        state.batchdateLoader = false;
        state.batchDateById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updatedBatchDateByIdAsync.fulfilled),
      (state, action) => {
        state.batchdateLoader = false;
        state.batchDateupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllBatchDatesAsync.rejected,
        addBatchDateAsync.rejected,
        getBatchDateByIdAsync.rejected,
        updatedBatchDateByIdAsync.rejected
      ),
      (state, action) => {
        state.batchdateLoader = false;
      }
    );
  },
  reducers: {
    emptybatchdate: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptybatchdate } = batchdateSlice.actions;

export default batchdateSlice.reducer;
