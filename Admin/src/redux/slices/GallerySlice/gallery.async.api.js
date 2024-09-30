import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

//get all
export const getAllGalleryAsync = createAsyncThunk(
  "admin/getAllGalleryAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllUrl?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&type=${payload.type || ""}&title=${payload.title || ""}`,
      [],
      toolkit
    );
  }
);

//get by id
export const getGalleryByIdAsync = createAsyncThunk(
  "admin/getOnlyForYouByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getUrlById/${payload}`, [], toolkit);
  }
);

//create
export const createGalleryAsync = createAsyncThunk(
  "admin/uploadUrl",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/uploadUrl`, payload, toolkit);
  }
);

//update
export const updateGalleryByIdAsync = createAsyncThunk(
  "admin/updateUrlById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateUrlById`, payload, toolkit);
  }
);

//delete
export const deleteGalleryByIdAsync = createAsyncThunk(
  "admin/deleteGalleryById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteUrlById/${payload}`,
      [],
      toolkit
    );
  }
);
