import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getTopicBySubjecIdAsync = createAsyncThunk(
  "admin/getTopicByChapterId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getTopicByChapterId`, payload, toolkit);
  }
);
