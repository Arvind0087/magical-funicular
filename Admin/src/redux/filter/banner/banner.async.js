import { AxiosClient } from "redux/AxiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getFilterAsync = createAsyncThunk(
  "admin/getFilterAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBanner
      `,
      [],
toolkit
    );
  }
);
