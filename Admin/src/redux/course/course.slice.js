import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createcourseAsync,
  getcourseAsync,
  getcoursebyidAsync,
  updatecoursebyidAsync,
  getCourseStatusAsync,
} from "./course.async";

const initialState = {
  courseLoader: false,
  course: [],
  courseadd: [],
  courseId: [],
  updateId: [],
  getCourseStatus: [],
};

export const coursesSlice = createSlice({
  name: "course",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getcourseAsync.pending,
        createcourseAsync.pending,
        getcoursebyidAsync.pending,
        updatecoursebyidAsync.pending,
        getCourseStatusAsync.pending,
      ),
      (state) => {
        state.courseLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getcourseAsync.fulfilled), (state, action) => {
      state.courseLoader = false;
      state.course = action.payload;
    });
    builder.addMatcher(
      isAnyOf(createcourseAsync.fulfilled),
      (state, action) => {
        state.courseLoader = false;
        state.courseadd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getcoursebyidAsync.fulfilled),
      (state, action) => {
        state.courseLoader = false;
        state.courseId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updatecoursebyidAsync.fulfilled),
      (state, action) => {
        state.courseLoader = false;
        state.updateId = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getCourseStatusAsync.fulfilled),
      (state, action) => {
        state.courseLoader = false;
        state.getCourseStatus = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getcourseAsync.rejected,
        createcourseAsync.rejected,
        getcoursebyidAsync.rejected,
        updatecoursebyidAsync.rejected,
        getCourseStatusAsync.rejected,
      ),
      (state, action) => {
        state.courseLoader = false;
      }
    );
  },
  reducers: {
    emptycourse: () => initialState
  },
});

export const { emptycourse } = coursesSlice.actions;

export default coursesSlice.reducer;
