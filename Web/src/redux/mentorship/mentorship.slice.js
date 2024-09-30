import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllMentorshipfeatureAsync } from "./mentorshipHelp.async";
import {getAllMentorshipHelpAsync} from "./mentorshipHelp.async";
import { getAllMentorshipWhyMentorpAsync } from "./mentorshipHelp.async";
import { getAllMentorAsync } from "./mentorshipHelp.async";
const initialState = {
    //feature
    mentorshiphelpfeatureLoader: false,
    mentorshiphelpfeatureBy: [],
    //help
    mentorshiphelpHelpLoader: false,
    mentorshiphelpHelpBy: [],
    //mentor
    mentorshiphelpMentorLoader: false,
    mentorshiphelpMentorBy: [],
    //teacher
    mentorTeacherLoader: false,
    mentorTeacherMentorBy: [],
}
export const mentorshipHelpSlice = createSlice({
  name: "mentorshiphelp",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllMentorshipfeatureAsync.pending), (state) => {
      state.mentorshiphelpfeatureLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllMentorshipfeatureAsync.fulfilled),
      (state, action) => {
        state.mentorshiphelpfeatureLoader = false;
        state.mentorshiphelpfeatureBy = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllMentorshipfeatureAsync.rejected),
      (state, action) => {
        state.mentorshiphelpfeatureLoader = false;
      }
    );
    builder.addMatcher(isAnyOf(getAllMentorshipHelpAsync.pending), (state) => {
        state.mentorshiphelpHelpLoader = true;
      });
      builder.addMatcher(
        isAnyOf(getAllMentorshipHelpAsync.fulfilled),
        (state, action) => {
          state.mentorshiphelpHelpLoader = false;
          state.mentorshiphelpHelpBy = action.payload.data;
        }
      );
      builder.addMatcher(
        isAnyOf(getAllMentorshipHelpAsync.rejected),
        (state, action) => {
          state.mentorshiphelpHelpLoader = false;
        }
      );
      builder.addMatcher(isAnyOf(getAllMentorshipWhyMentorpAsync.pending), (state) => {
        state.mentorshiphelpMentorLoader = true;
      });
      builder.addMatcher(
        isAnyOf(getAllMentorshipWhyMentorpAsync.fulfilled),
        (state, action) => {
          state.mentorshiphelpMentorLoader = false;
          state.mentorshiphelpMentorBy = action.payload.data;
        }
      );
      builder.addMatcher(
        isAnyOf(getAllMentorshipWhyMentorpAsync.rejected),
        (state, action) => {
          state.mentorshiphelpMentorLoader = false;
        }
      );
      builder.addMatcher(isAnyOf(getAllMentorAsync.pending), (state) => {
        state.mentorTeacherLoader = true;
      });
      builder.addMatcher(
        isAnyOf(getAllMentorAsync.fulfilled),
        (state, action) => {
          state.mentorTeacherLoader = false;
          state.mentorTeacherMentorBy = action.payload.data;
        }
      );
      builder.addMatcher(
        isAnyOf(getAllMentorAsync.rejected),
        (state, action) => {
          state.mentorTeacherLoader = false;
        }
      );
  },
});

export default mentorshipHelpSlice.reducer;