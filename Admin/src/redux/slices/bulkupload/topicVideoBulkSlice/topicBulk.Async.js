import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";


export const UploadBulkContentAsync = createAsyncThunk(
  "admin/uploadbulkcontent",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/uploadBulkContent`, payload, toolkit);
  }
);

export const getAllBulkContentFiles = createAsyncThunk(
  "admin/getAllBulkContentFiles",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBulkFiles?page=${payload.page}&limit=${payload.limit}&fileType=content`,
      [],
      toolkit
    );
  }
);
