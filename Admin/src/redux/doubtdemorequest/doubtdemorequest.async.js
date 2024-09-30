import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const getAllDoubtDemoRequestAsync = createAsyncThunk(
  "admin/getDoubtDemoRequestAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllEventRequested?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&student=${payload?.student || ""}&status=${payload?.status || ""}`,
      [],
      toolkit
    );
  }
);

export const createEventNewAsync = createAsyncThunk(
  "admin/createEventNew",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createEventNew`, payload, toolkit);
  }
);


export const getTeacherScheduleDateAsync = createAsyncThunk(
  "admin/getTeacherScheduleDateAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getTeacherScheduleDate?teacherId=${payload.teacherId}`,
      [],
      toolkit
    );
  }
);

export const getScheduleByTeacherIdAsync = createAsyncThunk(
  "admin/getScheduleByTeacherIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getScheduleByTeacherId`,
      payload,
      toolkit
    );
  }
);



