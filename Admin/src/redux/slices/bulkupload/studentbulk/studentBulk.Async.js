import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../../AxiosClient";

export const UploadBulkAsync = createAsyncThunk(
  "admin/createBulkAsync",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/uploadStudentExcel`, payload, toolkit);
  }
);

export const getAllBulkFiles = createAsyncThunk(
  "admin/getAllBulkFiles",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllBulkFiles?page=${payload.page}&limit=${payload.limit}&fileType=student`, [], toolkit);
  }
);

