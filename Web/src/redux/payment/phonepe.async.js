import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const initPaymentphonepayAsync = createAsyncThunk(
  "user/initWebPaymentphonepay",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/initWebPaymentphonepay`,
      payload,
      toolkit
    );
  }
);

export const verifyphonepayPaymentAsync = createAsyncThunk(
  "user/verifyphonepayPayment",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/verifyphonepayPayment`,
      payload,
      toolkit
    );
  }
);
