import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

//TestReport

export const getAllQuizAsync = createAsyncThunk(
  "admin/getAllQuizAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllTestReports?type=quiz&page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&studentId=${payload.studentId || ""}
   `,
      [],
      toolkit
    );
  }
);

export const getquizByIdAsync = createAsyncThunk(
  "admin/getStudentQuizReport",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getStudentQuizReport`, payload, toolkit);
  }
);
