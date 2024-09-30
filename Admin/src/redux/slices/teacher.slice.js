import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllTeachersAsync,
  getTeacherByIdAsync,
  updateTeacherByIdAsync,
} from "../async.api";

const initialState = {
  teacherLoader: false,
  teachers: [],
  teacherById: [],
  teacherupdate: [],
};

export const teacherSlice = createSlice({
  name: "Teachers",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllTeachersAsync.pending,
        getTeacherByIdAsync.pending,
        updateTeacherByIdAsync.pending
      ),
      (state) => {
        state.teacherLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllTeachersAsync.fulfilled),
      (state, action) => {
        state.teacherLoader = false;
        state.teachers = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getTeacherByIdAsync.fulfilled),
      (state, action) => {
        state.teacherLoader = false;
        state.teacherById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateTeacherByIdAsync.fulfilled),
      (state, action) => {
        state.teacherLoader = false;
        state.teacherupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllTeachersAsync.rejected,
        getTeacherByIdAsync.rejected,
        updateTeacherByIdAsync.rejected
      ),
      (state, action) => {
        state.teacherLoader = false;
      }
    );
  },
  reducers: {
    emptyteacher: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyteacher } = teacherSlice.actions;

export default teacherSlice.reducer;
