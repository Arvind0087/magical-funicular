import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const getRevisionBysubBychapterAsync = createAsyncThunk(
  "web/getRevisionByCategory",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getRevisionByCategory`, payload, toolkit);
  }
);
export const getTopicBysubBychapterAsync = createAsyncThunk(
  "web/getTopicByChapterId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getTopicByChapterId`, payload, toolkit);
  }
);
