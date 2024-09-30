import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

// ----------------------------------------------------------Add Scholorship Section Start

export const getAllScholorshipAddAsync = createAsyncThunk(
  "admin/getAllScholarship",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllScholarship?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&search=${payload.search || ""}`,
      [],
      toolkit
    );
  }
);

export const createScholarshipAddAsync = createAsyncThunk(
  "admin/createScholarship",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createScholarship`, payload, toolkit);
  }
);

export const getScholorshipAddByIdAsync = createAsyncThunk(
  "admin/getSingleScholarshipById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getSingleScholarshipById/${payload}`,
      [],
      toolkit
    );
  }
);

export const updateScholarshipAddAsync = createAsyncThunk(
  "admin/updateScholarshipById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateScholarshipById`, payload, toolkit);
  }
);

export const deleteScholarshipAddAsync = createAsyncThunk(
  "admin/deleteScholarshipById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteScholarshipById/${payload}`,
      [],
      toolkit
    );
  }
);

// ------------------------------------------------------------Add Scholorship Section End

// ----------------------------------------------------------Create Scholorship Section Start

export const getAllScholorshipByClassAsync = createAsyncThunk(
  "admin/getAllScholarshipClass",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllScholarshipClass?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&boards=${payload.boards || ""}&search=${payload.search || ""}&classes=${payload.classes || ""}`,
      [],
      toolkit
    );
  }
);

export const createScholorshipByClassesAsync = createAsyncThunk(
  "admin/createScholarshipWithClass",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/createScholarshipWithClass`,
      payload,
      toolkit
    );
  }
);

export const getScholorshipClassBasedByIdAsync = createAsyncThunk(
  "admin/getScholarshipClassOnlyById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getScholarshipClassOnlyById/${payload}`,
      [],
      toolkit
    );
  }
);

export const updateScholarshipClassBAsedAsync = createAsyncThunk(
  "admin/updateScholarshipClassById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PUT",
      `/updateScholarshipClassById`,
      payload,
      toolkit
    );
  }
);

export const deleteClassBasedScholarshipAsync = createAsyncThunk(
  "admin/deleteScholarshipClassById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteScholarshipClassById/${payload}`,
      [],
      toolkit
    );
  }
);
// ------------------------------------------------------------Create Scholorship Section End

// ---------------------------------------------Mulpipal Class Specific

export const getBatchByMultipleClassIddAsync = createAsyncThunk(
  "admin/getBatchTypeByMultiplesClassId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getBatchTypeByMultiplesClassId`,
      payload,
      toolkit
    );
  }
);

export const getSubjectByMultipleClassIdAsync = createAsyncThunk(
  "admin/getSubjectByMultipleClassId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getSubjectByMultipleClassId`,
      payload,
      toolkit
    );
  }
);


//  ScholarshipTest
export const getAllScholarshipTestAsync = createAsyncThunk(
  "admin/getAllAssignments",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllScholarshipTest?page=${payload.page}&limit=${payload.limit}`,[],
      toolkit
    );
  }
);
export const getScholarshipDetailsAsync = createAsyncThunk(
  "admin/getAllAssignments",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getScholarshipDetails`,[],
      toolkit
    );
  }
);

export const createScholarshipTestAsync = createAsyncThunk(
  "admin/createScholarshipTest",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/createScholarshipTest`,
      payload,
      toolkit
    );
  }
);
export const getScholarshipTestByIdAsync = createAsyncThunk(
  "admin/getScholarshipTestById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getScholarshipTestById/${payload}`,
      [],
      toolkit
    );
  }
);

