import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { UploadBulkAsync,getAllBulkFiles } from "./topicBulk.Async";

const initialState = {
  bulkLoader: false,
  bulkUpload: [],
  bulkFiles:[]
};

export const topicBulkSlice = createSlice({
  name: "topicBulk",
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
export const { emptybulk } = topicBulkSlice.actions;
export default topicBulkSlice.reducer;
