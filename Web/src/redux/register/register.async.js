import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const generateOtpAsync = createAsyncThunk(
  "web/generateOTP",
  async (
    payload,
    toolkit
  ) => {
    return await AxiosClient("POST", `/generateOTP`, payload, toolkit);
  }
);

export const verifyOtpAsync = createAsyncThunk(
  "web/verifyOTP",
  async (
    payload,
    toolkit
  ) => {
    return await AxiosClient("POST", `/verifyOTP`, payload, toolkit);
  }
);

export const loginSelectedUserAsync = createAsyncThunk(
  "web/loginSelectedUser",
  async (
    payload,
    toolkit
  ) => {
    return await AxiosClient("POST", `/loginWithUserId`, payload, toolkit);
  }
);

export const userSignupAsync = createAsyncThunk(
  "user/userSignup",
  async (
    payload,
    toolkit
  ) => {
    return await AxiosClient("POST", `/userSignup`, payload, toolkit);
  }
);

export const loginWithMPinAsync = createAsyncThunk(
  "user/loginWithMpin",
  async (
    payload,
    toolkit
  ) => {
    return await AxiosClient("POST", `/loginWithMpin`, payload, toolkit);
  }
);

export const switchAccountAsync = createAsyncThunk(
  "admin/switchAccount",
  async (
    payload,
    toolkit
  ) => {
    return await AxiosClient("POST", `/switchAccount`, payload, toolkit);
  }
);
