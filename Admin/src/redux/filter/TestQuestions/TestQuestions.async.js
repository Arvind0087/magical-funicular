import { AxiosClient } from "redux/AxiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTestQuestionsFilterAsync = createAsyncThunk(
  "admin/getTestQuestionsFilterAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllTest
      `,
      [],
toolkit
    );
  }
);
