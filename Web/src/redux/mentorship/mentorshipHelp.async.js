import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const getAllMentorshipfeatureAsync = createAsyncThunk(
    "user/getAllMentorshipFeature",
    async (payload, toolkit) => {
      return await AxiosClient("GET", `/getAllMentorshipHelp?type=${payload.type}`,payload,toolkit);
    }
  );

  export const getAllMentorshipHelpAsync = createAsyncThunk(
    "user/getAllMentorshipHelp",
    async (payload, toolkit) => {
      return await AxiosClient("GET", `/getAllMentorshipHelp?type=${payload.type}`,payload,toolkit);
    }
  );

  export const getAllMentorshipWhyMentorpAsync = createAsyncThunk(
    "user/getAllMentorshipMentor",
    async (payload, toolkit) => {
      return await AxiosClient("GET", `/getAllMentorshipHelp?type=${payload.type}`,payload,toolkit);
    }
  );

  export const getAllMentorAsync = createAsyncThunk(
    "user/getAllMentor",
    async (payload, toolkit) => {
      return await AxiosClient("GET", `/getAllMentor`,payload,toolkit);
    }
  );
  // for free subscribe
  export const mentorAllocationAsync = createAsyncThunk(
    "user/mentorAllocation",
    async (payload, { dispatch, rejectWithValue, fulfillWithValue, getState }) => {
      return await AxiosClient("POST", `/mentorAllocation`,payload,{
        dispatch,
        rejectWithValue,
        fulfillWithValue, getState,
      });
    }
  );

