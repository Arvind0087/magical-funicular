import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const createBoardAsync = createAsyncThunk(
  "admin/createBoard",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createBoard`, payload, toolkit);
  }
);
export const getBoardByIdAsync = createAsyncThunk(
  "admin/getBoardById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getBoardById/${payload}`,
      payload,
      toolkit
    );
  }
);
export const updatBoardByIdAsync = createAsyncThunk(
  "admin/updatBoardById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PUT",
      `/updateBoardById/${payload.id}`,
      payload,
      toolkit
    );
  }
);
export const getBoardsByCourseIdAsync = createAsyncThunk(
  "admin/getBoardsByCourseId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getBoardsByCourseId`, payload, toolkit);
  }
);
export const getboardAsync = createAsyncThunk(
  "admin/getboard",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBoards?page=${payload.page || ""}&limit=${payload.limit || ""}&search=${payload.search || ''}&status=${payload.status || ""}`,
      [],
      toolkit
    );
  }
);

// getBatchByBoardId
export const getClassBatchSubjectByBoardIdAsync = createAsyncThunk(
  "admin/getClassBatchSubjectByBoardId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getSubjectByBoardId?boardId=${payload.boardId}`,
      [],
      toolkit
    );
  }
);


// Board Status
export const getBoardStatus = createAsyncThunk(
  "admin/updateBoardStatus",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateBoardStatus`, payload, toolkit);
  }
);

