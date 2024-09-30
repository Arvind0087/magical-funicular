import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createbatchTypesAsync,
  getAllBatchTypes,
  getBatchByCourseBoardClassAsync,
  getBatchTypeByIdAsync,
  getMultipleBatchByMultiClassAsync,
  getbatchclassByboardIdAsync,
  updatedBatchTypeByIdAsync,
  getBatchByBoardIdAsync,
  getBatchStatusAsync,
} from "./batchtype.async";

const initialState = {
  batchLoader: false,
  batches: [],
  batchadd: [],
  batchById: [],
  batchupdate: [],
  batchByCourseBoardClass: [],
  batchByMultiClass: [],
  batchclassByBoardId: [],
  getBatchByBoardId: [],
  getBatchStatus: []
};

export const batchSlice = createSlice({
  name: "batch",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllBatchTypes.pending,
        createbatchTypesAsync.pending,
        getBatchTypeByIdAsync.pending,
        updatedBatchTypeByIdAsync.pending,
        getBatchByCourseBoardClassAsync.pending,
        getMultipleBatchByMultiClassAsync.pending,
        getbatchclassByboardIdAsync.pending,
        getBatchByBoardIdAsync.pending,
        getBatchStatusAsync.pending,
      ),
      (state) => {
        state.batchLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getAllBatchTypes.fulfilled), (state, action) => {
      state.batchLoader = false;
      state.batches = action.payload;
    });
    builder.addMatcher(
      isAnyOf(createbatchTypesAsync.fulfilled),
      (state, action) => {
        state.batchLoader = false;
        state.batchadd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchTypeByIdAsync.fulfilled),
      (state, action) => {
        state.batchLoader = false;
        state.batchById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updatedBatchTypeByIdAsync.fulfilled),
      (state, action) => {
        state.batchLoader = false;
        state.batchupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchByCourseBoardClassAsync.fulfilled),
      (state, action) => {
        state.batchLoader = false;
        state.batchByCourseBoardClass = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getMultipleBatchByMultiClassAsync.fulfilled),
      (state, action) => {
        state.batchLoader = false;
        state.batchByMultiClass = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getbatchclassByboardIdAsync.fulfilled),
      (state, action) => {
        state.batchLoader = false;
        state.batchclassByBoardId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchByBoardIdAsync.fulfilled),
      (state, action) => {
        state.batchLoader = false;
        state.getBatchByBoardId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchStatusAsync.fulfilled),
      (state, action) => {
        state.batchLoader = false;
        state.getBatchStatus = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllBatchTypes.rejected,
        createbatchTypesAsync.rejected,
        getBatchTypeByIdAsync.rejected,
        updatedBatchTypeByIdAsync.rejected,
        getBatchByCourseBoardClassAsync.rejected,
        getMultipleBatchByMultiClassAsync.rejected,
        getbatchclassByboardIdAsync.rejected,
        getBatchByBoardIdAsync.rejected,
        getBatchStatusAsync.rejected,
      ),
      (state, action) => {
        state.batchLoader = false;
      }
    );
  },
  reducers: {
    emptybatch: () => initialState,
  },
});

export const { emptybatch } = batchSlice.actions;

export default batchSlice.reducer;
