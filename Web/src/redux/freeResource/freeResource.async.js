import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const modalPaperUserIdAsync = createAsyncThunk(
  "web/modalPaperUserId",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/modalPaperUserId`, [], toolkit);
  }
);

export const userAllPyqsAsync = createAsyncThunk(
  "web/userAllPyqs",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/userAllPyqs`, [], toolkit);
  }
);
