import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getAllActivityAsync = createAsyncThunk(
  "admin/getAllActivity",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllActivity?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&search=${payload.search || ""}`,
      [],
      toolkit
    );
  }
);
