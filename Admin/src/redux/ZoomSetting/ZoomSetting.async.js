import { AxiosClient } from "redux/AxiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllCredentialAsync = createAsyncThunk(
  "admin/getAllCredential",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllCredential?page=${payload.page}&limit=${payload.limit}`,
      // `/getAllCredential?page=${payload.page || ''}&limit=${payload.limit || ""}&search=${payload.search || ""}&classes=${payload.classes || ''}`,
      [],
      toolkit
    );
  }
);

export const createZoomCredentialAsync = createAsyncThunk(
  "admin/addZoomCredential",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addZoomCredential`, payload, toolkit);
  }
);

export const getZoomCredentialByTeacherIdAsync = createAsyncThunk(
  "admin/getZoomCredentialByTeacherId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getZoomCredentialByTeacherId?teacherId=${payload}`,
      [],
      toolkit
    );
  }
);

export const deleteCredentialByTeacherIdAsync = createAsyncThunk(
  "admin/deleteCredentialByTeacherId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteCredentialByTeacherId/${payload}`,
      [],
      toolkit
    );
  }
);

export const updateCredentialByIdAsync = createAsyncThunk(
  "admin/updateCredentialById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateCredentialById`, payload, toolkit);
  }
);
