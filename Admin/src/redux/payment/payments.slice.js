import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllpaymentsAsync } from "./payments.async";

const initialState = {
  paymentLoader: false,
  payments: [],
};

export const paymentSlice = createSlice({
  name: "payments",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllpaymentsAsync.pending), (state) => {
      state.paymentLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllpaymentsAsync.fulfilled),
      (state, action) => {
        state.paymentLoader = false;
        state.payments = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllpaymentsAsync.rejected),
      (state, action) => {
        state.paymentLoader = false;
      }
    );
  },
  reducers: {
    emptypayments: (state) => initialState,
  },
});

export const { emptypayments } = paymentSlice.actions;

export default paymentSlice.reducer;
