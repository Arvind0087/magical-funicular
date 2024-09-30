import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const getChapterByStudentAsync = createAsyncThunk(
  "web/getchapterTopicsCount",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/chapterTopicsCount`, payload, toolkit);
  }
);
