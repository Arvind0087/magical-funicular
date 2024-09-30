import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

// Admin

export const getAllAdminAsync = createAsyncThunk(
  "admin/getAllAdminAsync",
  async (payload, { dispatch, rejectWithValue, fulfillWithValue }) => {
    return await AxiosClient("GET", `/getSettingByType?type=admin`, [], {
      dispatch,
      rejectWithValue,
      fulfillWithValue,
    });
  }
);

//Web
export const getAllWebAsync = createAsyncThunk(
  "admin/getAllWebAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getSettingByType?type=siteSetting`, [], toolkit);
  }
);


//Site setting for Admin(only get) 
export const getSettingForAdminAsync = createAsyncThunk(
  "admin/getSettingForAdminAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getSettingForAdmin`, [], toolkit);
  }
);

// Mobile App
export const getAllMobileAsync = createAsyncThunk(
  "admin/getAllMobileAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getSettingByType?type=mobileApp`, [], toolkit);
  }
);

// Payment Settings

export const getAllPaymentSettingsAsync = createAsyncThunk(
  "admin/getAllPaymentSettingsAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getSettingByType?type=razorpay`, [], toolkit);
  }
);

//instruction

export const getAllInstructionAsync = createAsyncThunk(
  "admin/getAllInstructionAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getSettingByType?type=instruction`, [], toolkit);
  }
);

export const updateWebByIdAsync = createAsyncThunk(
  "admin/updateWebByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateSettingByType`, payload, toolkit);
  }
);

//Bookmark Image 
export const getAllBookmarkImagesAsync = createAsyncThunk(
  "admin/getAllBookmarkImagesAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getSettingByType?type=bookmarkImages`, [], toolkit);
  }
);
