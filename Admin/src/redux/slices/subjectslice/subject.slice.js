import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

export const getAllSubjectSelectAsync = createAsyncThunk(
  "admin/getAllSubjectSelect",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllSubjectSelect`, [], toolkit);
  }
);


