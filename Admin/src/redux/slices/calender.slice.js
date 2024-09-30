import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getSecheduleByTeacherIdAsync } from "../async.api";
import moment from "moment";
import { capitalize } from "lodash";

const initialState = {
  calenderLoader: false,
  events: [],
  openModal: false,
  selectedEventId: null,
  selectedRange: null,
};

export const calenderSlice = createSlice({
  name: "calender",
  initialState,
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
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(getSecheduleByTeacherIdAsync.pending),
      (state) => {
        state.calenderLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getSecheduleByTeacherIdAsync.fulfilled),
      (state, action) => {
        const eventInfo = action.payload.data.map((info) => {
          return {
            ...info,
            title: capitalize(info.title),
            textColor: moment(info.end).isBefore(moment(), "day")
              ? "#ff1f01"
              : "#5ace8f",
          };
        });
        state.calenderLoader = false;
        state.events = eventInfo;
      }
    );
    builder.addMatcher(
      isAnyOf(getSecheduleByTeacherIdAsync.rejected),
      (state, action) => {
        state.calenderLoader = false;
      }
    );
  },
});

export const {
  onOpenModal,
  onCloseModal,
  selectEvent,
  selectRange,
  setEventData,
} = calenderSlice.actions;

export default calenderSlice.reducer;
