import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getAllPyqsAsync = createAsyncThunk(
  "admin/getAllPyqs",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllPyqs?page=${payload.page}&limit=${payload.limit}&year=${
        payload.year || ""
      }`,
      [],
      toolkit
    );
  }
);

export const addPyqsAsync = createAsyncThunk(
  "admin/addPyqs",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addPyqs`, payload, toolkit);
  }
);

export const getPyqsByIdAsync = createAsyncThunk(
  "admin/getPyqsById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getPyqsById/${payload}`, [], toolkit);
  }
);

export const updatePyqsByIdAsync = createAsyncThunk(
  "admin/updatePyqsById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updatePyqsById`, payload, toolkit);
  }
);

export const deletePyqsAsync = createAsyncThunk(
  "admin/deletePyqs",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deletePyqs/${payload?.id}`,
      [],
      toolkit
    );
  }
);

export const getAllModalPaperAsync = createAsyncThunk(
  "admin/getAllModalPaper",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllModalPaper?page=${payload.page}&limit=${payload.limit}`,
      [],
      toolkit
    );
  }
);

export const addModalPaperAsync = createAsyncThunk(
  "admin/addModalPaper",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addModalPaper`, payload, toolkit);
  }
);

export const getModalPaperByIdAsync = createAsyncThunk(
  "admin/getModalPaperById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getModalPaperById/${payload}`,
      [],
      toolkit
    );
  }
);

export const updateModalPaperByIdAsync = createAsyncThunk(
  "admin/updateModalPaperById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateModalPaperById`, payload, toolkit);
  }
);

export const deleteModalPaperAsync = createAsyncThunk(
  "admin/deleteModalPaper",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteModalPaper/${payload?.id}`,
      [],
      toolkit
    );
  }
);
