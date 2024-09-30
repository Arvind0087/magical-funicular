import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllReminderTimeAsync,
  getAllScheduleOfMonthByTeacherIdAsync,
  getAllStaffDetailsBySubjectIdAsync,
  getAllTeachersAsync,
  getTeacherByIdAsync,
  getTeacherScheduleSlotsAsync,
  updateTeacherByIdAsync,
} from "../async.api";

const initialState = {
  teacherLoader: false,
  teachers: [],
  teacherById: [],
  teacherupdate: [],
  getAllStaffDetailsBySubjectId: [],
  getAllStaffDetailsBySubjectIdLoader: false,
  getTecherScheduleByTeacherId:[],
  getTecherScheduleByTeacherIdLoader:false,
  getTeacherScheduledSlotsLoader:false,
  getTeacherScheduledSlots:[],
  teacherId:0,
  getAllReminderTime:[],
  getAllReminderTimeLoader:false,
  getSubjectId:0
,};

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
        state.teacherById = action.payload;
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
    builder.addMatcher(
      isAnyOf(
        getAllStaffDetailsBySubjectIdAsync.pending
      ),
      (state) => {
        state.getAllStaffDetailsBySubjectIdLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllStaffDetailsBySubjectIdAsync.fulfilled),
      (state, action) => {
        console.log('action',action)
        state.getAllStaffDetailsBySubjectIdLoader = false;
        state.getAllStaffDetailsBySubjectId = action.payload;
        state.getSubjectId=action?.meta?.arg?.subjectId
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllStaffDetailsBySubjectIdAsync.rejected
      ),
      (state, action) => {
        state.getAllStaffDetailsBySubjectIdLoader = false;
      }
    );
    // teacher event schedule calender
    builder.addMatcher(
      isAnyOf(
        getAllScheduleOfMonthByTeacherIdAsync.pending
      ),
      (state) => {
        state.getTecherScheduleByTeacherIdLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllScheduleOfMonthByTeacherIdAsync.fulfilled),
      (state, action) => {
        // console.log('action',action?.meta?.arg?.teacherId)
        state.getTecherScheduleByTeacherIdLoader = false;
        state.getTecherScheduleByTeacherId = action.payload;
        state.teacherId = action?.meta?.arg?.teacherId;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllScheduleOfMonthByTeacherIdAsync.rejected
      ),
      (state, action) => {
        state.getTecherScheduleByTeacherIdLoader = false;
      }
    );
    // teacher scheduled slots
    builder.addMatcher(
      isAnyOf(
        getTeacherScheduleSlotsAsync.pending
      ),
      (state) => {
        state.getTeacherScheduledSlotsLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getTeacherScheduleSlotsAsync.fulfilled),
      (state, action) => {
        state.getTeacherScheduledSlotsLoader = false;
        state.getTeacherScheduledSlots = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getTeacherScheduleSlotsAsync.rejected
      ),
      (state, action) => {
        state.getTeacherScheduledSlotsLoader = false;
      }
    );
    // reminder time
    builder.addMatcher(
      isAnyOf(
        getAllReminderTimeAsync.pending
      ),
      (state) => {
        state.getAllReminderTimeLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllReminderTimeAsync.fulfilled),
      (state, action) => {
        state.getAllReminderTimeLoader = false;
        state.getAllReminderTime = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllReminderTimeAsync.rejected
      ),
      (state, action) => {
        state.getAllReminderTimeLoader = false;
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
