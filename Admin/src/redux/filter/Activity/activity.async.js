import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const filterAllActivityAsync = createAsyncThunk(
  "admin/filterAllActivityAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllActivity`, [], toolkit);
  }
);
