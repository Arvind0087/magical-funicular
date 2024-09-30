import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllNoticeByStudentIdAsync, getStudentLatestNoticeAsync } from "redux/async.api";
const initialState = {
  latestNotification:[],
  latestNotificationLoader:false,
  allNotification:[],
  allNotificationLoader:false,
   deviceToken: null
};
const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getStudentLatestNoticeAsync.pending), (state) => {
      state.latestNotificationLoader = true;
      state.latestNotification = [];
    });
    builder.addMatcher(
      isAnyOf(getStudentLatestNoticeAsync.fulfilled),
      (state, action) => {
        state.latestNotificationLoader = false;
        state.latestNotification = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(getStudentLatestNoticeAsync.rejected),
      (state, action) => {
        state.latestNotificationLoader = false;
        state.latestNotification = [];
      }
    );
    // all notification

    builder.addMatcher(isAnyOf(getAllNoticeByStudentIdAsync.pending), (state) => {
      state.allNotificationLoader = true;
      state.allNotification = [];
    });
    builder.addMatcher(
      isAnyOf(getAllNoticeByStudentIdAsync.fulfilled),
      (state, action) => {
        state.allNotificationLoader = false;
        state.allNotification = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllNoticeByStudentIdAsync.rejected),
      (state, action) => {
        state.allNotificationLoader = false;
        state.allNotification = [];
      }
    );
  },
    reducers: {
      setDeviceToken: (state, action) => {
        state.deviceToken = action.payload
      },
    }
  })
  
  export const { setDeviceToken } = notificationSlice.actions
  
  export default notificationSlice.reducer