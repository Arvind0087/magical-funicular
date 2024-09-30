import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const getFreeEventByStudentIdAsync = createAsyncThunk(
  "web/getFreeEventByStudentId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getFreeEventByStudentId?status=${payload.status}&batchTypeId=${payload.batchTypeId}`,
      [],
      toolkit
    );
  }
);
