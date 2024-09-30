import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getLiveClassHistoryAsync = createAsyncThunk(
  "admin/getLiveClassHistoryAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getLiveClassHistory?page=${payload.page}&limit=${payload.limit}&type=instruction`,
      [],
toolkit
    );
  }
);
