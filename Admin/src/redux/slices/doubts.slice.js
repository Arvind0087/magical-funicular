import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  postReplyAsync,
  getAllDoubtsAsync,
  getDoubtsByIdAsync,
} from "../async.api";

const initialState = {
  doubtsLoader: false,
  doubts: [],
  postReply: [],
};

export const doubtsSlice = createSlice({
  name: "doubts",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllDoubtsAsync.pending,
        postReplyAsync.pending,
        getDoubtsByIdAsync.pending
      ),
      (state) => {
        state.doubtsLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllDoubtsAsync.fulfilled),
      (state, action) => {
        state.doubtsLoader = false;
        state.doubts = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(postReplyAsync.fulfilled), (state, action) => {
      state.doubtsLoader = false;
      state.postReply = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getDoubtsByIdAsync.fulfilled),
      (state, action) => {
        state.doubtsLoader = false;
        state.doubtsById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllDoubtsAsync.rejected,
        postReplyAsync.rejected,
        getDoubtsByIdAsync.rejected
      ),
      (state, action) => {
        state.doubtsLoader = false;
      }
    );
  },
  reducers: {
    emptydoubts: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptydoubts } = doubtsSlice.actions;

export default doubtsSlice.reducer;
