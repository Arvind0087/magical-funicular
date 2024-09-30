import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getclassAsync = createAsyncThunk(
  "admin/getclass",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllClasses?page=${payload.page || ""}&limit=${payload.limit || ""
      }&search=${payload.search || ""}&status=${payload.status || ""}`,
      [],
      toolkit
    );
  }
);
export const createClassAsync = createAsyncThunk(
  "admin/createClass",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createClass`, payload, toolkit);
  }
);
export const getClassByIdAsync = createAsyncThunk(
  "admin/getClassById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getClassById/${payload}`,
      payload,
      toolkit
    );
  }
);
export const updateClassByIdAsync = createAsyncThunk(
  "admin/updateClassById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateClassById`, payload, toolkit);
  }
);

export const getClassByBoardAndCourseIdAsync = createAsyncThunk(
  "admin/getClassByBoardAndCourseId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getClassByBoardId`, payload, toolkit);
  }
);

// Class Status
export const getClassStatusAsync = createAsyncThunk(
  "admin/updateClassStatus",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateClassStatus`, payload, toolkit);
  }
);