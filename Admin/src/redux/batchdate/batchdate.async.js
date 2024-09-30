import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getAllBatchDatesAsync = createAsyncThunk(
  "admin/getAllBatchDates",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBatchDates?page=${payload.page}&limit=${payload.limit}&classes=${
        payload.classes || ""
      }&status=${payload.status || ""}`,
      [],
      toolkit
    );
  }
);
export const addBatchDateAsync = createAsyncThunk(
  "admin/addBatchDate",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addBatchDate`, payload, toolkit);
  }
);
export const getBatchDateByIdAsync = createAsyncThunk(
  "admin/getBatchDateById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getBatchDateById/${payload}`,
      [],
      toolkit
    );
  }
);
export const updatedBatchDateByIdAsync = createAsyncThunk(
  "admin/updatedBatchDateById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updatedBatchDateById`, payload, toolkit);
  }
);
export const getBatchDateByBatchTypeIdAsync = createAsyncThunk(
  "admin/getBatchDateByBatchTypeIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getBatchDateByBatchTypeId`,
      payload,
      toolkit
    );
  }
);

// getMultipleBatchDate

export const getMultipleBatchDateAsync = createAsyncThunk(
  "admin/getMultipleBatchDateAsync",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getMultipleBatchDate`, payload, toolkit);
  }
);
// Batch Date Status
export const getBatchDateStatusAsync = createAsyncThunk(
  "admin/updateBatchDateStatus",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateBatchDateStatus`, payload, toolkit);
  }
);

// getMultiple batch
export const getMultipleBatchAsync = createAsyncThunk(
  "admin/getMultipleBatch",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getMultipleBatch?classIds=${payload || ""}`,
      [],
      toolkit
    );
  }
);
