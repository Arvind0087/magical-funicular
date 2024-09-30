import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const getLiveUserAsync = createAsyncThunk(
  "admin/liveClassReport",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/liveClassReport`, payload, toolkit);
  }
);