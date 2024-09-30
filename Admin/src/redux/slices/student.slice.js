import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getStudentsForNoticeAsync,
  getStudentAsync,
  getstudentbyidAsync,
  createStudentAsync,
  updateStudentByIdAsync,
  deleteStudentByIdAsync,
  updateUserMPinByIdAsync,
  bulkSubscriptionChangeAsync,
  markStudentAttendanceAsync,
  getUserGenderDataAsync,
  getStudentSubscriptionAsync,
  usersBypackageIdAsync,
  deleteStudentCoursePackgeAsync,
  addUsersPackagesAsync,
} from "../async.api";

const initialState = {
  studentLoader: false,
  studentAttendanceLoader: false,
  students: [],
  studentById: [],
  StudentsByCBCB: [],
  searchStudentByName: [],
  studentadd: [],
  studentdelete: [],
  studentupdate: [],
  updateUserMPin: [],
  bulkSubscription: [],
  studentAttendance: [],
  getUserGenderData: [],
  getStudentSubscriptionData: [],
  usersByPackageIdLoader: false,
  usersByPackageId: [],
  deleteLoader: false,
  deletedUsers: [],
  assignStudentLoader: false,
  assignStudent: [],
};

export const studentSlice = createSlice({
  name: "students",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getStudentAsync.pending,
        getstudentbyidAsync.pending,
        getStudentsForNoticeAsync.pending,
        createStudentAsync.pending,
        updateStudentByIdAsync.pending,
        updateUserMPinByIdAsync.pending,
        bulkSubscriptionChangeAsync.pending,
        markStudentAttendanceAsync.pending,
        getUserGenderDataAsync.pending,
        getStudentSubscriptionAsync.pending
      ),
      (state) => {
        state.studentLoader = true;
      }
    );

    builder.addMatcher(isAnyOf(addUsersPackagesAsync.pending), (state) => {
      state.assignStudentLoader = true;
    });

    builder.addMatcher(isAnyOf(usersBypackageIdAsync.pending), (state) => {
      state.usersByPackageIdLoader = true;
    });

    builder.addMatcher(isAnyOf(markStudentAttendanceAsync.pending), (state) => {
      state.studentAttendanceLoader = true;
      state.studentLoader = false;
    });
    builder.addMatcher(isAnyOf(getStudentAsync.fulfilled), (state, action) => {
      state.studentLoader = false;
      state.students = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getstudentbyidAsync.fulfilled),
      (state, action) => {
        state.studentLoader = false;
        state.studentById = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(addUsersPackagesAsync.fulfilled),
      (state, action) => {
        state.assignStudentLoader = false;
        state.assignStudent = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(usersBypackageIdAsync.fulfilled),
      (state, action) => {
        state.usersByPackageIdLoader = false;
        state.usersByPackageId = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getStudentsForNoticeAsync.fulfilled),
      (state, action) => {
        state.studentLoader = false;
        state.StudentsByCBCB = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(createStudentAsync.fulfilled),
      (state, action) => {
        state.studentLoader = false;
        state.studentadd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateStudentByIdAsync.fulfilled),
      (state, action) => {
        state.studentLoader = false;
        state.studentupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateUserMPinByIdAsync.fulfilled),
      (state, action) => {
        state.studentLoader = false;
        state.updateUserMPin = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteStudentByIdAsync.fulfilled),
      (state, action) => {
        state.studentLoader = false;
        state.studentupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(markStudentAttendanceAsync.fulfilled),
      (state, action) => {
        state.studentAttendanceLoader = false;
        state.studentLoader = false;
        state.studentAttendance = action.payload;
      }
    );
    //-----Bulk Subscription Change
    builder.addMatcher(
      isAnyOf(bulkSubscriptionChangeAsync.fulfilled),
      (state, action) => {
        state.studentLoader = false;
        state.bulkSubscription = action.payload;
      }
    );

    // student report By pie graph
    builder.addMatcher(
      isAnyOf(getUserGenderDataAsync.fulfilled),
      (state, action) => {
        state.studentLoader = false;
        state.getUserGenderData = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getStudentSubscriptionAsync.fulfilled),
      (state, action) => {
        state.studentLoader = false;
        state.getStudentSubscriptionData = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getStudentAsync.rejected,
        getstudentbyidAsync.rejected,
        getStudentsForNoticeAsync.rejected,
        createStudentAsync.rejected,
        updateStudentByIdAsync.rejected,
        deleteStudentByIdAsync.rejected,
        updateUserMPinByIdAsync.rejected,
        bulkSubscriptionChangeAsync.rejected,
        markStudentAttendanceAsync.rejected,
        getUserGenderDataAsync.rejected,
        getStudentSubscriptionAsync.rejected
      ),
      (state, action) => {
        state.studentLoader = false;
      }
    );

    builder.addMatcher(
      isAnyOf(addUsersPackagesAsync.rejected),
      (state, action) => {
        state.assignStudentLoader = false;
      }
    );

    builder.addMatcher(
      isAnyOf(markStudentAttendanceAsync.rejected),
      (state, action) => {
        state.studentAttendanceLoader = false;
        state.studentLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(usersBypackageIdAsync.rejected),
      (state, action) => {
        state.usersByPackageIdLoader = false;
      }
    );
  },
  reducers: {
    emptyStudent: (state) => {
      return {
        ...initialState,
      };
    },
    emptyStudentAttendance: (state) => {
      state.studentAttendance = [];
    },
    epmtyStudentRecord: (state) => {
      state.students = [];
    },
  },
});
export const { emptyStudent, emptyStudentAttendance, epmtyStudentRecord } =
  studentSlice.actions;
export default studentSlice.reducer;
