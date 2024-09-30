import { AxiosClient } from "redux/AxiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addBatchLanguageAsync = createAsyncThunk(
  "admin/addBatchLanguage",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addBatchLanguage`, payload, toolkit);
  }
);

export const getAllBatchLanguageAsync = createAsyncThunk(
  "admin/getAllBatchLanguage",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBatchLanguage?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&search=${payload.search || ""}&classes=${
        payload.classes || ""
      }&status=${payload.status || ""}`,
      [],
      toolkit
    );
  }
);

export const getBatchLanguageByIdAsync = createAsyncThunk(
  "admin/getBatchLanguageById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getBatchLanguageById/${payload}`,
      [],
      toolkit
    );
  }
);

export const updateBatchLanguageByIdAsync = createAsyncThunk(
  "admin/updateBatchLanguageById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PUT",
      `/updateBatchLanguageById`,
      payload,
      toolkit
    );
  }
);

// Language Status
export const updateBatchLanguageStatusAsync = createAsyncThunk(
  "admin/updateBatchLanguageStatus",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PUT",
      `/updateBatchLanguageStatus`,
      payload,
      toolkit
    );
  }
);

export const getBatchLanguageByClassIdAsync = createAsyncThunk(
  "admin/getBatchLanguageByClassId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getBatchLanguageByClassId?classId=${payload}`,
      [],
      toolkit
    );
  }
);
