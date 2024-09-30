import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getyoutubeChatsAsync = createAsyncThunk(
  "web/getyoutubeChats",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getyoutubeChats`, payload, toolkit);
  }
);
