import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getAllChaptersAsync = createAsyncThunk(
  "admin/getAllChapters",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllChapters?page=${payload.page}&limit=${payload.limit}&subject=${payload.subject || ""
      }&chapter=${payload.chapter || ""}&classes=${payload.classes || ''}&status=${payload.status || ""}`,
      [],
      toolkit
    );
  }
);
export const addChapterAsync = createAsyncThunk(
  "admin/addChapter",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addChapter`, payload, toolkit);
  }
);
export const getChapterByIdAsync = createAsyncThunk(
  "admin/getChapterByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getChapterById/${payload}`, [], toolkit);
  }
);
export const updateChapterAsync = createAsyncThunk(
  "admin/updateChapterAsync",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateChapterById`, payload, toolkit);
  }
);

export const getChapterBySubjectId = createAsyncThunk(
  "admin/getChapterBySubjectId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getChapterBySubjectId`, payload, toolkit);
  }
);
// Chapter Status
export const getChapterStatusAsync = createAsyncThunk(
  "admin/updateChapterStatus",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateChapterStatus`, payload, toolkit);
  }
);