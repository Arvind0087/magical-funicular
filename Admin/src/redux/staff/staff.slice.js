import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllStaffsAsync,
  getAllStaffOnlyAsync,
  getStaffByIdAsync,
  updateStaffByIdAsync,
  getSubjectByMultipleClassIdAsync,
  updateStaffBatchDetailsAsync,
  markStaffAttendanceAsync
} from "./staff.async";

const initialState = {
  staffLoader: false,
  staffAttendanceLoader: false,
  staffs: [],
  staffNameIdOnly: [],
  staffById: [],
  staffupdate: [],
  getSubjectByMultipleClass: [],
  updateStaffBatchDetails: [],
  staffAttendance: []
};

export const staffSlice = createSlice({
  name: "Staff",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllStaffsAsync.pending,
        getAllStaffOnlyAsync.pending,
        getStaffByIdAsync.pending,
        updateStaffByIdAsync.pending,
        getSubjectByMultipleClassIdAsync.pending,
        updateStaffBatchDetailsAsync.pending
      ),
      (state) => {
        state.staffLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(markStaffAttendanceAsync.pending,),
      state => {
        state.staffAttendanceLoader = true;
        state.staffLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllStaffsAsync.fulfilled),
      (state, action) => {
        state.staffLoader = false;
        state.staffs = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllStaffOnlyAsync.fulfilled),
      (state, action) => {
        state.staffLoader = false;
        state.staffNameIdOnly = action.payload?.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getStaffByIdAsync.fulfilled),
      (state, action) => {
        state.staffLoader = false;
        state.staffById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateStaffByIdAsync.fulfilled),
      (state, action) => {
        state.staffLoader = false;
        state.staffupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateStaffBatchDetailsAsync.fulfilled),
      (state, action) => {
        state.staffLoader = false;
        state.updateStaffBatchDetails = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getSubjectByMultipleClassIdAsync.fulfilled),
      (state, action) => {
        state.staffLoader = false;
        state.getSubjectByMultipleClass = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(markStaffAttendanceAsync.fulfilled),
      (state, action) => {
        state.staffAttendanceLoader = false;
        state.staffLoader = false;
        state.staffAttendance = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllStaffsAsync.rejected,
        getAllStaffOnlyAsync.rejected,
        getStaffByIdAsync.rejected,
        updateStaffByIdAsync.rejected,
        getSubjectByMultipleClassIdAsync.rejected,
        updateStaffBatchDetailsAsync.rejected
      ),
      (state, action) => {
        state.staffLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(markStaffAttendanceAsync.rejected),
      (state, action) => {
        state.staffAttendanceLoader = false;
        state.staffAttendance = false;
      }
    );
  },
  reducers: {
    emptystaff: () => initialState,
    emptystaffAttendance: (state) => { state.staffAttendance = [] }
  },
});

export const { emptystaff, emptystaffAttendance } = staffSlice.actions;

export default staffSlice.reducer;
