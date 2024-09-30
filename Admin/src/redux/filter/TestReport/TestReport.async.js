import { AxiosClient } from "redux/AxiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTestReportFilterAsync = createAsyncThunk(
  "admin/getTestReportFilterAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getallTestReports
      `,
      [],
      toolkit
    );
  }
);
