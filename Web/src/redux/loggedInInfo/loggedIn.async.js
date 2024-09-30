import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const generateOtpAsync = createAsyncThunk(
  "web/generateOTP",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/generateOTP`, payload, toolkit);
  }
);

export const verifyOtpAsync = createAsyncThunk(
  "web/verifyOTP",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/verifyOTP`, payload, toolkit);
  }
);

export const loginSelectedUserAsync = createAsyncThunk(
  "web/loginSelectedUser",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/loginWithUserId`, payload, toolkit);
  }
);

export const switchProductAsync = createAsyncThunk(
  "web/switchProduct",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/switchProduct`, payload, toolkit);
  }
);
