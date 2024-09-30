import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  coursefilterAsync,
  boardfilterAsync,
  getClassWithBatchFilterAsync,
  getRolesFilterAsync,
  getSubjectFilterAsync,
  getChapterFilterAsync,
  getChapterBySubjectIdFilterAsync,
  getStateFilterAsync,
  getClassWithBoardFilterAsync,
  getStudentFilterAsync,
  getCheckedStudentAsync,
  getAllStaffFilterAsync,
  getSubjectByClassIdFilterAsync,
  getGrievanceCategoryFilterAsync,
} from "./filter.async";

const initialState = {
  filterLoader: false,
  checkedStudentLoader: false,
  courseFilter: [],
  boardFilterInfo: [],
  classWithBatchFilter: [],
  roleFilter: [],
  subjectFilter: [],
  subjectByClassIdFilter: [],
  chapterFilter: [],
  ChapterBySubjectId: [],
  stateFilter: [],
  classWithBoardFilter: [],
  studentFilter: [],
  checkedStudents: [],
  allStaff: [],
  grievanceCategoryFilter: [],
};

export const filterSlice = createSlice({
  name: "filterSlice",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(
      coursefilterAsync.pending,
      boardfilterAsync.pending,
      getClassWithBatchFilterAsync.pending,
      getRolesFilterAsync.pending,
      getSubjectFilterAsync.pending,
      getChapterFilterAsync.pending,
      getStateFilterAsync.pending,
      getClassWithBoardFilterAsync.pending,
      getStudentFilterAsync.pending,
      getCheckedStudentAsync.pending,
      getAllStaffFilterAsync.pending,
      getSubjectByClassIdFilterAsync.pending,
      getChapterBySubjectIdFilterAsync.pending,
      getGrievanceCategoryFilterAsync.pending,
    )
      , (state) => {
        state.filterLoader = true;
      });

    builder.addMatcher(isAnyOf(getCheckedStudentAsync.pending), (state) => {
      state.filterLoader = false
      state.checkedStudentLoader = true
    });
    // Course Filter
    builder.addMatcher(isAnyOf(coursefilterAsync.fulfilled), (state, action) => {
      state.filterLoader = false;
      state.courseFilter = action.payload.data;
    });
    // Board Filter
    builder.addMatcher(isAnyOf(boardfilterAsync.fulfilled), (state, action) => {
      state.filterLoader = false;
      state.boardFilterInfo = action.payload.data;
    });
    //All Batch With Class
    builder.addMatcher(isAnyOf(getClassWithBatchFilterAsync.fulfilled), (state, action) => {
      state.filterLoader = false;
      state.classWithBatchFilter = action.payload.data;
    });

    //All Class With Board
    builder.addMatcher(isAnyOf(getClassWithBoardFilterAsync.fulfilled), (state, action) => {
      state.filterLoader = false;
      state.classWithBoardFilter = action.payload.data;
    });

    //All Roles
    builder.addMatcher(isAnyOf(getRolesFilterAsync.fulfilled), (state, action) => {
      state.filterLoader = false;
      state.roleFilter = action.payload.data;
    });

    // All Subjects
    builder.addMatcher(isAnyOf(getSubjectFilterAsync.fulfilled), (state, action) => {
      state.filterLoader = false;
      state.subjectFilter = action.payload.data;
    });

    // Subject By Class ID
    builder.addMatcher(isAnyOf(getSubjectByClassIdFilterAsync.fulfilled), (state, action) => {
      state.filterLoader = false;
      state.subjectByClassIdFilter = action.payload.data;
    });

    // Students
    builder.addMatcher(isAnyOf(getStudentFilterAsync.fulfilled), (state, action) => {
      state.filterLoader = false;
      state.studentFilter = action.payload.data;
    });

    // Checked Students
    builder.addMatcher(isAnyOf(getCheckedStudentAsync.fulfilled), (state, action) => {
      state.filterLoader = false;
      state.checkedStudentLoader = false;
      state.checkedStudents = action.payload.data;
    });


    // All Chapter
    builder.addMatcher(isAnyOf(getChapterFilterAsync.fulfilled), (state, action) => {
      state.filterLoader = false;
      state.chapterFilter = action.payload.data;
    });

    // Chapter By Subject Id-----------
    builder.addMatcher(isAnyOf(getChapterBySubjectIdFilterAsync.fulfilled), (state, action) => {
      state.filterLoader = false;
      state.ChapterBySubjectId = action.payload.data;
    });


    // All State
    builder.addMatcher(isAnyOf(getStateFilterAsync.fulfilled), (state, action) => {
      state.filterLoader = false;
      state.stateFilter = action.payload.data;
    });

    // All Staff
    builder.addMatcher(isAnyOf(getAllStaffFilterAsync.fulfilled), (state, action) => {
      state.filterLoader = false;
      state.allStaff = action.payload.data;
    });

    // All Staff
    builder.addMatcher(isAnyOf(getGrievanceCategoryFilterAsync.fulfilled), (state, action) => {
      state.filterLoader = false;
      state.grievanceCategoryFilter = action.payload.data;
    });

    builder.addMatcher(isAnyOf(
      coursefilterAsync.rejected,
      boardfilterAsync.rejected,
      getClassWithBatchFilterAsync.rejected,
      getRolesFilterAsync.rejected,
      getSubjectFilterAsync.rejected,
      getChapterFilterAsync.rejected,
      getStateFilterAsync.rejected,
      getClassWithBoardFilterAsync.rejected,
      getStudentFilterAsync.rejected,
      getAllStaffFilterAsync.rejected,
      getSubjectByClassIdFilterAsync.rejected,
      getCheckedStudentAsync.rejected,
      getChapterBySubjectIdFilterAsync.rejected,
      getGrievanceCategoryFilterAsync.rejected,
    ), (state, action) => {
      state.filterLoader = false;
    });


    builder.addMatcher(isAnyOf(getCheckedStudentAsync.rejected,), (state, action) => {
      state.filterLoader = false;
      state.checkedStudentLoader = false;
    });


  },
});

export default filterSlice.reducer;
