import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getAllStaffsAsync = createAsyncThunk(
  "admin/getAllStaff",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllStaff?page=${payload.page || ""}&limit=${payload.limit || ""
      }&search=${payload.search || ""}&department=${payload.department || ""
      }&classes=${payload.classes || ""}`,
      [],
      toolkit
    );
  }
);

export const getAllStaffOnlyAsync = createAsyncThunk(
  "admin/getAllStaffOnly",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllStaffOnly`,
      [],
      toolkit
    );
  }
);

export const updateStaffByIdAsync = createAsyncThunk(
  "admin/updateStaffById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/updateStaffById/${payload.id}`,
      payload,
      toolkit
    );
  }
);
export const getStaffByIdAsync = createAsyncThunk(
  "admin/getStaffById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getStaffById/${payload}`, [], toolkit);
  }
);

export const getSubjectByMultipleClassIdAsync = createAsyncThunk(
  "admin/getSubjectByMultipleClassIds",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getSubjectByMultipleClassIds`,
      payload,
      toolkit
    );
  }
);


export const updateStaffBatchDetailsAsync = createAsyncThunk(
  "admin/updateStaffBatchDetails",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/updateStaffBatchDetails/${payload.id}`,
      payload,
      toolkit
    );
  }
);


export const markStaffAttendanceAsync = createAsyncThunk(
  "admin/staffMarkAttandence",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/staffMarkAttandence`, payload, toolkit);
  }
);
