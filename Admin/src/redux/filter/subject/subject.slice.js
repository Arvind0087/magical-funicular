import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getFilterAsync,
  getChapterByMultipleSubjectIdAsync,
} from "./subject.async";

const initialState = {
  subjectfilterLoader: false,
  subjectFilter: [],
  getChapterByMultipleSubject: [],
};

export const subjectFilterSlice = createSlice({
  name: "subject",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getFilterAsync.pending,
        getChapterByMultipleSubjectIdAsync.pending
      ),
      (state) => {
        state.subjectfilterLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getFilterAsync.fulfilled), (state, action) => {
      state.subjectfilterLoader = false;
      state.subjectFilter = action.payload.data;
    });
    builder.addMatcher(
      isAnyOf(getChapterByMultipleSubjectIdAsync.fulfilled),
      (state, action) => {
        state.subjectfilterLoader = false;
        state.getChapterByMultipleSubject = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getFilterAsync.rejected,
        getChapterByMultipleSubjectIdAsync.rejected
      ),
      (state, action) => {
        state.subjectfilterLoader = false;
      }
    );
  },
  reducers: {
    emptysubject: () => initialState,
  },
});

export const { emptysubject } = subjectFilterSlice.actions;

export default subjectFilterSlice.reducer;
