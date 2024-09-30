import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getSettingByTypeAsync,
  updateSettingByTypeAsync,
} from "./mentorshippackage.async";

const initialState = {
  mentorshippackageLoader: false,
  mentorshippackageupdate: {},
  mentorshippackage: {},
};

export const mentorshippackageSlice = createSlice({
  name: "Mentorship Package",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(updateSettingByTypeAsync.pending, getSettingByTypeAsync.pending),
      (state) => {
        state.mentorshippackageLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(updateSettingByTypeAsync.fulfilled),
      (state, action) => {
        state.mentorshippackageLoader = false;
        state.mentorshippackageupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getSettingByTypeAsync.fulfilled),
      (state, action) => {
        state.mentorshippackageLoader = false;
        state.mentorshippackage = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(
        updateSettingByTypeAsync.rejected,
        getSettingByTypeAsync.rejected
      ),
      (state, action) => {
        state.mentorshippackageLoader = false;
      }
    );
  },
  reducers: {
    emptymentorshippackage: (state) => {
      state.mentorshippackageupdate = {};
    },
  },
});

export const { emptymentorshippackage } = mentorshippackageSlice.actions;

export default mentorshippackageSlice.reducer;
