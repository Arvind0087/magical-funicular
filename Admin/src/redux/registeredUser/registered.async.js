import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const getRegisteredAsync = createAsyncThunk(
  "admin/getRegistered",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/userRegistered`, payload, toolkit);
  }
);