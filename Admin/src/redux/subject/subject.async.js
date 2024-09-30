import { AxiosClient } from "redux/AxiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllSubjectsAsync = createAsyncThunk(
  "admin/getAllSubjects",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllSubjects?page=${payload.page || ''}&limit=${payload.limit || ""}&search=${payload.search || ""}&classes=${payload.classes || ''}&status=${payload.status || ""}`,
      [],
      toolkit
    );
  }
);

export const addsubjectAsync = createAsyncThunk(
  "admin/addSubject",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addSubject`, payload, toolkit);
  }
);
export const getSubjectByIdAsync = createAsyncThunk(
  "admin/getSubjectById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getSubjectById/${payload}`, [], toolkit);
  }
);
export const updatedSubjectByIdAsync = createAsyncThunk(
  "admin/updatedSubjectById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updatedSubjectById`, payload, toolkit);
  }
);
export const getSubjectByBatchTypeIdAsync = createAsyncThunk(
  "admin/getSubjectByBatchTypeId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getSubjectByBatchTypeId`, payload, toolkit);
  }
);


// Subject Status
export const getSubjectStatusAsync = createAsyncThunk(
  "admin/updateSubjectStatus",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateSubjectStatus`, payload, toolkit);
  }
);