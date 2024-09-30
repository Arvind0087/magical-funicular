import { AxiosClient } from "redux/AxiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Course Filter
export const coursefilterAsync = createAsyncThunk(
  "admin/getAllCourses",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllCourses
      `,
      [],
      toolkit
    );
  }
);
// Board Filter
export const boardfilterAsync = createAsyncThunk(
  "admin/boardfilter",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBoards
      `,
      [],
      toolkit
    );
  }
);

// Batch With Class
export const getClassWithBatchFilterAsync = createAsyncThunk(
  "admin/getAllBatchTypes",
  async (payload, { dispatch, rejectWithValue, fulfillWithValue }) => {
    return await AxiosClient("GET", `/getAllBatchTypes`, [], {
      dispatch,
      rejectWithValue,
      fulfillWithValue,
    });
  }
);
// Class With Board
export const getClassWithBoardFilterAsync = createAsyncThunk(
  "admin/getAllClasses",
  async (payload, { dispatch, rejectWithValue, fulfillWithValue }) => {
    return await AxiosClient("GET", `/getAllClasses`, [], {
      dispatch,
      rejectWithValue,
      fulfillWithValue,
    });
  }
);

//Roles
export const getRolesFilterAsync = createAsyncThunk(
  "admin/getRolesFilterAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllPermissionRoles`, [], toolkit);
  }
);

// Subject
export const getSubjectFilterAsync = createAsyncThunk(
  "admin/getSubjectFilterAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllSubjects`, [], toolkit);
  }
);
// Subject By Class ID
export const getSubjectByClassIdFilterAsync = createAsyncThunk(
  "admin/getSubjectByMultipleClassIds",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getSubjectByMultipleClassIds`,
      payload,
      toolkit
    );
  }
);

// Chapter
export const getChapterFilterAsync = createAsyncThunk(
  "admin/getChapterFilterAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllChapters?`, [], toolkit);
  }
);

// Get Chapter By Subject Id
export const getChapterBySubjectIdFilterAsync = createAsyncThunk(
  "admin/getChapterByOnlySubjectId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getChapterByOnlySubjectId?subjectId=${payload.subjectId}`,
      [],
      toolkit
    );
  }
);

// State
export const getStateFilterAsync = createAsyncThunk(
  "admin/getStateFilterAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllState`, [], toolkit);
  }
);

// Student
export const getStudentFilterAsync = createAsyncThunk(
  "admin/getStateFilterAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllstudents`, [], toolkit);
  }
);

// Students For Free & Premium
export const getCheckedStudentAsync = createAsyncThunk(
  "admin/getAllstudents",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllstudents?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&classes=${payload.classes || ""}&search=${payload.search || ""}&type=${
        payload.type || ""
      }`,
      [],
      toolkit
    );
  }
);

// All Staff
export const getAllStaffFilterAsync = createAsyncThunk(
  "admin/getAllStaffOnly",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllStaffOnly`, [], toolkit);
  }
);

// All Category
export const getGrievanceCategoryFilterAsync = createAsyncThunk(
  "admin/getAllGrievanceCategory",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllGrievanceCategory`, [], toolkit);
  }
);
