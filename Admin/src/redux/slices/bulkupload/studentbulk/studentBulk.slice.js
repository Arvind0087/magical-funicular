import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { UploadBulkAsync,getAllBulkFiles } from "./studentBulk.Async";

const initialState = {
  bulkLoader: false,
  bulkUpload: [],
  bulkFiles:[]
};

export const studentBulkSlice = createSlice({
  name: "studentBulk",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(UploadBulkAsync.pending,getAllBulkFiles.pending), (state) => {
      state.bulkLoader = true;
    });

    builder.addMatcher(isAnyOf(UploadBulkAsync.fulfilled), (state, action) => {
      state.bulkLoader = false;
      state.bulkUpload = action.payload;
    });
    builder.addMatcher(isAnyOf(getAllBulkFiles.fulfilled), (state, action) => {
      state.bulkLoader = false;
      state.bulkFiles = action.payload;
    });

    builder.addMatcher(isAnyOf(UploadBulkAsync.rejected), (state, action) => {
      state.bulkLoader = false;
    });
  },
  reducers: {
    emptybulk: (state) => {
      return {
        ...initialState
      };
    }
  }
});
export const { emptybulk } = studentBulkSlice.actions;
export default studentBulkSlice.reducer;
