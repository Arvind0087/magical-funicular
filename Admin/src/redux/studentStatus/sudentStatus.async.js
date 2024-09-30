import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const studentActiveStatusAsync = createAsyncThunk(
  "admin/activateUser",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/activateUser/${payload.id}`,
      payload,
      toolkit
    );
  }
);

export const studentInactiveStatusAsync = createAsyncThunk(
  "admin/inactiveUser",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/inactiveUser/${payload.id}`,
      payload,
      toolkit
    );
  }
);