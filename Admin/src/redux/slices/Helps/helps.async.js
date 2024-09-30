import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";
//get all why you need
export const getAllHelpsAsync = createAsyncThunk(
    "admin/getAllHelpsAsync",
    async (payload, toolkit) => {
      return await AxiosClient(
        "GET",
        `/getAllMentorshipHelp?page=${payload.page}&limit=${payload.limit}&type=help`,
        [],
        toolkit
      );
    }
  );

  // create why you need
  export const createHelpsAsync = createAsyncThunk( 
  "admin/createHelpsAsync",
  async (payload, toolkit) => {
    // return await AxiosClient("POST", `/createMentorshipHelp?type=${payload.type}`, payload, {
    return await AxiosClient("POST", `/createMentorshipHelp?type=${payload.type}`, payload, toolkit);
  }
);

//get why you need by id 
export const getHelpsByIdAsync = createAsyncThunk(
  "admin/getHelpsByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getMentorshipHelpById/${payload}`, [], toolkit);
  }
); 


// update by id
export const updateHelpsByIdAsync = createAsyncThunk(
  "admin/updateHelpsByIdAsync",
  async (payload, toolkit) => {
    // return await AxiosClient("PUT", `/updateMentorshipHelpById`, payload, {
    return await AxiosClient("PUT", `/updateMentorshipHelpById`, payload, toolkit);
  }
);

//delete

export const deleteHelpAsync = createAsyncThunk(
  "admin/deleteHelpAsync",
  async (payload, toolkit) => {
    return await AxiosClient("DELETE", `/deleteMentorshipHelpById/${payload}`, [], toolkit);
  }
);
