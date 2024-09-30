import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getAllpaymentsAsync = createAsyncThunk(
  "admin/getAllpayments",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllPaymentList?page=${payload.page || ""}&limit=${payload.limit || ""
  }`, [], toolkit);
  }
);
