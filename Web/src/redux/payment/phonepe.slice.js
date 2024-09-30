import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  initPaymentphonepayAsync,
  verifyphonepayPaymentAsync,
} from "./phonepe.async";

const initialState = {
  initiatePaymentLoader: false,
  initiatePayment: [],
  verifyLoader: false,
  verifyPayment: [],
};

export const phonepeSlice = createSlice({
  name: "phonepe",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(initPaymentphonepayAsync.pending), (state) => {
      state.initiatePaymentLoader = true;
      //   state.initiatePayment = [];
    });
    builder.addMatcher(
      isAnyOf(initPaymentphonepayAsync.fulfilled),
      (state, action) => {
        state.initiatePaymentLoader = false;
        state.initiatePayment = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(initPaymentphonepayAsync.rejected),
      (state, action) => {
        state.initiatePaymentLoader = false;
        // state.initiatePayment = [];
      }
    );

    builder.addMatcher(isAnyOf(verifyphonepayPaymentAsync.pending), (state) => {
      state.verifyLoader = true;
      //   state.initiatePayment = [];
    });
    builder.addMatcher(
      isAnyOf(verifyphonepayPaymentAsync.fulfilled),
      (state, action) => {
        state.verifyLoader = false;
        state.verifyPayment = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(verifyphonepayPaymentAsync.rejected),
      (state, action) => {
        state.verifyLoader = false;
        // state.initiatePayment = [];
      }
    );
  },
});

export default phonepeSlice.reducer;
