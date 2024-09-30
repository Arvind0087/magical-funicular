import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import {
  getAllAssignmentAsync,
  getChapterByMultipleSubjectIdAsync,
  getStydentsByCBCBAsync,
  createAssignmentAsync,
  getAssignmentByIdAsync,
  deleteAssignmentAsync,
  updateAssignmentAsync
} from "./assignment.async";

const initialState = {
  assignmentLoader: false,
  allAssignments: [],
  multipleChapler: [],
  multipleStudents: [],
  createAssignment: [],
  assignmentById: [],
  deleteAssignment: [],
  updateAssignment: []
};

export const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllAssignmentAsync.pending,
        getChapterByMultipleSubjectIdAsync.pending,
        getStydentsByCBCBAsync.pending,
        createAssignmentAsync.pending,
        getAssignmentByIdAsync.pending,
        deleteAssignmentAsync.pending,
        updateAssignmentAsync.pending
      ),
      (state) => {
        state.assignmentLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllAssignmentAsync.fulfilled),
      (state, action) => {
        state.assignmentLoader = false;
        state.allAssignments = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(getChapterByMultipleSubjectIdAsync.fulfilled),
      (state, action) => {
        state.assignmentLoader = false;
        state.multipleChapler = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getStydentsByCBCBAsync.fulfilled),
      (state, action) => {
        state.assignmentLoader = false;
        state.multipleStudents = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(createAssignmentAsync.fulfilled),
      (state, action) => {
        state.assignmentLoader = false;
        state.createAssignment = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getAssignmentByIdAsync.fulfilled),
      (state, action) => {
        state.assignmentLoader = false;
        state.assignmentById = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(deleteAssignmentAsync.fulfilled),
      (state, action) => {
        state.assignmentLoader = false;
        state.deleteAssignment = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(updateAssignmentAsync.fulfilled),
      (state, action) => {
        state.assignmentLoader = false;
        state.updateAssignment = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAllAssignmentAsync.rejected,
        getChapterByMultipleSubjectIdAsync.rejected,
        getStydentsByCBCBAsync.pending,
        createAssignmentAsync.rejected,
        getAssignmentByIdAsync.rejected,
        deleteAssignmentAsync.rejected,
        updateAssignmentAsync.rejected
      ),
      (state, action) => {
        state.assignmentLoader = false;
      }
    );
  },
  reducers: {
    emptyassignment: (state) => initialState
  }
});

export const { emptyassignment } = assignmentSlice.actions;

export default assignmentSlice.reducer;
