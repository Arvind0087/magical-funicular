import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createClassAsync,
  getClassByBoardAndCourseIdAsync,
  getClassByIdAsync,
  getclassAsync,
  updateClassByIdAsync,
} from "../async.api";

const initialState = {
  classLoader: false,
  classes: [],
  classadd: [],
  classId: [],
  classupdate: [],
  classbycourseboard: [],
};

export const classSlice = createSlice({
  name: "class",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getclassAsync.pending,
        createClassAsync.pending,
        getClassByIdAsync.pending,
        updateClassByIdAsync.pending,
        getClassByBoardAndCourseIdAsync.pending
      ),
      (state) => {
        state.classLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getclassAsync.fulfilled), (state, action) => {
      state.classLoader = false;
      state.classes = action.payload.data;
    });
    builder.addMatcher(isAnyOf(createClassAsync.fulfilled), (state, action) => {
      state.classLoader = false;
      state.classadd = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getClassByIdAsync.fulfilled),
      (state, action) => {
        state.classLoader = false;
        state.classId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateClassByIdAsync.fulfilled),
      (state, action) => {
        state.classLoader = false;
        state.classupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getClassByBoardAndCourseIdAsync.fulfilled),
      (state, action) => {
        state.classLoader = false;
        state.classbycourseboard = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getclassAsync.rejected,
        createClassAsync.rejected,
        getClassByIdAsync.rejected,
        updateClassByIdAsync.rejected,
        getClassByBoardAndCourseIdAsync.rejected
      ),
      (state, action) => {
        state.classLoader = false;
      }
    );
  },
  reducers: {
    emptyclass: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyclass } = classSlice.actions;

export default classSlice.reducer;
