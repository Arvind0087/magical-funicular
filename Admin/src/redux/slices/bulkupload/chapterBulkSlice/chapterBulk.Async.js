import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../../AxiosClient";

export const UploadBulkChapterAsync = createAsyncThunk(
  "admin/UploadBulkChapterAsync",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/uploadChapterExcel`, payload, toolkit);
  }
);

export const getAllBulkFilesChapter = createAsyncThunk(
  "admin/getAllBulkFilesChapter",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllBulkFiles?page=${payload.page}&limit=${payload.limit}&fileType=chapter`, [], toolkit);
  }
);

