import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";
//get all why you need
export const getAllHighlightAsync = createAsyncThunk(
    "admin/getAllHighlightAsync",
    async (payload, toolkit) => {
      return await AxiosClient(
        "GET",
        `/getAllHighlight?page=${payload.page}&limit=${payload.limit}`,
        [],
        toolkit
      );
    }
  );

 
  export const createHighlightAsync = createAsyncThunk( 
  "admin/createMentorshipHelp",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createHighlight`, payload, toolkit);
  }
);


export const getHighlightByIdAsync = createAsyncThunk(
  "admin/getHighlightById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getHighlightById/${payload}`, [], toolkit);
  }
); 


// update by id
export const updateHighlightByIdAsync = createAsyncThunk(
  "admin/updateMentorshipHelpById",
  async (payload, toolkit) => {
    // return await AxiosClient("PUT", `/updateMentorshipHelpById`, payload, {
    return await AxiosClient("PUT", `/updateHighlightById`, payload, toolkit);
  }
);

//delete
export const deleteHighlightAsync = createAsyncThunk(
  "admin/deleteHighlight",
  async (payload, toolkit) => {
    return await AxiosClient("DELETE", `/deleteHighlight/${payload}`, [], toolkit);
  }
);


// getAllHighlightAsync,
// getHighlightByIdAsync,
// updateHighlightByIdAsync,
// createHighlightAsync,
// deleteHighlightAsync,