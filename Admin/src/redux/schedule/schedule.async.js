import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

export const createScheduleAsync = createAsyncThunk(
  "admin/createSchedule",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/CreateTeacherSchedule`,
      payload,
      toolkit
    );
  }
);
export const getScheduleByTeacherIdAsync = createAsyncThunk(
  "admin/getScheduleByTeacherId",
  async (payload, toolkit) => {
    const url =
      payload.teacherId !== null && payload.teacherId !== undefined
        ? `/getAllScheduleByTeacherId?page=${payload.page}&limit=${payload.limit}&teacherId=${payload.teacherId}`
        : `/getAllScheduleByTeacherId?page=${payload.page}&limit=${payload.limit}`;

    return await AxiosClient("GET", url, [], toolkit);
  }
);

export const getScheduleByTeacherIdCalenderAsync = createAsyncThunk(
  "admin/getAllEventByTeacherId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllEventByTeacherId?teacherId=${payload.teacherId}&date=${payload.date}`,
      [],
      toolkit
    );
  }
);
