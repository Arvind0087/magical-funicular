import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const filterAllScholorshipAsync = createAsyncThunk(
  "admin/filterAllScholorshipAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/`, [], toolkit);
  }
);
