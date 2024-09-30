import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

// export const getDashboardAsync = createAsyncThunk(
//   "admin/getDashboard",
//   async (payload, toolkit) => {
//     return await AxiosClient("GET", `/dashboard`, [], toolkit);
//   }
// );

export const getDashboardAsync = createAsyncThunk(
  "admin/getDashboard",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/userDashboard`, [], toolkit);
  }
);

//User Sell Dashboard
export const salesDashboardAsync = createAsyncThunk(
  "admin/salesDashboard",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/salesDashboard?fromDate=${payload?.fromDate}&toDate=${payload?.toDate}`,
      [],
      toolkit
    );
  }
);

//User Package Dashboard
export const packageDashboardAsync = createAsyncThunk(
  "admin/packageDashboard",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/packageDashboard?fromDate=${payload?.fromDate}&toDate=${payload?.toDate}&type=${payload?.type}`,
      [],
      toolkit
    );
  }
);

//Registration Dashboard
export const registrationDashboardAsync = createAsyncThunk(
  "admin/registrationDashboard",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/registrationDashboard?fromDate=${payload?.fromDate}&toDate=${payload?.toDate}`,
      [],
      toolkit
    );
  }
);
