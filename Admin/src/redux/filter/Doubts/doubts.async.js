import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const filterAllDoubtsAsync = createAsyncThunk(
  "admin/filterAllDoubtsAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/`, [], toolkit);
  }
);
