import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createScheduleAsync,
  getScheduleByTeacherIdAsync,
  getScheduleByTeacherIdCalenderAsync,
} from "./schedule.async";
import { getSecheduleByTeacherIdAsync } from "redux/async.api";
import moment from "moment";
import { capitalize } from "lodash";

const initialState = {
  scheduleLoader: false,
  schedulescreate: [],
  schedulesByIdteacher: [],
  schedulesByIdteacherCalender: [],
  calenderLoader: false,
  events: [],
  openModal: false,
  selectedEventId: null,
  selectedRange: null,
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        createScheduleAsync.pending,
        getScheduleByTeacherIdAsync.pending,
        getScheduleByTeacherIdCalenderAsync.pending,
        getSecheduleByTeacherIdAsync.pending
      ),
      (state) => {
        state.scheduleLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(createScheduleAsync.fulfilled),
      (state, action) => {
        state.scheduleLoader = false;
        state.schedulescreate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getScheduleByTeacherIdAsync.fulfilled),
      (state, action) => {
        state.scheduleLoader = false;
        state.schedulesByIdteacher = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getScheduleByTeacherIdCalenderAsync.fulfilled),
      (state, action) => {
        const eventInfo = action.payload.data.map((info) => {
          return {
            ...info,
            allday: true,
            title: capitalize(info.title),
            textColor: moment(info.end).isBefore(moment(), "day")
              ? "#ff1f01"
              : "#5ace8f",
            backgroundColor: "#d8f3e4",
          };
        });
        state.scheduleLoader = false;
        state.events = eventInfo;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createScheduleAsync.rejected,
        getScheduleByTeacherIdAsync.rejected,
        getScheduleByTeacherIdCalenderAsync.rejected
      ),
      (state, action) => {
        state.scheduleLoader = false;
      }
    );
  },
  reducers: {
    setEventData(state, action) {
      state.events = action.payload;
    },
    // SELECT EVENT
    selectEvent(state, action) {
      state.openModal = true;
      state.selectedEventId = action.payload;
    },

    // SELECT RANGE
    selectRange(state, action) {
      state.openModal = true;
      state.selectedRange = action.payload;
    },

    // OPEN MODAL
    onOpenModal(state) {
      state.openModal = true;
    },

    // CLOSE MODAL
    onCloseModal(state) {
      state.openModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
    emptyschedule: (state) => initialState,
  },
});

export const { emptyschedule } = scheduleSlice.actions;

export default scheduleSlice.reducer;
