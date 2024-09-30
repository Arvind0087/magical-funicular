import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

export const generateOtpAsync = createAsyncThunk(
  "admin/generateotp",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/generateOtp`, payload, toolkit);
  }
);

export const verifyOtpAsync = createAsyncThunk(
  "admin/verifyOtpAsync",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/verifyOtp`, payload, toolkit);
  }
);

export const updateAdminPasswordAsync = createAsyncThunk(
  "admin/updateAdminPasswordAsync",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateAdminPassword`, payload, toolkit);
  }
);
