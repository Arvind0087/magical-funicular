import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../../AxiosClient";

export const uploadRevisionBulkAsync = createAsyncThunk(
  "admin/uploadRevisionExcel",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/uploadRevisionExcel`, payload, toolkit);
  }
);
export const getRevisionBulkFiles = createAsyncThunk(
  "admin/getAllBulkFiles",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBulkFiles?page=${payload.page}&limit=${payload.limit}&fileType=revision`,
      [],
      toolkit
    );
  }
);