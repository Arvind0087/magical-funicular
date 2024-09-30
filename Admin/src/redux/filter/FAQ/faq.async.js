import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const filterAllFaqAsync = createAsyncThunk(
  "admin/filterAllFaqAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllFaq`, [], toolkit);
  }
);
