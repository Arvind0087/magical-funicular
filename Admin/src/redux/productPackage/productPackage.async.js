import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const createCoursePackageAsync = createAsyncThunk(
  "admin/createCoursePackage",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createCoursePackage`, payload, toolkit);
  }
);

export const updateCoursePackageByIdAsync = createAsyncThunk(
  "admin/updateCoursePackageById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PUT",
      `/updateCoursePackageById`,
      payload,
      toolkit
    );
  }
);

export const updateCoursePackageStatusAsync = createAsyncThunk(
  "admin/updateCoursePackageStatus",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PUT",
      `/updateCoursePackageStatus`,
      payload,
      toolkit
    );
  }
);

export const allCoursePackagesAsync = createAsyncThunk(
  "admin/allCoursePackages",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/allCoursePackages?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }`,
      [],
      toolkit
    );
  }
);

export const getCoursePackagesAsync = createAsyncThunk(
  "admin/getCoursePackages",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getCoursePackages?batchId=${payload.batchId || ""}`,
      [],
      toolkit
    );
  }
);

export const coursePackageByIdAsync = createAsyncThunk(
  "admin/coursePackageById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/coursePackageById/${payload.id}`,
      [],
      toolkit
    );
  }
);
