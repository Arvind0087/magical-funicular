import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllLiveEventAsync,
  createLiveEventAsync,
  updateLiveEventByIdAsync,
  getLiveEventByIdAsync,
  getSubjectByOnlyBatchTypeIdAsync,
  getChapterByOnlySubjectIdAsync,
  deleteLiveEventAsync,
  getAllMentorTeacherAsync,
} from "./liveclass.async";

const initialState = {
  MentorTeacherLoader: false,
  liveclassLoader: false,
  liveclass: [],
  liveclassadd: [],
  liveclassId: [],
  liveclassUpdate: [],
  liveclassSubjectId: [],
  liveclassChapterId: [],
  liveclassdelete: [],
  allStaffMentorTeacher: [],
};

export const liveclassSlice = createSlice({
  name: "liveclass",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllLiveEventAsync.pending,
        createLiveEventAsync.pending,
        updateLiveEventByIdAsync.pending,
        getLiveEventByIdAsync.pending,
        getSubjectByOnlyBatchTypeIdAsync.pending,
        getChapterByOnlySubjectIdAsync.pending,
        deleteLiveEventAsync.pending
      ),
      (state) => {
        state.liveclassLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getAllMentorTeacherAsync.pending), (state) => {
      state.MentorTeacherLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllLiveEventAsync.fulfilled),
      (state, action) => {
        state.liveclassLoader = false;
        state.liveclass = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(createLiveEventAsync.fulfilled),
      (state, action) => {
        state.liveclassLoader = false;
        state.liveclassadd = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(updateLiveEventByIdAsync.fulfilled),
      (state, action) => {
        state.liveclassLoader = false;
        state.liveclassUpdate = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getLiveEventByIdAsync.fulfilled),
      (state, action) => {
        state.liveclassLoader = false;
        state.liveclassId = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(getSubjectByOnlyBatchTypeIdAsync.fulfilled),
      (state, action) => {
        state.liveclassLoader = false;
        state.liveclassSubjectId = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getChapterByOnlySubjectIdAsync.fulfilled),
      (state, action) => {
        state.liveclassLoader = false;
        state.liveclassChapterId = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(deleteLiveEventAsync.fulfilled),
      (state, action) => {
        state.liveclassLoader = false;
        state.liveclassdelete = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllMentorTeacherAsync.fulfilled),
      (state, action) => {
        state.MentorTeacherLoader = false;
        state.allStaffMentorTeacher = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllLiveEventAsync.rejected,
        createLiveEventAsync.rejected,
        updateLiveEventByIdAsync.rejected,
        getLiveEventByIdAsync.rejected,
        getSubjectByOnlyBatchTypeIdAsync.rejected,
        getChapterByOnlySubjectIdAsync.rejected,
        deleteLiveEventAsync.rejected
      ),
      (state, action) => {
        state.liveclassLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllMentorTeacherAsync.rejected),
      (state, action) => {
        state.MentorTeacherLoader = false;
      }
    );
  },
  reducers: {
    emptyliveclass: (state) => initialState,
  },
});
export const { emptyliveclass } = liveclassSlice.actions;

export default liveclassSlice.reducer;
