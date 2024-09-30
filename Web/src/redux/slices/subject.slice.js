import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addsubjectAsync,
  getAllSubjectsAsync,
  getSubjectByBatchTypeIdAsync,
  getSubjectByIdAsync,
  getSubjectsByStudentAsync,
  updatedSubjectByIdAsync,
} from "../async.api";

const initialState = {
  subjectLoader: false,
  subject: [],
  subjectadd: [],
  subjectById: [],
  subjectupdate: [],
  subjectCourseBoardClassBatch: [],
  subjectBy: [],
};

export const subjectSlice = createSlice({
  name: "subject",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllSubjectsAsync.pending,
        addsubjectAsync.pending,
        getSubjectByIdAsync.pending,
        updatedSubjectByIdAsync.pending,
        getSubjectsByStudentAsync.pending,
      ),
      (state) => {
        state.subjectLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getSubjectsByStudentAsync.fulfilled),
      (state, action) => {
        state.subjectLoader = false;
        state.subjectBy = action.payload.data;
        // state.subjectBy=[];
      }
    );

    builder.addMatcher(
      isAnyOf(getAllSubjectsAsync.fulfilled),
      (state, action) => {
        state.subjectLoader = false;
        state.subject = action.payload.data;
      }
    );
    builder.addMatcher(isAnyOf(addsubjectAsync.fulfilled), (state, action) => {
      state.subjectLoader = false;
      state.subjectadd = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getSubjectByIdAsync.fulfilled),
      (state, action) => {
        state.subjectLoader = false;
        state.subjectById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updatedSubjectByIdAsync.fulfilled),
      (state, action) => {
        state.subjectLoader = false;
        state.subjectupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getSubjectByBatchTypeIdAsync.pending),
      (state, action) => {
        state.subjectLoader = true;
        state.subjectCourseBoardClassBatch = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getSubjectByBatchTypeIdAsync.fulfilled),
      (state, action) => {
        state.subjectLoader = false;
        state.subjectCourseBoardClassBatch = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getSubjectByBatchTypeIdAsync.rejected),
      (state, action) => {
        state.subjectLoader = false;
        state.subjectCourseBoardClassBatch = []
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllSubjectsAsync.rejected,
        addsubjectAsync.rejected,
        getSubjectByIdAsync.rejected,
        updatedSubjectByIdAsync.rejected,
        getSubjectsByStudentAsync.rejected,
      ),
      (state, action) => {
        state.subjectLoader = false;
      }
    );
  },
  reducers: {
    emptysubject: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptysubject } = subjectSlice.actions;

export default subjectSlice.reducer;
