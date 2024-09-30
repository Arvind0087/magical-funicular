import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const sendMessageAsync = createAsyncThunk(
  "web/sendMessage",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/sendMessage`, payload, toolkit);
  }
);

export const getyoutubeChatsAsync = createAsyncThunk(
  "web/getyoutubeChats",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getyoutubeChats`, payload, toolkit);
  }
);
