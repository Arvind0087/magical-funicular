import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { UploadBulkChapterAsync, getAllBulkFilesChapter } from "./chapterBulk.Async";

const initialState = {
  bulkLoaderchapter: false,
  bulkUploadchapter: [],
  bulkFileschapter: [],
};

export const chapterBulkSlice = createSlice({
  name: "chapterBulk",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(UploadBulkChapterAsync.pending, getAllBulkFilesChapter.pending),
      (state) => {
        state.bulkLoaderchapter = true;
      }
    );

    builder.addMatcher(isAnyOf(UploadBulkChapterAsync.fulfilled), (state, action) => {
      state.bulkLoaderchapter = false;
      state.bulkUploadchapter = action.payload;
    });
    builder.addMatcher(isAnyOf(getAllBulkFilesChapter.fulfilled), (state, action) => {
      state.bulkLoaderchapter = false;
      state.bulkFileschapter = action.payload;
    });

    builder.addMatcher(isAnyOf(UploadBulkChapterAsync.rejected), (state, action) => {
      state.bulkLoaderchapter = false;
    });
  },
  reducers: {
    emptybulk: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptybulk } = chapterBulkSlice.actions;
export default chapterBulkSlice.reducer;
