import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addsubjectAsync,
  getAllSubjectsAsync,
  getSubjectByBatchTypeIdAsync,
  getSubjectByIdAsync,
  updatedSubjectByIdAsync,
  getSubjectStatusAsync,
} from "./subject.async";

const initialState = {
  subjectLoader: false,
  subject: [],
  subjectadd: [],
  subjectById: [],
  subjectupdate: [],
  subjectCourseBoardClassBatch: [],
  getSubjectStatus: [],

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
        getSubjectByBatchTypeIdAsync.pending,
        getSubjectStatusAsync.pending,
      ),
      (state) => {
        state.subjectLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllSubjectsAsync.fulfilled),
      (state, action) => {
        state.subjectLoader = false;
        state.subject = action.payload;
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
      isAnyOf(getSubjectByBatchTypeIdAsync.fulfilled),
      (state, action) => {
        state.subjectLoader = false;
        state.subjectCourseBoardClassBatch = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getSubjectStatusAsync.fulfilled),
      (state, action) => {
        state.subjectLoader = false;
        state.getSubjectStatus = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllSubjectsAsync.rejected,
        addsubjectAsync.rejected,
        getSubjectByIdAsync.rejected,
        updatedSubjectByIdAsync.rejected,
        getSubjectByBatchTypeIdAsync.rejected,
        getSubjectStatusAsync.rejected,
      ),
      (state, action) => {
        state.subjectLoader = false;
      }
    );
  },
  reducers: {
    emptysubject: () => initialState,
  },
});

export const { emptysubject } = subjectSlice.actions;

export default subjectSlice.reducer;
