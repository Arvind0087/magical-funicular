import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "redux/AxiosClient";

// GET ALL
export const getAllSyllabusTopicAsync = createAsyncThunk(
  "admin/getAllSyllabusTopic",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllTopics?page=${payload.page || ""}&limit=${payload.limit || ""
      }&search=${payload.search || ""}&classes=${payload.classes || ""
      }&subject=${payload.subject || ""}&chapter=${payload.chapter || ""}&status=${payload.status || ""}`,
      [],
      toolkit
    );
  }
);
// ADD TOPIC
export const addSyllabusTopicAsync = createAsyncThunk(
  "admin/addSyllabusTopic",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addSyllabusTopic`, payload, toolkit);
  }
);
// GET TOPIC BY ID
export const getSyllausTopicByIdAsync = createAsyncThunk(
  "admin/getChapterByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getTopicById/${payload}`, [], toolkit);
  }
);
export const updateSyllausTopicByIdAsync = createAsyncThunk(
  "admin/updateSyllabusTopicById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PUT",
      `/updateSyllabusTopicById`,
      payload,
      toolkit
    );
  }
);

//Add Seq for Videos
export const updateContentSequenceAsync = createAsyncThunk(
  "admin/updateContentSequence",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/updateContentSequence`,
      payload,
      toolkit
    );
  }
);

// ADD CONTENT
export const addSyllabusContentAsync = createAsyncThunk(
  "admin/addNewContent",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addNewContent`, payload, toolkit);
  }
);
// UPDATE CONTENT
export const updateSyllabusContentAsync = createAsyncThunk(
  "admin/updateSyllabusContent",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PUT",
      `/updateSyllabusContentById`,
      payload,
      toolkit
    );
  }
);
// GET CONTENT BY ID
export const getSyllausContentByIdAsync = createAsyncThunk(
  "admin/getContecntById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getContecntById/${payload}`,
      [],
      toolkit
    );
  }
);
// GET ALL
export const getAllSyllabusContentAsync = createAsyncThunk(
  "admin/getAllContent",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllContent?page=${payload.page || 1}&limit=${payload.limit || 10
      }&search=${payload.search || ""}&classes=${payload.classes || ""
      }&subject=${payload.subject || ""}&chapter=${payload.chapter || ""}`,
      [],
      toolkit
    );
  }
);

//-----------------------------------------------------------Multiple Data Section
//Multiple Subject
export const getSubjectByMultipleClassBatchAsync = createAsyncThunk(
  "admin/getSubjectByMultipleClassBatch",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getSubjectByMultipleClassBatch`,
      payload,
      toolkit
    );
  }
);

// Multiple Chapter
export const getChapterByMultipleClassBatchSubjectAsync = createAsyncThunk(
  "admin/getChapterByMultipleSubject",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getChapterByMultipleSubject`,
      payload,
      toolkit
    );
  }
);

// Multiple Topic
export const getTopicByMultipleClassBatchSubjectChapterAsync = createAsyncThunk(
  "admin/getTopicByMultipleChapter",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getTopicByMultipleChapter`,
      payload,
      toolkit
    );
  }
);

// Topic Status
export const getsyllabusTopicStatusAsync = createAsyncThunk(
  "admin/updateTopicStatus",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateTopicStatus`, payload, toolkit);
  }
);

// Delete Video Manager
export const deleteSyllabusContentByIdAsync = createAsyncThunk(
  "admin/deleteSyllabusContentById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteSyllabusContent/${payload}`,
      [],
      toolkit
    );
  }
);