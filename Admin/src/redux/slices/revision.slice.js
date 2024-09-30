import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllRevisionAsync,
  getRevisionTopicAsync,
  createRevisionAsync,
  deleteRevisionAsync,
  getRevisionByIdAsync,
  updateRevisionAsync,
} from "../async.api";

const initialState = {
  revisionLoader: false,
  getAllRevision: [],
  getRevisionTopic: [],
  createRevision: [],
  deleteRevision: [],
  getRevisionById: [],
  updateRevision: [],
};

export const revisionSlice = createSlice({
  name: "Revision",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllRevisionAsync.pending,
        getRevisionTopicAsync.pending,
        createRevisionAsync.pending,
        deleteRevisionAsync.pending,
        getRevisionByIdAsync.pending,
        updateRevisionAsync.pending
      ),
      (state) => {
        state.revisionLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllRevisionAsync.fulfilled),
      (state, action) => {
        state.revisionLoader = false;
        state.getAllRevision = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getRevisionTopicAsync.fulfilled),
      (state, action) => {
        state.revisionLoader = false;
        state.getRevisionTopic = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(createRevisionAsync.fulfilled),
      (state, action) => {
        state.revisionLoader = false;
        state.createRevision = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteRevisionAsync.fulfilled),
      (state, action) => {
        state.revisionLoader = false;
        state.deleteRevision = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getRevisionByIdAsync.fulfilled),
      (state, action) => {
        state.revisionLoader = false;
        state.getRevisionById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateRevisionAsync.fulfilled),
      (state, action) => {
        state.revisionLoader = false;
        state.updateRevision = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllRevisionAsync.rejected,
        getRevisionTopicAsync.rejected,
        createRevisionAsync.rejected,
        deleteRevisionAsync.rejected,
        getRevisionByIdAsync.rejected,
        updateRevisionAsync.rejected
      ),
      (state, action) => {
        state.revisionLoader = false;
      }
    );
  },

  reducers: {
    emptyRevision: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyRevision } = revisionSlice.actions;

export default revisionSlice.reducer;
