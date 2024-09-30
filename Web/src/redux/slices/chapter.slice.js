import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addChapterAsync,
  getAllChaptersAsync,
  getChapterByIdAsync,
  updateChapterAsync,
} from "../async.api";

const initialState = {
  chapterLoader: false,
  chapter: [],
  chapteradd: [],
  chapterupdate: [],
  chapterById: [],
};

export const chapterSlice = createSlice({
  name: "chapter",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllChaptersAsync.pending,
        addChapterAsync.pending,
        updateChapterAsync.pending,
        getChapterByIdAsync.pending
      ),
      (state) => {
        state.chapterLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllChaptersAsync.fulfilled),
      (state, action) => {
        state.chapterLoader = false;
        state.chapter = action.payload.data;
      }
    );
    builder.addMatcher(isAnyOf(addChapterAsync.fulfilled), (state, action) => {
      state.chapterLoader = false;
      state.chapteradd = action.payload;
    });
    builder.addMatcher(
      isAnyOf(updateChapterAsync.fulfilled),
      (state, action) => {
        state.chapterLoader = false;
        state.chapterupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getChapterByIdAsync.fulfilled),
      (state, action) => {
        state.chapterLoader = false;
        state.chapterById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllChaptersAsync.rejected,
        addChapterAsync.rejected,
        updateChapterAsync.rejected,
        getChapterByIdAsync.pending
      ),
      (state, action) => {
        state.chapterLoader = false;
      }
    );
  },
  reducers: {
    emptychapter: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptychapter } = chapterSlice.actions;

export default chapterSlice.reducer;
