import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import { getStaffAttendanceAsync } from "./AttendanceAsync.api";

const initialState = {
  attendanceLoader: false,
  attendance: [],
};

export const staffAttendanceSlice = createSlice({
  name: "attendance",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getStaffAttendanceAsync.pending), (state) => {
      state.attendanceLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getStaffAttendanceAsync.fulfilled),
      (state, action) => {
        state.attendanceLoader = false;
        state.attendance = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getStaffAttendanceAsync.rejected),
      (state, action) => {
        state.attendanceLoader = false;
      }
    );
  },
});



export default staffAttendanceSlice.reducer;
