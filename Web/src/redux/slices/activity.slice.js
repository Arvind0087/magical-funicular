import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getActivityReportOfUserAsync, getActivityOfUserAsync } from "../async.api";
const initialState = {
    getActivityReportOfUserLoader: false,
    activityReportOfUser:{},
    //getActivityOfUser
    getActivityOfUserLoader: false,
    activityOfUser:[],
};

export const activitySlice = createSlice({
  name: "activityReport",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getActivityReportOfUserAsync.pending), (state) => {
      state.getActivityReportOfUserLoader = true;
    });
    builder.addMatcher(isAnyOf(getActivityReportOfUserAsync.fulfilled), (state, action) => {
      state.getActivityReportOfUserLoader = false;
      state.activityReportOfUser = action.payload.data;
    });
    builder.addMatcher(isAnyOf(getActivityReportOfUserAsync.rejected), (state, action) => {
      state.getActivityReportOfUserLoader = false;
    });
    builder.addMatcher(isAnyOf(getActivityOfUserAsync.pending), (state) => {
      state.getActivityOfUserLoader = true;
    });
    builder.addMatcher(isAnyOf(getActivityOfUserAsync.fulfilled), (state, action) => {
      state.getActivityOfUserLoader = false;
      state.activityOfUser = action.payload.data;
    });
    builder.addMatcher(isAnyOf(getActivityOfUserAsync.rejected), (state, action) => {
      state.getActivityOfUserLoader = false;
    });
  },
});


export default activitySlice.reducer;
