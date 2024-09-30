import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

//get all
export const getAllScholarshipAppAsync = createAsyncThunk(
  "admin/getAllScholarshipAppAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllScholarshipApply?page=${payload.page || ""}&limit=${payload.limit || ""
      }&search=${payload.search || ""}&classes=${payload.classes || ''}`,
      [],
      toolkit
    );
  }
);
