import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";


export const getAllAssignmentAsync = createAsyncThunk(
    "admin/getAllAssignments",
    async (payload, toolkit) => {
      return await AxiosClient(
        "GET",
        `/getAllAssignments?page=${payload.page}&limit=${payload.limit}&classes=${payload.classes || ''}`,[],
        toolkit
      );
    }
  );

    export const createAssignmentAsync = createAsyncThunk(
    "admin/createAssignments",
    async (payload, toolkit) => {
      return await AxiosClient("POST", `/createAssignments`, payload, toolkit);
    }
  );

  //-----------------------------------------------Multiple Chapter
  export const getChapterByMultipleSubjectIdAsync = createAsyncThunk(
    "admin/getChapterByMultipleSubjectId",
    async (payload, toolkit) => {
      return await AxiosClient("POST", `/getChapterByMultipleSubjectId`, payload, toolkit);
    }
  );

   //-----------------------------------------------Multiple Students
   export const getStydentsByCBCBAsync = createAsyncThunk(
    "admin/getStudentByBatchTypeId",
    async (payload, toolkit) => {
      return await AxiosClient("POST", `/getStudentByBatchTypeId`, payload, toolkit);
    }
  );
    export const getAssignmentByIdAsync = createAsyncThunk(
    "admin/getAssignmentById",
    async (payload, toolkit) => {
      return await AxiosClient("GET", `/getAssignmentById/${payload}`, [], toolkit);
    }
  );

    export const deleteAssignmentAsync = createAsyncThunk(
    "admin/deleteBatchDateById",
    async (payload, toolkit) => {
      return await AxiosClient("DELETE", `/deleteBatchDateById/${payload}`, [], toolkit);
    }
  );

    export const updateAssignmentAsync = createAsyncThunk(
    "admin/updateAssignmentById",
    async (payload, toolkit) => {
      return await AxiosClient(
        "PATCH",
        `/updateAssignmentById/${payload.id}`, payload,
        toolkit
      );
    }
  );

  export const getAllAssignmentResultAsync = createAsyncThunk(
    "admin/getAllAssignmentResultAsync",
    async (payload, toolkit) => {
      return await AxiosClient(
        "GET",
        `/getAllAssignmentReports?page=${payload.page}&limit=${payload.limit}`,
        [],
  toolkit
      );
    }
  );
  
  export const getAssignmentReportByIdAsync = createAsyncThunk(
    "admin/getAssignmentReportById",
    async (payload, toolkit) => {
      return await AxiosClient(
        "GET",
        `/getAssignmentReportById?assignmentId=${payload.assignmentId}&studentId=${payload.studentId}&studentStartId=${payload.studentStartId}`,
        [],
  toolkit
      );
    }
  );
  



  
//   export const getRevisionTopicAsync = createAsyncThunk(
//     "admin/getTopicByChapterId",
//     async (payload, toolkit) => {
//       return await AxiosClient("POST", `/getTopicByChapterId`, payload, toolkit);
//     }
//   );
  

  

  

  
//   export const updateRevisionAsync = createAsyncThunk(
//     "admin/updateRevisionById",
//     async (payload, toolkit) => {
//       return await AxiosClient(
//         "PATCH",
//         `/updateRevisionById/${payload.id}`,
//         payload,
// toolkit
//       );
//     }
//   );