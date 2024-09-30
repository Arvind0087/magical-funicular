import { AxiosClient } from "redux/AxiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllBatchTypes = createAsyncThunk(
  "admin/getbatch",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBatchTypes?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&search=${payload.search || ""}&classes=${
        payload.classes || ""
      }&status=${payload.status || ""}`,
      [],
      toolkit
    );
  }
);
export const createbatchTypesAsync = createAsyncThunk(
  "admin/createbatch",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addBatchType`, payload, toolkit);
  }
);
export const getBatchTypeByIdAsync = createAsyncThunk(
  "admin/getBatchTypeById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getBatchTypeById/${payload}`,
      [],
      toolkit
    );
  }
);
export const updatedBatchTypeByIdAsync = createAsyncThunk(
  "admin/updatedBatchTypeById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updatedBatchTypeById`, payload, toolkit);
  }
);
export const getBatchByCourseBoardClassAsync = createAsyncThunk(
  "admin/getBatchTypeByClassId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getBatchTypeByClassId`,
      payload,
      toolkit
    );
  }
);
export const getMultipleBatchByMultiClassAsync = createAsyncThunk(
  "admin/getMultipleBatch",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getMultipleBatch`, payload, toolkit);
  }
);
export const getbatchclassByboardIdAsync = createAsyncThunk(
  "admin/getbatchclassByboardIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getBatchTypeClassByBoardId`,
      payload,
      toolkit
    );
  }
);

// getBatchByBoardId
export const getBatchByBoardIdAsync = createAsyncThunk(
  "admin/getBatchByBoardId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getBatchByBoardId?boardId=${payload.boardId}`,
      [],
      toolkit
    );
  }
);

// Batch Type Status
export const getBatchStatusAsync = createAsyncThunk(
  "admin/updateBatchTypeStatus",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateBatchTypeStatus`, payload, toolkit);
  }
);
