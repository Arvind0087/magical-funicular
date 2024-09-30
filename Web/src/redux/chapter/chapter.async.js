import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const getChaptersByIdAsync = createAsyncThunk(
  "web/getChaptersById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getChapterBySubjectId`,
      payload,
      toolkit
    );
  }
);
