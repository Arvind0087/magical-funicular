import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addChapterAsync,
  getAllChaptersAsync,
  getChapterByIdAsync,
  getChapterBySubjectId,
  updateChapterAsync,
  getChapterStatusAsync,
} from "./chapter.async";

const initialState = {
  chapterLoader: false,
  chapter: [],
  chapteradd: [],
  chapterupdate: [],
  chapterById: [],
  chapterdata: [],
  getChapterStatus: [],
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
        getChapterByIdAsync.pending,
        getChapterBySubjectId.pending,
        getChapterStatusAsync.pending,
      ),
      (state) => {
        state.chapterLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllChaptersAsync.fulfilled),
      (state, action) => {
        state.chapterLoader = false;
        state.chapter = action.payload;
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
      isAnyOf(getChapterBySubjectId.fulfilled),
      (state, action) => {
        state.chapterLoader = false;
        state.chapterdata = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getChapterStatusAsync.fulfilled),
      (state, action) => {
        state.chapterLoader = false;
        state.getChapterStatus = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllChaptersAsync.rejected,
        addChapterAsync.rejected,
        updateChapterAsync.rejected,
        getChapterBySubjectId.rejected,
        getChapterByIdAsync.rejected,
        getChapterStatusAsync.rejected,
      ),
      (state, action) => {
        state.chapterLoader = false;
      }
    );
  },
  reducers: {
    emptychapter: () => initialState,
  },
});

export const { emptychapter } = chapterSlice.actions;

export default chapterSlice.reducer;
