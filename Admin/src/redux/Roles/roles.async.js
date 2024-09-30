import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const getRolesAsync = createAsyncThunk(
  "admin/getRolesAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllPermissionRoles?page=${payload.page || ""}&limit=${payload.limit || ""
      }&search=${payload.search || ""}`,
      [],
      toolkit
    );
  }
);

export const getRolesWithoutSuperAdminAsync = createAsyncThunk(
  "admin/getRolesWithoutSuperAdminAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getPermissionRoles`,
      [],
      toolkit
    );
  }
);

export const createRolesAsync = createAsyncThunk(
  "admin/createRoles",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createRoles`, payload, toolkit);
  }
);

export const getRolesByIdAsync = createAsyncThunk(
  "admin/getRoleById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getRoleById/${payload}`,
      payload,
      toolkit
    );
  }
);

export const updatRolesByIdAsync = createAsyncThunk(
  "admin/updateRoleById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/updateRoleById/${payload.id}`,
      payload,
      toolkit
    );
  }
);

export const deleteRolesByIdAsync = createAsyncThunk(
  "admin/deleteRoleById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteRoleById/${payload}`,
      [],
      toolkit
    );
  }
);
