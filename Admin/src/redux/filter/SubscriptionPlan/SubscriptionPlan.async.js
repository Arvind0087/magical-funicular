import { AxiosClient } from "redux/AxiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const getSubscriptionPlanFilterAsync = createAsyncThunk(
  "admin/getSubscriptionPlanFilterAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllPackagesForBoard`, [], toolkit);
  }
);
