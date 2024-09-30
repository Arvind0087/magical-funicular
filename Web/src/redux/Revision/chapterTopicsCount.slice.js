import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getChapterByStudentAsync } from "./chapter.async";

const initialState = {
  chaptersLoader: false,
  chapterBy: [],
}
export const chapterTopicsCountSlice = createSlice({
  name: "Chapters",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getChapterByStudentAsync.pending), (state) => {
      state.chaptersLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getChapterByStudentAsync.fulfilled),
      (state, action) => {
        state.chaptersLoader = false;
        state.chapterBy = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getChapterByStudentAsync.rejected),
      (state, action) => {
        state.chaptersLoader = false;
      }
    );
  },
});

export default chapterTopicsCountSlice.reducer;
