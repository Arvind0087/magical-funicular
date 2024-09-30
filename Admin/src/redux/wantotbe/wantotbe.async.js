import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getAllWantToBeAsync = createAsyncThunk(
  "admin/getAllWantToBe",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllWantToBe?page=${payload.page}&limit=${payload.limit}&search=${
        payload.search || ""
      }`,
      [],
toolkit
    );
  }
);

export const getWantToBeByIdAsync = createAsyncThunk(
  "admin/getWantToBeById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getWantToBeById/${payload}`, [], toolkit);
  }
);

export const createWantToBeAsync = createAsyncThunk(
  "admin/createWantToBe",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createWantToBe`, payload, toolkit);
  }
);

export const updateWantToBeByIdAsync = createAsyncThunk(
  "admin/updateWantToBeById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateWantToBeById`, payload, toolkit);
  }
);

export const deleteWantToBeByIdAsync = createAsyncThunk(
  "admin/deleteWantToBeById",
  async (payload, toolkit) => {
    return await AxiosClient("DELETE", `/deleteWantToBeById/${payload}`, [], toolkit);
  }
);
