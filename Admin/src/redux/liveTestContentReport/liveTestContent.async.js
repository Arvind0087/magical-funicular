import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const liveTestContentAsync = createAsyncThunk(
  "admin/liveTestContent",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/testAndLearningContentReport`, payload, toolkit);
  }
);