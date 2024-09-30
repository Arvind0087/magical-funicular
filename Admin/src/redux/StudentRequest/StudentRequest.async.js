import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getAllStudentRequestAsync = createAsyncThunk(
  "admin/getAllStudentRequestAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllRequestCall?page=${payload.page || ''}&limit=${payload.limit || ''}&search=${payload.search || ''}`,
      [],
toolkit
    );
  }
);
