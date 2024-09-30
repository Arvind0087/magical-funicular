import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";
//get all why you need
export const getAllWhyYouNeedAsync = createAsyncThunk(
  "admin/getAllWhyYouNeedAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllMentorshipHelp?page=${payload.page}&limit=${payload.limit}&type=mentor`,
      [],
      toolkit
    );
  }
);

// create why you need
export const createWhyYouNeedAsync = createAsyncThunk(
  "admin/createWhyYouNeedAsync",
  async (payload, toolkit) => {
    // return await AxiosClient("POST", `/createMentorshipHelp?type=${payload.type}`, payload, {
    return await AxiosClient(
      "POST",
      `/createMentorshipWhyNeed?type=${payload.type}`,
      payload,
      toolkit
    );
  }
);

//get why you need by id
export const getWhyYouNeedByIdAsync = createAsyncThunk(
  "admin/getWhyYouNeedByIdAsync",
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
export const updateWhyYouNeedByIdAsync = createAsyncThunk(
  "admin/updateWhyYouNeedByIdAsync",
  async (payload, toolkit) => {
    // return await AxiosClient("PUT", `/updateMentorshipHelpById`, payload, {
    return await AxiosClient(
      "PUT",
      `/updateMentorshipWhyYouNeedById`,
      payload,
      toolkit
    );
  }
);

//delete
export const deleteWhyYouNeedAsync = createAsyncThunk(
  "admin/deleteWhyYouNeedAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteMentorshipWhyYouNeedById/${payload}`,
      [],
      toolkit
    );
  }
);
