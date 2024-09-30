import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

export const getAllFeatureAsync = createAsyncThunk(
  "admin/getAllFeatureAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllMentorshipHelp?page=${payload.page}&limit=${payload.limit}&type=feature`,
      [],
      toolkit
    );
  }
);

export const createFeatureAsync = createAsyncThunk(
  "admin/createFeatureAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/createMentorshipFeature?type=${payload.type}`,
      payload,
      toolkit
    );
  }
);

//get feature by id
export const getFeatureByIdAsync = createAsyncThunk(
  "admin/getFeatureByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getMentorshipHelpById/${payload}`,
      [],
      toolkit
    );
  }
);

// update by id
export const updateFeatureByIdAsync = createAsyncThunk(
  "admin/updateFeatureByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PUT",
      `/updateMentorshipFeatureById`,
      payload,
      toolkit
    );
  }
);

//delete
export const deletefeaturesAsync = createAsyncThunk(
  "admin/deletefeaturesAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteMentorshipFeatureById/${payload}`,
      [],
      toolkit
    );
  }
);
