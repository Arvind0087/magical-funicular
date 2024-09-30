import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createbatchTypesAsync,
  getAllBatchTypes,
  getBatchByCourseBoardClassAsync,
  getBatchTypeByIdAsync,
  updatedBatchTypeByIdAsync,
} from "../async.api";

const initialState = {
  batchLoader: false,
  batches: [],
  batchadd: [],
  batchById: [],
  batchupdate: [],
  batchByCourseBoardClass: [],
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
        getBatchByCourseBoardClassAsync.pending
      ),
      (state) => {
        state.batchLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getAllBatchTypes.fulfilled), (state, action) => {
      state.batchLoader = false;
      state.batches = action.payload.data;
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
      isAnyOf(
        getAllBatchTypes.rejected,
        createbatchTypesAsync.rejected,
        getBatchTypeByIdAsync.rejected,
        updatedBatchTypeByIdAsync.rejected,
        getBatchByCourseBoardClassAsync.rejected
      ),
      (state, action) => {
        state.batchLoader = false;
      }
    );
  },
  reducers: {
    emptybatch: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptybatch } = batchSlice.actions;

export default batchSlice.reducer;
