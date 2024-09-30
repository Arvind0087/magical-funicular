import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllHighlightAsync,
  getHighlightByIdAsync,
  updateHighlightByIdAsync,
  createHighlightAsync,
  deleteHighlightAsync,
} from "./highlight.async.api";

const initialState = {
  highlightLoader: false,
  highlight: [],
  highlightadd: [],
  highlightId: [],
  highlightupdateId: [],
  highlightdelete: [],
};

export const highlightSlice = createSlice({
  name: "highlight",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllHighlightAsync.pending,
        getHighlightByIdAsync.pending,
        updateHighlightByIdAsync
        .pending,
        createHighlightAsync.pending,
        deleteHighlightAsync.pending
      ),
      (state) => {
        state.highlightLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllHighlightAsync.fulfilled),
      (state, action) => {
        state.highlightLoader = false;
        state.highlight = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(createHighlightAsync.fulfilled),
      (state, action) => {
        state.highlightLoader = false;
        state.highlightadd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getHighlightByIdAsync.fulfilled),
      (state, action) => {
        state.highlightLoader = false;
        state.highlightId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateHighlightByIdAsync.fulfilled),
      (state, action) => {
        state.highlightLoader = false;
        state.highlightupdateId = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteHighlightAsync.fulfilled),
      (state, action) => {
        state.highlightLoader = false;
        state.highlightdelete = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllHighlightAsync.rejected,
        getHighlightByIdAsync.rejected,
        updateHighlightByIdAsync.rejected,
        createHighlightAsync.rejected,
        deleteHighlightAsync.rejected
      ),
      (state, action) => {
        state.highlightLoader = false;
      }
    );
  },
  reducers: {
    emptyhighlight: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyhighlight } = highlightSlice.actions;
export default highlightSlice.reducer;
