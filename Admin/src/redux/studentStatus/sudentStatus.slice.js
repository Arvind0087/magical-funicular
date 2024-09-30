import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  studentActiveStatusAsync,
  studentInactiveStatusAsync,
} from "./sudentStatus.async";

const initialState = {
  studentStatusLoader: false,
  studentActiveStatus: [],
  studentInactiveStatus: [],
};

export const sudentStatusSlice = createSlice({
  name: "studentStatus",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        studentActiveStatusAsync.pending,
        studentInactiveStatusAsync.pending
      ),
      (state) => {
        state.studentStatusLoader = true;
      }
    );

    builder.addMatcher(
      isAnyOf(studentActiveStatusAsync.fulfilled),
      (state, action) => {
        state.studentStatusLoader = false;
        state.studentActiveStatus = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(studentInactiveStatusAsync.fulfilled),
      (state, action) => {
        state.studentStatusLoader = false;
        state.studentInactiveStatus = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(
        studentActiveStatusAsync.rejected,
        studentInactiveStatusAsync.rejected
      ),
      (state, action) => {
        state.studentStatusLoader = false;
      }
    );
  },
  reducers: {
    emptyStudentStatus: (state) => initialState,
  },
});

export const { emptyStudentStatus } = sudentStatusSlice.actions;

export default sudentStatusSlice.reducer;
