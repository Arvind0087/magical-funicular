import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getAllAssignmentAsync = createAsyncThunk(
  "admin/getAllAssignments",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllAssignments?page=${payload.page}&limit=${payload.limit}`,
      [],
toolkit
    );
  }
);

export const createAssignmentAsync = createAsyncThunk(
  "admin/createAssignments",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createAssignments`, payload, toolkit);
  }
);

export const getChapterByMultipleSubjectIdAsync = createAsyncThunk(
  "admin/getChapterByMultipleSubjectId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getChapterByMultipleSubjectId`,
      payload,
toolkit
    );
  }
);

export const getStydentsByCBCBAsync = createAsyncThunk(
  "admin/getStudentByBatchTypeId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getStudentByBatchTypeId`,
      payload,
      toolkit
    );
  }
);
export const getAssignmentByIdAsync = createAsyncThunk(
  "admin/getAssignmentById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAssignmentById/${payload}`,
      [],
      toolkit
    );
  }
);

export const deleteAssignmentAsync = createAsyncThunk(
  "admin/deleteBatchDateById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteBatchDateById/${payload}`,
      [],
      toolkit
    );
  }
);

export const updateAssignmentAsync = createAsyncThunk(
  "admin/updateAssignmentById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/updateAssignmentById`,
      payload,
      toolkit
    );
  }
);



