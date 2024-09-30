import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const getCityAsync = createAsyncThunk(
  "admin/getCity",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllCity?page=${payload.page || ''}&limit=${payload.limit || ''}&city=${payload.city || ''}&state=${payload.state || ''}`,
      [],
toolkit
    );
  }
);

export const createCityAsync = createAsyncThunk(
  "admin/createCity",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addCity`, payload, toolkit);
  }
);

export const getCityByIdAsync = createAsyncThunk(
  "admin/getCityById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getCityById/${payload}`, payload, toolkit);
  }
);

export const getAllCityByStateIdAsync = createAsyncThunk(
  "admin/getCityById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllCityByStateId/${payload.state}`,
      payload,
toolkit
    );
  }
);

export const updatCityByIdAsync = createAsyncThunk(
  "admin/updatCityById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateCityById`, payload, toolkit);
  }
);

export const deleteCityByIdAsync = createAsyncThunk(
  "admin/deleteCityById",
  async (payload, toolkit) => {
    return await AxiosClient("DELETE", `/deleteCityById/${payload}`, [], toolkit);
  }
);

export const getAllCityByMultipleStateId = createAsyncThunk(
  "admin/getAllCityByMultipleStateId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getCityByMultipleStateId`, payload, toolkit);
  }
);
// getCityByMultipleStateId
export const getCityByMultipleStateIdAsync = createAsyncThunk(
  "getCityByMultipleStateId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getCityByMultipleStateId`, payload, toolkit);
  }
);
