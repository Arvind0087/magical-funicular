import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

export const getStaffAttendanceAsync = createAsyncThunk(
  "admin/staffAttend",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/staffAttend?page=${payload.page || ''}&limit=${payload.limit || ''}&id=${payload.id || ''}&month=${payload.month || ''}&year=${payload.year || ''}`,
      [],
      toolkit
    );
  }
);
