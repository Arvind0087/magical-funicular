import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addBatchDateAsync,
  getAllBatchDatesAsync,
  getBatchDateByIdAsync,
  updatedBatchDateByIdAsync,
  getBatchDateByBatchTypeIdAsync,
  getMultipleBatchDateAsync,
  getBatchDateStatusAsync,
} from "./batchdate.async";

const initialState = {
  batchdateLoader: false,
  batchdate: [],
  batchdateadd: [],
  batchDateById: [],
  batchDateupdate: [],
  getBatchDateByBatchTypeId: [],
  getMultipleBatchDate: [],
  getBatchDateStatus: [],
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
        updatedBatchDateByIdAsync.pending,
        getBatchDateByBatchTypeIdAsync.pending,
        getMultipleBatchDateAsync.pending,
        getBatchDateStatusAsync.pending,
      ),
      (state) => {
        state.batchdateLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllBatchDatesAsync.fulfilled),
      (state, action) => {
        state.batchdateLoader = false;
        state.batchdate = action.payload;
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
      isAnyOf(getBatchDateByBatchTypeIdAsync.fulfilled),
      (state, action) => {
        state.batchdateLoader = false;
        state.getBatchDateByBatchTypeId = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getMultipleBatchDateAsync.fulfilled),
      (state, action) => {
        state.batchdateLoader = false;
        state.getMultipleBatchDate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchDateStatusAsync.fulfilled),
      (state, action) => {
        state.batchdateLoader = false;
        state.getBatchDateStatus = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllBatchDatesAsync.rejected,
        addBatchDateAsync.rejected,
        getBatchDateByIdAsync.rejected,
        updatedBatchDateByIdAsync.rejected,
        getBatchDateByBatchTypeIdAsync.rejected,
        getMultipleBatchDateAsync.rejected,
        getBatchDateStatusAsync.rejected,
      ),
      (state, action) => {
        state.batchdateLoader = false;
      }
    );
  },
  reducers: {
    emptybatchdate: () => initialState,
  },
});

export const { emptybatchdate } = batchdateSlice.actions;

export default batchdateSlice.reducer;
