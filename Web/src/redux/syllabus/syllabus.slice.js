import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getContentsByTopicIdAsync,
  getLearningContentByIdAsync,
  getSyllabusContentByIdAsync,
  resumeLearningAsync,
  userChapterBySubjectIdAsync,
  coursePackagesByStudentAsync,
  userCoursePackageBypackageIdAsync,
  getEducatorsAsync,
  userAllBatchesAsync,
  voucherByUserIdAsync,
  addMarkAsReadAsync,
  chapterNotesAsync,
} from "./syllabus.async";

const initialState = {
  learningLoader: false,
  educatorLoader: false,
  educatorData: [],
  learningAsync: [],
  learningData: [],
  contentByTopic: [],
  contentLoading: false,
  contentObj: {},
  resumeLearningLoader: false,
  resumeLearning: [],
  getSubjectContentLoader: false,
  getSubjectContent: [],
  getCoursePackageLoader: false,
  getCoursePackage: [],
  getCoursePackageByIdLoader: false,
  getCoursePackageById: [],
  allBatchLoader: false,
  allBatches: [],
  getVoucherLoader: false,
  getVoucher: [],
  markReadLoader: false,
  markRead: [],
  notesLoader: false,
  notesData: [],
};

export const syllabusSlice = createSlice({
  name: "syllabus",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(chapterNotesAsync.pending), (state, action) => {
      state.notesLoader = true;
    });
    builder.addMatcher(
      isAnyOf(chapterNotesAsync.fulfilled),
      (state, action) => {
        state.notesLoader = false;
        state.notesData = action.payload.data;
      }
    );
    builder.addMatcher(isAnyOf(chapterNotesAsync.rejected), (state, action) => {
      state.notesLoader = false;
    });

    builder.addMatcher(
      isAnyOf(voucherByUserIdAsync.pending),
      (state, action) => {
        state.getVoucherLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(voucherByUserIdAsync.fulfilled),
      (state, action) => {
        state.getVoucherLoader = false;
        state.getVoucher = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(voucherByUserIdAsync.rejected),
      (state, action) => {
        state.getVoucherLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(addMarkAsReadAsync.pending), (state, action) => {
      state.markReadLoader = true;
    });
    builder.addMatcher(
      isAnyOf(addMarkAsReadAsync.fulfilled),
      (state, action) => {
        state.markReadLoader = false;
        state.markRead = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(addMarkAsReadAsync.rejected),
      (state, action) => {
        state.markReadLoader = false;
      }
    );

    builder.addMatcher(
      isAnyOf(userAllBatchesAsync.pending),
      (state, action) => {
        state.allBatchLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(userAllBatchesAsync.fulfilled),
      (state, action) => {
        state.allBatchLoader = false;
        state.allBatches = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(userAllBatchesAsync.rejected),
      (state, action) => {
        state.allBatchLoader = false;
      }
    );

    builder.addMatcher(
      isAnyOf(getContentsByTopicIdAsync.pending),
      (state, action) => {
        state.learningLoader = true;
        state.contentByTopic = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getContentsByTopicIdAsync.fulfilled),
      (state, action) => {
        state.learningLoader = false;
        state.contentByTopic = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getContentsByTopicIdAsync.rejected),
      (state, action) => {
        state.learningLoader = false;
        state.contentByTopic = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getLearningContentByIdAsync.pending),
      (state, action) => {
        state.learningLoader = true;
        state.learningAsync = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getLearningContentByIdAsync.fulfilled),
      (state, action) => {
        state.learningLoader = false;
        state.learningAsync = action.payload.data;
        state.learningData = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getLearningContentByIdAsync.rejected),
      (state, action) => {
        state.learningLoader = false;
        state.learningAsync = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getSyllabusContentByIdAsync.pending),
      (state, action) => {
        state.contentLoading = true;
        state.contentObj = {};
      }
    );
    builder.addMatcher(
      isAnyOf(getSyllabusContentByIdAsync.fulfilled),
      (state, action) => {
        state.contentLoading = false;
        state.contentObj = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getSyllabusContentByIdAsync.rejected),
      (state, action) => {
        state.contentLoading = false;
        state.contentObj = {};
      }
    );
    builder.addMatcher(
      isAnyOf(resumeLearningAsync.pending),
      (state, action) => {
        state.resumeLearningLoader = true;
        state.resumeLearning = [];
      }
    );
    builder.addMatcher(
      isAnyOf(resumeLearningAsync.fulfilled),
      (state, action) => {
        state.resumeLearningLoader = false;
        state.resumeLearning = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(resumeLearningAsync.rejected),
      (state, action) => {
        state.resumeLearningLoader = false;
        state.resumeLearning = [];
      }
    );

    builder.addMatcher(
      isAnyOf(userChapterBySubjectIdAsync.pending),
      (state, action) => {
        state.getSubjectContentLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(userChapterBySubjectIdAsync.fulfilled),
      (state, action) => {
        state.getSubjectContentLoader = false;
        state.getSubjectContent = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(userChapterBySubjectIdAsync.rejected),
      (state, action) => {
        state.getSubjectContentLoader = false;
      }
    );

    builder.addMatcher(
      isAnyOf(coursePackagesByStudentAsync.pending),
      (state, action) => {
        state.getCoursePackageLoader = true;
        state.getCoursePackage = [];
      }
    );
    builder.addMatcher(
      isAnyOf(coursePackagesByStudentAsync.fulfilled),
      (state, action) => {
        state.getCoursePackageLoader = false;
        state.getCoursePackage = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(coursePackagesByStudentAsync.rejected),
      (state, action) => {
        state.getCoursePackageLoader = false;
        state.getCoursePackage = [];
      }
    );

    builder.addMatcher(
      isAnyOf(userCoursePackageBypackageIdAsync.pending),
      (state, action) => {
        state.getCoursePackageByIdLoader = true;
        state.getCoursePackageById = [];
      }
    );
    builder.addMatcher(
      isAnyOf(userCoursePackageBypackageIdAsync.fulfilled),
      (state, action) => {
        state.getCoursePackageByIdLoader = false;
        state.getCoursePackageById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(userCoursePackageBypackageIdAsync.rejected),
      (state, action) => {
        state.getCoursePackageByIdLoader = false;
        state.getCoursePackageById = [];
      }
    );
    builder.addMatcher(isAnyOf(getEducatorsAsync.pending), (state, action) => {
      state.educatorLoader = true;
      state.educatorData = [];
    });
    builder.addMatcher(
      isAnyOf(getEducatorsAsync.fulfilled),
      (state, action) => {
        state.educatorLoader = false;
        state.educatorData = action.payload.data;
      }
    );
    builder.addMatcher(isAnyOf(getEducatorsAsync.rejected), (state, action) => {
      state.educatorLoader = false;
      state.educatorData = [];
    });
  },
});

export default syllabusSlice.reducer;
