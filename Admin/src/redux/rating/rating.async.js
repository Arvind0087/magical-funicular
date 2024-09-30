import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getAllRatingAsync = createAsyncThunk(
  "admin/getAllRating",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllRating?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&type=${payload.type || ""}`,
      {},
      toolkit
    );
  }
);
