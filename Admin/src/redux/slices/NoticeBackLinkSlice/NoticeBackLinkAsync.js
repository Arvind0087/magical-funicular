import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

//get all
export const getAllBackLinkAsync = createAsyncThunk(
    "admin/getAllBackLinkAsync",
    async (payload, toolkit) => {
      return await AxiosClient(
        "GET",
        `/getAllPageBackLink?page=${payload.page}&limit=${payload.limit}`,
        [],
        toolkit
      );
    }
  );