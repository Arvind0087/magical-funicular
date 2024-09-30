import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const getStateAsync = createAsyncThunk(
  "admin/getState",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllState?page=${payload.page || ""}&limit=${payload.limit || ""}&search=${
        payload.search || ""
      }`,
      [],
      toolkit
    );
  }
);

export const createStateAsync = createAsyncThunk(
  "admin/createState",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addState`, payload, toolkit);
  }
);

export const getStateByIdAsync = createAsyncThunk(
  "admin/getStateById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getStateById/${payload}`,
      payload,
      toolkit
    );
  }
);

// export const updatStateByIdAsync = createAsyncThunk(
//   "admin/updatStateById",
//   async (payload, toolkit) => {
//     return await AxiosClient("PUT", `/updateStateById/${payload.id}`, payload, toolkit);
//   }
// );

export const updatStateByIdAsync = createAsyncThunk(
  "admin/updatStateById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateStateById`, payload, toolkit);
  }
);

export const deleteStateByIdAsync = createAsyncThunk(
  "admin/deleteStateById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteStateById/${payload}`,
      [],
      toolkit
    );
  }
);
