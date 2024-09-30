import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import { getAllAttendanceAsync } from "./AttendanceAsync.api";

const initialState = {
  attendanceLoader: false,
  attendance: [],
};

export const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllAttendanceAsync.pending), (state) => {
      state.attendanceLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllAttendanceAsync.fulfilled),
      (state, action) => {
        state.attendanceLoader = false;
        state.attendance = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllAttendanceAsync.rejected),
      (state, action) => {
        state.attendanceLoader = false;
      }
    );
  },
  reducers: {
    emptyattendance: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyattendance } = attendanceSlice.actions;

export default attendanceSlice.reducer;
