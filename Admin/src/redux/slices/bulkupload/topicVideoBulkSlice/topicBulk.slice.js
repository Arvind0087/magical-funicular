import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllBulkContentFiles, UploadBulkContentAsync } from "./topicBulk.Async";


const initialState = {
  bulkcontentLoader: false,
  bulkContentUpload: [],
  bulkContentFiles: [],
};

export const contentBulkSlice = createSlice({
  name: "contentBulkSlice",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(UploadBulkContentAsync.pending, getAllBulkContentFiles.pending),
      (state) => {
        state.bulkcontentLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(UploadBulkContentAsync.fulfilled),
      (state, action) => {
        state.bulkcontentLoader = false;
        state.bulkContentUpload = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllBulkContentFiles.fulfilled),
      (state, action) => {
        state.bulkcontentLoader = false;
        state.bulkContentFiles = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(UploadBulkContentAsync.rejected, getAllBulkContentFiles.rejected),
      (state, action) => {
        state.bulkcontentLoader = false;
      }
    );
  },
  reducers: {
    emptycontentbulk: (state) => initialState,
  },
});
export const { emptycontentbulk } = contentBulkSlice.actions;

export default contentBulkSlice.reducer;
