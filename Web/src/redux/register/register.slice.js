import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  generateOtpAsync,
  loginSelectedUserAsync,
  loginWithMPinAsync,
  switchAccountAsync,
  userSignupAsync,
  verifyOtpAsync,
} from "./register.async";

const initialState = {
  registerLoader: false,
  register: [],
  otpVerifyResponce: {},
  IdWithLogin: [],
  createaccount: [],
  secondaryUser: false,
  mPinLoader: false,
  mPinResponce: {},
  switchaccount: {},
  systemToken: null,
};

export const registerSlice = createSlice({
  name: "register",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        generateOtpAsync.pending,
        verifyOtpAsync.pending,
        loginSelectedUserAsync.pending,
        userSignupAsync.pending,
        loginWithMPinAsync.pending,
        switchAccountAsync.pending
      ),
      (state) => {
        state.registerLoader = true;
        state.mPinLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(generateOtpAsync.fulfilled), (state, action) => {
      state.registerLoader = false;
      state.register = action.payload;
    });
    builder.addMatcher(isAnyOf(verifyOtpAsync.fulfilled), (state, action) => {
      state.registerLoader = false;
      state.otpVerifyResponce = action.payload;
    });
    builder.addMatcher(
      isAnyOf(loginSelectedUserAsync.fulfilled),
      (state, action) => {
        state.registerLoader = false;
        state.IdWithLogin = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(loginWithMPinAsync.fulfilled),
      (state, action) => {
        state.mPinLoader = false;
        state.mPinResponce = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(userSignupAsync.fulfilled), (state, action) => {
      state.registerLoader = false;
      state.createaccount = action.payload;
    });
    builder.addMatcher(
      isAnyOf(switchAccountAsync.fulfilled),
      (state, action) => {
        state.registerLoader = false;
        state.switchaccount = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        generateOtpAsync.rejected,
        verifyOtpAsync.rejected,
        loginSelectedUserAsync.rejected,
        userSignupAsync.rejected,
        loginWithMPinAsync.rejected,
        switchAccountAsync.rejected
      ),
      (state, action) => {
        state.registerLoader = false;
        state.mPinLoader = false;
      }
    );
  },
  reducers: {
    SystemToken: (state, action) => {
      state.systemToken = action.payload;
    },
    emptyregister: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyregister, SystemToken } = registerSlice.actions;

export default registerSlice.reducer;
