import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllBackLinkAsync } from "./NoticeBackLinkAsync";

const initialState = {
  NoticeBackLinkLoader: false,
  NoticeBackLink: []
};

export const NoticeBackLinkSlice = createSlice({
  name: "gallery",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllBackLinkAsync.pending), (state) => {
      state.NoticeBackLinkLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllBackLinkAsync.fulfilled),
      (state, action) => {
        state.NoticeBackLinkLoader = false;
        state.NoticeBackLink = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllBackLinkAsync.rejected),
      (state, action) => {
        state.NoticeBackLinkLoader = false;
      }
    );
  },

  reducers: {
    emptybacklink: (state) => {
      return {
        ...initialState
      };
    }
  }
});
export const { emptybacklink } = NoticeBackLinkSlice.actions;

export default NoticeBackLinkSlice.reducer;
