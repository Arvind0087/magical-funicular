import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addEventAsync,
  updateEventAsync,
  getAllEventsAsync,
  getEventByIdAsync,
  deleteEventAsync
} from "../async.api";

const initialState = {
  eventsLoader: false,
  events: [],
  eventadd: [],
  eventupdate: [],
  eventById: [],
  eventsdelete:[]
};

export const eventsSlice = createSlice({
  name: "events",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllEventsAsync.pending,
        addEventAsync.pending,
        updateEventAsync.pending,
        getEventByIdAsync.pending,
        deleteEventAsync.pending
      ),
      (state) => {
        state.eventsLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllEventsAsync.fulfilled),
      (state, action) => {
        state.eventsLoader = false;
        state.events = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(addEventAsync.fulfilled), (state, action) => {
      state.eventsLoader = false;
      state.eventadd = action.payload;
    });
    builder.addMatcher(isAnyOf(updateEventAsync.fulfilled), (state, action) => {
      state.eventsLoader = false;
      state.eventupdate = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getEventByIdAsync.fulfilled),
      (state, action) => {
        state.eventsLoader = false;
        state.eventById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteEventAsync.fulfilled),
      (state, action) => {
        state.eventsLoader = false;
        state.eventsdelete = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllEventsAsync.rejected,
        addEventAsync.rejected,
        updateEventAsync.rejected,
        deleteEventAsync.rejected,
        getEventByIdAsync.rejected
      ),
      (state, action) => {
        state.eventsLoader = false;
      }
    );
  },
  reducers: {
    emptyevents: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyevents } = eventsSlice.actions;

export default eventsSlice.reducer;


