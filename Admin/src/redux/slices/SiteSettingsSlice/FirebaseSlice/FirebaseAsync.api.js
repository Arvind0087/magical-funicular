import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../../AxiosClient";

export const getAllFirebaseSettingsAsync = createAsyncThunk(
    "admin/getAllFirebaseSettingsAsync",
    async (payload, toolkit) => {
      return await AxiosClient("GET", `/getSettingByType?type=firebase`, [], toolkit);
    }
  );
  
  export const updateFirebaseByIdAsync = createAsyncThunk(
    "admin/updateFirebaseByIdAsync",
    async (payload, toolkit) => {
      return await AxiosClient("PUT", `/updateSettingByType`, payload, toolkit);
    }
  );
  