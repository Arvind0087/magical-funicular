import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getRevisionBysubBychapterAsync } from "./revision.async";
import { getTopicBysubBychapterAsync } from "./revision.async";
import _ from "lodash";

const initialState = {
  revisionLoader: false,
  revisionBysubBychapter: [],
  revisionTopicsLoader: false,
  revisionTopicsBysubBychapter: [],
};

export const revisionSlice = createSlice({
  name: "Revision",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(getRevisionBysubBychapterAsync.pending),
      (state) => {
        state.revisionLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getRevisionBysubBychapterAsync.fulfilled),
      (state, action) => {
        state.revisionLoader = false;
        state.revisionBysubBychapter = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getRevisionBysubBychapterAsync.rejected),
      (state, action) => {
        state.revisionLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(getTopicBysubBychapterAsync.pending),
      (state) => {
        state.revisionTopicsLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getTopicBysubBychapterAsync.fulfilled),
      (state, action) => {
        state.revisionTopicsLoader = false;
        state.revisionTopicsBysubBychapter = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getTopicBysubBychapterAsync.rejected),
      (state, action) => {
        state.revisionTopicsLoader = false;
      }
    );
  },
  reducers: {
    removeBookmark: (state, action) => {
      state.revisionBysubBychapter = action.payload;
    },
  },
});

export const { removeBookmark } = revisionSlice.actions;

export default revisionSlice.reducer;
