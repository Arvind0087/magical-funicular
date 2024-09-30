import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const createcourseAsync = createAsyncThunk(
  "admin/createcourse",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createCourse`, payload, toolkit);
  }
);
export const getcoursebyidAsync = createAsyncThunk(
  "admin/getcoursebyid",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getCourseById/${payload}`, [], toolkit);
  }
);
export const updatecoursebyidAsync = createAsyncThunk(
  "admin/updatecoursebyid",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updatedCourseById`, payload, toolkit);
  }
);
export const getcourseAsync = createAsyncThunk(
  "admin/getcourse",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllCourses?page=${payload.page || ""}&limit=${payload.limit || ""
      }&search=${payload.search || ""}&status=${payload.status || ""}`,
      [],
      toolkit
    );
  }
);

// Course Status
export const getCourseStatusAsync = createAsyncThunk(
  "admin/updateCourseStatus",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateCourseStatus`, payload, toolkit);
  }
);
