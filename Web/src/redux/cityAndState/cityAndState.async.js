import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const getAllStateAsync = createAsyncThunk(
  "user/getAllState",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllState`, payload, toolkit);
  }
);

export const getAllCityByStateIdAsync = createAsyncThunk(
  "user/getAllCityByStateId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllCityByStateId/${payload.id}`,
      payload,
      toolkit
    );
  }
);

export const getCityByIdAsync = createAsyncThunk(
  "user/getCityById",
  async (payload, toolkit) => {
    console.log("getCityById", payload);
    return await AxiosClient(
      "GET",
      `/getCityById/${payload.id}`,
      payload,
      toolkit
    );
  }
);

export const getStateByIdAsync = createAsyncThunk(
  "user/getStateById",
  async (payload, toolkit) => {
    console.log("getStateById", payload);
    return await AxiosClient(
      "GET",
      `/getStateById/${payload.id}`,
      payload,
      toolkit
    );
  }
);
