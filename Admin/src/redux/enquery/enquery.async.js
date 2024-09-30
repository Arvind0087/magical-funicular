import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getAllEnquiryAsync = createAsyncThunk(
  "admin/getAllEnquiryAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllEnquiry?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&search=${payload.search || ""}`,
      [],
      toolkit
    );
  }
);
