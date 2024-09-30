import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../../AxiosClient";

export const uploadStaffBulkAsync = createAsyncThunk(
  "admin/createBulkAsync",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/uploadStaffExcel`, payload, toolkit);
  }
);
export const getStaffBulkFiles = createAsyncThunk(
  "admin/getAllBulkFiles",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBulkFiles?page=${payload.page}&limit=${payload.limit}&fileType=staff`,
      [],
      toolkit
    );
  }
);
