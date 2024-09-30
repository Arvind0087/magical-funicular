import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getstudentAsync,
  getStudentByIdAsync,
  getAllUserDetails,
  getAllowedSessionByUserIdAsync,
} from "../async.api";

const initialState = {
  studentLoader: false,
  students: [],
  studentById: [],
  secondaryUser: [],
  getAllowedSession: [],
  getAllowedSessionLoader: false,
};

export const studentSlice = createSlice({
  name: "students",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getstudentAsync.pending,
        getStudentByIdAsync.pending,
        getAllUserDetails.pending
      ),
      (state) => {
        state.studentLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getstudentAsync.fulfilled), (state, action) => {
      // console.log('action.payload', action.payload)
      state.studentLoader = false;
      state.students = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getAllUserDetails.fulfilled),
      (state, action) => {
        // console.log('action.payload', action.payload)
        state.studentLoader = false;
        state.secondaryUser = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getStudentByIdAsync.fulfilled),
      (state, action) => {
        state.studentLoader = false;
        state.studentById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getstudentAsync.rejected,
        getStudentByIdAsync.rejected,
        getAllUserDetails.rejected
      ),
      (state, action) => {
        state.studentLoader = false;
      }
    );
    // get session details of student
    builder.addMatcher(
      isAnyOf(getAllowedSessionByUserIdAsync.pending),
      (state) => {
        state.getAllowedSessionLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllowedSessionByUserIdAsync.fulfilled),
      (state, action) => {
        // console.log('action.payload', action.payload)
        state.getAllowedSessionLoader = false;
        state.getAllowedSession = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllowedSessionByUserIdAsync.rejected),
      (state, action) => {
        // console.log('action.payload', action.payload)
        state.getAllowedSessionLoader = false;
        state.getAllowedSession = action.payload;
      }
    );
  },
});

export default studentSlice.reducer;
