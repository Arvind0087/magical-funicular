import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { addBookmarkAsync } from "./bookmark.async";

const initialState = {
  bookmarkLoader: false,
  bookmarkadd: [],
};

export const bookmarkAsyncSlice = createSlice({
  name: "Bookmark",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(addBookmarkAsync.pending), (state) => {
      state.bookmarkLoader = true;
    });
    builder.addMatcher(isAnyOf(addBookmarkAsync.fulfilled), (state, action) => {
      state.bookmarkLoader = false;
      state.bookmarkadd = action.payload;
    });

    builder.addMatcher(isAnyOf(addBookmarkAsync.rejected), (state, action) => {
      state.bookmarkLoader = false;
    });
  },
});

export default bookmarkAsyncSlice.reducer;
