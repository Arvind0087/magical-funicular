import { AxiosClient } from "redux/AxiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const getPackageFilterAsync = createAsyncThunk(
  "admin/getAllpackageMaster",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllPackages`, [], toolkit);
  }
);
