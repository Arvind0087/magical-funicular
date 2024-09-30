import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  generateOtpAsync,
  updateAdminPasswordAsync,
  verifyOtpAsync,
} from "./otp.async";

const initialState = {
  otpLoader: false,
  OTP: [],
  otpverify: [],
  passwordupdate: [],
};

export const otpSlice = createSlice({
  name: "otp",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        generateOtpAsync.pending,
        verifyOtpAsync.pending,
        updateAdminPasswordAsync.pending
      ),
      (state) => {
        state.otpLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(generateOtpAsync.fulfilled), (state, action) => {
      state.otpLoader = false;
      state.OTP = action.payload;
    });
    builder.addMatcher(isAnyOf(verifyOtpAsync.fulfilled), (state, action) => {
      state.otpLoader = false;
      state.otpverify = action.payload;
    });
    builder.addMatcher(
      isAnyOf(updateAdminPasswordAsync.fulfilled),
      (state, action) => {
        state.otpLoader = false;
        state.passwordupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        generateOtpAsync.rejected,
        verifyOtpAsync.rejected,
        updateAdminPasswordAsync.rejected
      ),
      (state, action) => {
        state.otpLoader = false;
      }
    );
  },
  reducers: {
    emptyotp: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyotp } = otpSlice.actions;

export default otpSlice.reducer;
