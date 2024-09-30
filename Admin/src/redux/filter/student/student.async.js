import { AxiosClient } from "redux/AxiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const getFilterAsync = createAsyncThunk(
  "admin/getAllstudents",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllstudents`, [], toolkit);
  }
);
