import { AxiosClient } from "redux/AxiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addVoucherAsync = createAsyncThunk(
  "admin/addVoucher",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addVoucher`, payload, toolkit);
  }
);

export const getAllVoucherAsync = createAsyncThunk(
  "admin/getAllVoucher",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllVoucher?page=${payload.page || ""}&limit=${payload.limit || ""}`,
      [],
      toolkit
    );
  }
);

export const getVoucherByIdAsync = createAsyncThunk(
  "admin/getVoucherById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getVoucherById/${payload}`, [], toolkit);
  }
);

export const updateVoucherByIdAsync = createAsyncThunk(
  "admin/updateVoucherById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateVoucherById`, payload, toolkit);
  }
);

export const updateVoucherStatusAsync = createAsyncThunk(
  "admin/updateVoucherStatus",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateVoucherStatus`, payload, toolkit);
  }
);
