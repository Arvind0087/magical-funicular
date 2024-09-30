import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const addRevisionBookmarkAsync = createAsyncThunk(
  "web/addBookmark",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addBookmark`, payload, toolkit);
  }
);

export const getAllRevisionBookmarkAsync = createAsyncThunk(
  "web/getAllRevisionBookmark",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getAllRevisionBookmark?userId=${payload.userId}&category=${payload.category}&subjectId=${payload.subjectId}&topic=${payload.topic}`,
      payload,
      toolkit
    );
  }
);
