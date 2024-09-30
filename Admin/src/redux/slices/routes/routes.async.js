import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

export const getAllRoutesAsync = createAsyncThunk(
  "admin/allroutes",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getallroute`, [], toolkit);
  }
);
