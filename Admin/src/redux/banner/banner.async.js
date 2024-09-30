import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getAllBannerAsync = createAsyncThunk(
  "admin/getAllBanner",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBanner?page=${payload.page}&limit=${payload.limit}&type=${
        payload.search || ""
      }&classes=${payload.classes || ""}`,
      [],
      toolkit
    );
  }
);
export const getBannerByIdAsync = createAsyncThunk(
  "admin/getBannerById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getBannerById/${payload}`, [], toolkit);
  }
);
export const createBannerAsync = createAsyncThunk(
  "admin/createBanner",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createBanner`, payload, toolkit);
  }
);
export const updateBannerAsync = createAsyncThunk(
  "admin/updateBanner",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateBannerById`, payload, toolkit);
  }
);
export const deleteBannerByIdAsync = createAsyncThunk(
  "admin/deleteBannerById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteBannerById/${payload}`,
      [],
      toolkit
    );
  }
);


