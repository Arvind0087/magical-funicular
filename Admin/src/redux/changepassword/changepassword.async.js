import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const changeAdminPasswordAsync = createAsyncThunk(
  "admin/changeAdminPasswordAsync",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateAdminPassword`, payload, toolkit);
  }
);
