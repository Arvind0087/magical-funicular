import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

export const getAllAttendanceAsync = createAsyncThunk(
  "admin/usersAttend",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/usersAttend?page=${payload.page || ''}&limit=${payload.limit || ""}&id=${payload.id || ""}&month=${payload.month || ""}&year=${payload.year || ""}`,
      [],
      toolkit
    );
  }
);
