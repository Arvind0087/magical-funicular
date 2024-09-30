import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllbookmarkedQueAsync } from "../async.api";

const initialState = {
 bookmarkedQuestionsLoader:false,
 bookmarkedQuestions:[],
};

export const bookmarkSlice = createSlice({
  name: "bookmarked",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllbookmarkedQueAsync.pending), (state) => {
      state.bookmarkedQuestionsLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllbookmarkedQueAsync.fulfilled),
      (state, action) => {
        state.bookmarkedQuestionsLoader = false;
        state.bookmarkedQuestions = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllbookmarkedQueAsync.rejected),
      (state, action) => {
        state.bookmarkedQuestionsLoader = false;
      }
    );
  },
});

export default bookmarkSlice.reducer;
