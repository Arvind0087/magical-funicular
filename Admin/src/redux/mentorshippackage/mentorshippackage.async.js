import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getSettingByTypeAsync = createAsyncThunk(
  "admin/getSettingByType",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getSettingByType?type=mentor`,
      payload,
      toolkit
    );
  }
);
export const updateSettingByTypeAsync = createAsyncThunk(
  "admin/updateSettingByType",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateSettingByType`, payload, toolkit);
  }
);
