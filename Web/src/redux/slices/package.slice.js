import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getpackagebyidAsync, getCoursebystudentidAsync, initiatePaymentAsync } from "../async.api";

const initialState = {
  packageLoader: false,
  packagesadvantage: [],
  courseByStudentLoader: false,
  courseByStudent: {},
  initialPaymentLoader: false,
  initialPayment: []
};

export const packageSlice = createSlice({
  name: "packages",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(getpackagebyidAsync.pending, getCoursebystudentidAsync.pending),
      (state) => {
        state.packageLoader = true;
        state.courseByStudentLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getpackagebyidAsync.fulfilled), (state, action) => {
      state.packageLoader = false;
      state.packagesadvantage = action.payload;
    });
    builder.addMatcher(isAnyOf(getCoursebystudentidAsync.fulfilled), (state, action) => {
      state.courseByStudentLoader = false;
      state.courseByStudent = action.payload.data;

    });

    builder.addMatcher(
      isAnyOf(getpackagebyidAsync.rejected, getCoursebystudentidAsync.rejected),
      (state, action) => {
        state.packageLoader = false;
        state.courseByStudentLoader = false;
      }
    );
    // initial payment
    builder.addMatcher(
      isAnyOf(initiatePaymentAsync.pending),
      (state) => {
        state.initialPaymentLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(initiatePaymentAsync.fulfilled), (state, action) => {
      state.initialPaymentLoader = false;
      state.initialPayment = action.payload.data;
    });
    builder.addMatcher(isAnyOf(initiatePaymentAsync.rejected), (state, action) => {
      state.initialPaymentLoader = false;
    });
  },
});

export default packageSlice.reducer;