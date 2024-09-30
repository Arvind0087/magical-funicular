import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const filterAllAcademicsAsync = createAsyncThunk(
  "admin/filterAllAcademicsAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/`, [], toolkit);
  }
);
