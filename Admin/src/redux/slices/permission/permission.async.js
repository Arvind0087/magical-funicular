import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

export const getpermissionAsync = createAsyncThunk(
  "admin/getpermission",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getPermissionByStaffId/${payload}`,
      [],
      toolkit
    );
  }
);

export const addPermissionByIdAsync = createAsyncThunk(
  "admin/addPermissionById",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/permission`, payload, toolkit);
  }
);

export const getMenuAsync = createAsyncThunk(
  "admin/getMenuAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getPermissionByStaffId/${payload}`,
      [],
      toolkit
    );
  }
);

export const getPermissionByRoleIdAsync = createAsyncThunk(
  "admin/getPermissionByRoleIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getPermissionByRoleId/${payload}`,
      [],
      toolkit
    );
  }
);
