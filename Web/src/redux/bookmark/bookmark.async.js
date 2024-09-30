import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const addBookmarkAsync = createAsyncThunk(
  "web/bookmark",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addBookmark`, payload, toolkit);
  }
);
