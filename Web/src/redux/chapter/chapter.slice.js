import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getChaptersByIdAsync } from "./chapter.async";

const initialState = {
  chapterLoader: false,
  chaptersAsync: [],
};

export const chapterAsyncSlice = createSlice({
  name: "Chapter",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getChaptersByIdAsync.pending), (state) => {
      state.chapterLoader = true;
      state.chaptersAsync = [];
    });
    builder.addMatcher(
      isAnyOf(getChaptersByIdAsync.fulfilled),
      (state, action) => {
        state.chapterLoader = false;
        state.chaptersAsync = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(getChaptersByIdAsync.rejected),
      (state, action) => {
        state.chapterLoader = false;
        state.chaptersAsync = [];
      }
    );
  },
});

export default chapterAsyncSlice.reducer;
