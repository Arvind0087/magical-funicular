import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllPaymentSettingsAsync, updateWebByIdAsync } from "./WebAsync.api";

const initialState = {
  paymentSettingsLoader: false,
  paymentSettings: [],
  updatepaymentSettings: [],
};

export const PaymentSettingsSlice = createSlice({
  name: "PaymentSettings",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(getAllPaymentSettingsAsync.pending, updateWebByIdAsync.pending),
      (state) => {
        state.paymentSettingsLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllPaymentSettingsAsync.fulfilled),
      (state, action) => {
        state.paymentSettingsLoader = false;
        state.paymentSettings = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(updateWebByIdAsync.fulfilled),
      (state, action) => {
        state.paymentSettingsLoader = false;
        state.updatepaymentSettings = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllPaymentSettingsAsync.rejected, updateWebByIdAsync.rejected),
      (state, action) => {
        state.paymentSettingsLoader = false;
      }
    );
  },
  reducers: {
    emptyPaymentSettings: (state) => {
      state.updatepaymentSettings = [];
    },
  },
});
export const { emptyPaymentSettings } = PaymentSettingsSlice.actions;
export default PaymentSettingsSlice.reducer;
