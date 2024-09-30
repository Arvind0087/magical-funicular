import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createEventRequestAsync,
  getAllEventByStudentIdAsync,
  getCalendarMonthAsync,
  getAllEventByStudentStatusIdAsync,
  getLiveEventByIdAsync,
  getEventByEventIdAsync,
  getAllSchedulesAsync,
} from "../async.api";

const initialState = {
  getAllEventLoader: false,
  getAllEvent: [],
  createEventRequest: [],
  createEventRequestLoader: false,
  getCalenderDataLoader: false,
  getCalenderData: [],
  eventByIdLoader: false,
  eventById: [],
  getAllScheduleLoader: false,
  getAllSchedule: [],
};

export const liveSlice = createSlice({
  name: "live",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(getAllEventByStudentIdAsync.pending),
      (state) => {
        state.getAllEventLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllEventByStudentIdAsync.fulfilled),
      (state, action) => {
        state.getAllEvent = action?.payload?.data;
        state.getAllEventLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllEventByStudentIdAsync.rejected),
      (state, action) => {
        state.getAllEventLoader = false;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllEventByStudentStatusIdAsync.pending),
      (state) => {
        state.getAllEventLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllEventByStudentStatusIdAsync.fulfilled),
      (state, action) => {
        state.getAllEvent = action?.payload?.data;
        state.getAllEventLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllEventByStudentStatusIdAsync.rejected),
      (state, action) => {
        state.getAllEventLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(getAllSchedulesAsync.pending), (state) => {
      state.getAllScheduleLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllSchedulesAsync.fulfilled),
      (state, action) => {
        state.getAllSchedule = action?.payload?.data;
        state.getAllScheduleLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllSchedulesAsync.rejected),
      (state, action) => {
        state.getAllScheduleLoader = false;
      }
    );

    // create event / book an event
    builder.addMatcher(isAnyOf(createEventRequestAsync.pending), (state) => {
      state.createEventRequestLoader = true;
    });
    builder.addMatcher(
      isAnyOf(createEventRequestAsync.fulfilled),
      (state, action) => {
        state.getAllSchedule = action.payload;
        state.createEventRequestLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(createEventRequestAsync.rejected),
      (state, action) => {
        state.createEventRequestLoader = false;
      }
    );
    // get calender data for demo and mentorship
    builder.addMatcher(isAnyOf(getCalendarMonthAsync.pending), (state) => {
      state.getCalenderDataLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getCalendarMonthAsync.fulfilled),
      (state, action) => {
        state.getCalenderData = action.payload;
        state.getCalenderDataLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(getCalendarMonthAsync.rejected),
      (state, action) => {
        state.getCalenderDataLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(getEventByEventIdAsync.pending), (state) => {
      state.eventByIdLoader = true;
      state.eventById = {};
    });

    builder.addMatcher(
      isAnyOf(getEventByEventIdAsync.fulfilled),
      (state, action) => {
        state.eventByIdLoader = false;
        state.eventById = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(getEventByEventIdAsync.rejected),
      (state, action) => {
        state.eventByIdLoader = false;
        state.eventById = [];
      }
    );

    builder.addMatcher(isAnyOf(getLiveEventByIdAsync.pending), (state) => {
      state.eventByIdLoader = true;
      state.eventById = {};
    });

    builder.addMatcher(
      isAnyOf(getLiveEventByIdAsync.fulfilled),
      (state, action) => {
        state.eventByIdLoader = false;
        state.eventById = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(getLiveEventByIdAsync.rejected),
      (state, action) => {
        state.eventByIdLoader = false;
        state.eventById = [];
      }
    );
  },
});

export default liveSlice.reducer;
