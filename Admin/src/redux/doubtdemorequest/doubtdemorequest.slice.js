import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllDoubtDemoRequestAsync,
  createEventNewAsync,
  getTeacherScheduleDateAsync,
  getScheduleByTeacherIdAsync
} from "./doubtdemorequest.async";

const initialState = {
  doubtdemorequestLoader: false,
  dateScheduleLoader: false,
  timeSchedulerLoader: false,
  doubtdemorquest: [],
  addEventNew: [],
  teacherSchduledate: [],
  teacherSchduleTime: []
};

export const doubtdemorquestSlice = createSlice({
  name: "doubtdemorquest",
  initialState,
  extraReducers: builder => {
    builder.addMatcher(
      isAnyOf(
        getAllDoubtDemoRequestAsync.pending,
        createEventNewAsync.pending,
      ),
      state => {
        state.doubtdemorequestLoader = true;
        state.dateScheduleLoader = false;
        state.timeSchedulerLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getTeacherScheduleDateAsync.pending,
      ),
      state => {
        state.doubtdemorequestLoader = false;
        state.dateScheduleLoader = true;
        state.timeSchedulerLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getScheduleByTeacherIdAsync.pending
      ),
      state => {
        state.doubtdemorequestLoader = false;
        state.dateScheduleLoader = false;
        state.timeSchedulerLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllDoubtDemoRequestAsync.fulfilled),
      (state, action) => {
        state.doubtdemorequestLoader = false;
        state.doubtdemorquest = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(createEventNewAsync.fulfilled),
      (state, action) => {
        state.doubtdemorequestLoader = false;
        state.addEventNew = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getTeacherScheduleDateAsync.fulfilled),
      (state, action) => {
        state.doubtdemorequestLoader = false;
        state.dateScheduleLoader = false;
        state.timeSchedulerLoader = false;
        state.teacherSchduledate = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getScheduleByTeacherIdAsync.fulfilled),
      (state, action) => {
        state.doubtdemorequestLoader = false;
        state.dateScheduleLoader = false;
        state.timeSchedulerLoader = false;
        state.teacherSchduleTime = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAllDoubtDemoRequestAsync.rejected,
        createEventNewAsync.rejected,
        getScheduleByTeacherIdAsync.rejected
      ),
      (state, action) => {
        state.doubtdemorequestLoader = false;
        state.dateScheduleLoader = false;
        state.timeSchedulerLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getTeacherScheduleDateAsync.rejected,
      ),
      (state, action) => {
        state.doubtdemorequestLoader = false;
        state.dateScheduleLoader = false;
        state.timeSchedulerLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getScheduleByTeacherIdAsync.rejected
      ),
      (state, action) => {
        state.doubtdemorequestLoader = false;
        state.dateScheduleLoader = false;
        state.timeSchedulerLoader = false;
      }
    );
  },


  reducers: {
    emptydoubtdemorquest: state => initialState
  }
});
export const { emptydoubtdemorquest } = doubtdemorquestSlice.actions;

export default doubtdemorquestSlice.reducer;
