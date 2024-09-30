import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

export const getAllTestAsync = createAsyncThunk(
  "admin/getAllTest",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllTest?page=${payload.page}&limit=${payload.limit}&category=${payload.category || ""
      }&classes=${payload.classes || ""}&title=${payload.title || ""}`,
      [],
      toolkit
    );
  }
);

export const createTestAsync = createAsyncThunk(
  "admin/createTest",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createTest`, payload, toolkit);
  }
);

export const deleteTestByIdAsync = createAsyncThunk(
  "admin/deleteTestById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteTestById/${payload}`,
      [],
      toolkit
    );
  }
);

//TestReport

export const getallTestReportsAsync = createAsyncThunk(
  "admin/getAllTestReports",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllTestReports?page=${payload.page}&limit=${payload.limit
      }&studentId=${payload.studentId || ""}`,

      [],
      toolkit
    );
  }
);

export const getTestAttemptedCountAsync = createAsyncThunk(
  "admin/getAttemptCount",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAttemptCount?testId=${payload.testId}&userId=${payload.userId}`,
      [],
      toolkit
    );
  }
);

export const getTestReportByCountAsync = createAsyncThunk(
  "admin/getOwnTestReportById",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getOwnTestReportById`, payload, toolkit);
  }
);


export const getTestReportByIdAsync = createAsyncThunk(
  "admin/getTestReportById",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getTestReportById`, payload, toolkit);
  }
);

export const getTestByIdAsync = createAsyncThunk(
  "admin/getTestById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getTestById/${payload}`, [], toolkit);
  }
);


// Test Report By Graph

export const getStudentTestReportGraphAsync = createAsyncThunk(
  "admin/getTestById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getStudentTestReport/${payload}`, [], toolkit);
  }
);
