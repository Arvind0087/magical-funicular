import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const filterAllNoticeAsync = createAsyncThunk(
  "admin/filterAllNoticeAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllNotice`, [], toolkit);
  }
);
