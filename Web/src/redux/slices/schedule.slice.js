import { createSlice, isAnyOf } from "@reduxjs/toolkit";
// import { capitalizeFirstLetter } from "utils/CapitalizeFirstLetter";
import moment from "moment";
import {
  createScheduleAsync,
  getScheduleByTeacherIdAsync,
  getScheduleByTeacherIdCalenderAsync,
  joinLiveClassAsync,
  getEventByStatusAsync,
  watchingLiveClassAsync,
} from "../async.api";

const initialState = {
  userJoinLoader: false,
  userJoin: [],
  schedulescreate: [],
  scheduleLoader: false,
  schedulescreate: [],
  schedulesByIdteacher: [],
  schedulesByIdteacherCalender: [],
  calenderLoader: false,
  events: [],
  eventsId: "",
  liveUsers: "",
  openModal: false,
  selectedEventId: null,
  selectedRange: null,
  joinLoader: false,
  joinDetails: [],
  eventStatusLoader: false,
  eventStatusData: [],
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        createScheduleAsync.pending,
        getScheduleByTeacherIdAsync.pending,
        getScheduleByTeacherIdCalenderAsync.pending
      ),
      (state) => {
        state.scheduleLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(watchingLiveClassAsync.pending), (state) => {
      state.userJoinLoader = true;
    });

    builder.addMatcher(
      isAnyOf(watchingLiveClassAsync.fulfilled),
      (state, action) => {
        state.userJoinLoader = false;
        state.userJoin = action.payload;
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

    builder.addMatcher(isAnyOf(joinLiveClassAsync.pending), (state) => {
      state.joinLoader = true;
    });

    builder.addMatcher(
      isAnyOf(joinLiveClassAsync.fulfilled),
      (state, action) => {
        state.joinLoader = false;
        state.joinDetails = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(joinLiveClassAsync.rejected),
      (state, action) => {
        state.joinLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(getEventByStatusAsync.pending), (state) => {
      state.eventStatusLoader = true;
    });

    builder.addMatcher(
      isAnyOf(getEventByStatusAsync.fulfilled),
      (state, action) => {
        state.eventStatusLoader = false;
        state.eventStatusData = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getEventByStatusAsync.rejected),
      (state, action) => {
        state.eventStatusLoader = false;
      }
    );

    builder.addMatcher(
      isAnyOf(getScheduleByTeacherIdCalenderAsync.fulfilled),
      (state, action) => {
        const eventInfo = action.payload.data.map((info) => {
          return {
            ...info,
            allday: true,
            // title: capitalizeFirstLetter(info.title),
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

    builder.addMatcher(
      isAnyOf(watchingLiveClassAsync.rejected),
      (state, action) => {
        state.userJoinLoader = false;
      }
    );
  },
  reducers: {
    setEventId(state, action) {
      state.eventsId = action.payload;
    },

    setEventData(state, action) {
      state.events = action.payload;
    },

    setUsersData(state, action) {
      state.liveUsers = action.payload;
    },

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

export const { emptyschedule, setEventId, setUsersData } =
  scheduleSlice.actions;

export default scheduleSlice.reducer;
