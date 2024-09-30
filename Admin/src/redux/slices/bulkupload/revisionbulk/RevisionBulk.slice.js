import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { uploadRevisionBulkAsync, getRevisionBulkFiles } from "./RevisionBulk.async.api";

const initialState = {
  revisionBulkLoader: false,
  revisionBulkUpload: [],
  revisionBulkFiles: [],
};
export const revisionBulkSlice = createSlice({
  name: "revisionBulk",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(
      uploadRevisionBulkAsync.pending,
      getRevisionBulkFiles.pending
    ), (state) => {
      state.revisionBulkLoader = true;
    });

    builder.addMatcher(
      isAnyOf(uploadRevisionBulkAsync.fulfilled),
      (state, action) => {
        state.revisionBulkLoader = false;
        state.revisionBulkUpload = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getRevisionBulkFiles.fulfilled),
      (state, action) => {
        state.revisionBulkLoader = false;
        state.revisionBulkFiles = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(uploadRevisionBulkAsync.rejected),
      isAnyOf(getRevisionBulkFiles.rejected),
      (state, action) => {
        state.revisionBulkLoader = false;
      }
    );
  },
  reducers: {
    emptyRevisionBulk: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyRevisionBulk } = revisionBulkSlice.actions;
export default revisionBulkSlice.reducer;
