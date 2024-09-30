import { AxiosClient } from "redux/AxiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getFilterAsync = createAsyncThunk(
  "admin/getAllClasses",
  async (payload, { dispatch, rejectWithValue, fulfillWithValue }) => {
    return await AxiosClient(
      "GET",

      `/getAllClasses`,
      [],
      {
        dispatch,
        rejectWithValue,
        fulfillWithValue
      }
    );
  }
);

export const getClassWithBatchFilterAsync = createAsyncThunk(
  "admin/getClassWithBatchFilterAsync",
  async (payload, { dispatch, rejectWithValue, fulfillWithValue }) => {
    return await AxiosClient(
      "GET",

      `/getAllBatchTypes`,
      [],
      {
        dispatch,
        rejectWithValue,
        fulfillWithValue
      }
    );
  }
);


