import { AxiosClient } from "redux/AxiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getFilterAsync = createAsyncThunk(
  "admin/getFilterAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllSubjects
      `,
      [],
toolkit
    );
  }
);
export const getChapterByMultipleSubjectIdAsync = createAsyncThunk(
  "admin/getChapterByMultipleSubjectId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getChapterByMultipleSubjectId`, payload, toolkit);
  }
);
