import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const getAllLiveEventAsync = createAsyncThunk(
  "admin/getAllLiveEventAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllLiveEvent?page=${payload.page}&limit=${payload.limit}&teacherId=${
        payload.teacherId || ""
      }&package=${payload.package || ""}&type=${payload.type || ""}&fromDate=${
        payload.fromDate || ""
      }&toDate=${payload.toDate || ""}`,
      [],
      toolkit
    );
  }
);

export const getSubjectByOnlyBatchTypeIdAsync = createAsyncThunk(
  "admin/getSubjectByOnlyBatchTypeId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getSubjectByOnlyBatchTypeId?batchTypeId=${payload.batchTypeId}`,
      payload,
      toolkit
    );
  }
);
export const getChapterByOnlySubjectIdAsync = createAsyncThunk(
  "admin/getChapterByOnlySubjectId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getChapterByOnlySubjectId?subjectId=${payload.subjectId}`,
      payload,
      toolkit
    );
  }
);

export const createLiveEventAsync = createAsyncThunk(
  "admin/createLiveEvent",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createLiveEvent`, payload, toolkit);
  }
);

export const updateLiveEventByIdAsync = createAsyncThunk(
  "admin/updateLiveEventById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateLiveEventById`, payload, toolkit);
  }
);

export const getLiveEventByIdAsync = createAsyncThunk(
  "admin/getLiveEventById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getLiveEventById/${payload}`,
      [],
      toolkit
    );
  }
);

// export const deleteLiveEventAsync = createAsyncThunk(
//   "admin/deleteLiveEvent",
//   async (payload, toolkit) => {
//     return await AxiosClient(
//       "DELETE",
//       `/deleteLiveEvent/${payload}`,
//       [],
//       toolkit
//     );
//   }
// );

export const deleteLiveEventAsync = createAsyncThunk(
  "admin/deleteLiveEvent",
  async (payload, toolkit) => {
    return await AxiosClient("DELETE", `/deleteLiveEvent`, payload, toolkit);
  }
);

export const getAllMentorTeacherAsync = createAsyncThunk(
  "admin/getAllMentorTeacher",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllStaffOnly?type=${payload.type || ""}`,
      [],
      toolkit
    );
  }
);
