import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const filterAllQuestionBankAsync = createAsyncThunk(
  "admin/filterAllQuestionBankAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllQuestion`, [], toolkit);
  }
);
