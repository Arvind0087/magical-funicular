import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const userActivationAsync = createAsyncThunk(
  "user/userActivation",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/userActivation`, payload, toolkit);
  }
);
