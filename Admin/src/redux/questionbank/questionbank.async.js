import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosClient } from "redux/AxiosClient";

export const UploadBulkQuestionsAsync = createAsyncThunk(
  "admin/createBulkQuestionAsync",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/uploadBulkQuestions`, payload, toolkit);
  }
);

export const bulkquestionOutAsync = createAsyncThunk(
  "admin/bulkquestionOutAsync",
  async (payload, toolkit) => {
    return await axios
      .post(`${process.env.REACT_APP_QB_UPLOAD}/convert`, payload)
      .then((response) => {
        return toolkit.fulfillWithValue(response.data);
      })
      .catch((error) => {
        // toolkit.dispatch(errorMessage(error.response.data.message));
        return toolkit.rejectWithValue(error.response.data.message);
      });
  }
);
export const bulkquestionInAsync = createAsyncThunk(
  "admin/bulkquestionInAsync",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/uploadBulkQuestions`, payload, toolkit);
  }
);
export const bulkuploadquestionAsync = createAsyncThunk(
  "admin/uploadBulkQuestion",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/uploadBulkQuestion`,
      payload,
      toolkit,
      "multipart/form-data"
    );
  }
);
export const getAllQuestionAsync = createAsyncThunk(
  "admin/getAllQuestion",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getQuestionBatchSubject`,
      payload,
      toolkit
    );
  }
);

export const getAllQuestionBankAsync = createAsyncThunk(
  "admin/getAllQuestionBankAsync",
  async (payload, toolkit) => {
    const subject = payload.subject ? JSON.stringify([payload.subject]) : null;
    const chapter = payload.chapter ? JSON.stringify([payload.chapter]) : null;
    return await AxiosClient(
      "GET",
      `/getAllQuestion?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&subject=${subject}&chapter=${chapter}&classes=${
        payload.classes || ""
      }&difficultyLevel=${payload.difficultyLevel || ""}`,
      [],
      toolkit
    );
  }
);

// export const getAllQuestionBankAsync = createAsyncThunk(
//   "admin/getAllQuestionBankAsync",
//   async (payload, toolkit) => {
//     return await AxiosClient(
//       "GET",
//       `/getAllQuestion?page=${payload.page || ""}&limit=${
//         payload.limit || ""
//       }&subject=${payload.subject || ""}&chapter=${
//         payload.chapter || ""
//       }&classes=${payload.classes || ""}&difficultyLevel=${
//         payload.difficultyLevel || ""
//       }`,
//       [],
//       toolkit
//     );
//   }
// );

export const updateQuestionsStatusAsync = createAsyncThunk(
  "admin/createQuestionBank",
  async (payload, toolkit) => {
    return await AxiosClient("PATCH", `/updateQuestionsStatus`, payload, toolkit);
  }
);

export const createQuestionBankAsync = createAsyncThunk(
  "admin/createQuestionBank",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createQuestionBank`, payload, toolkit);
  }
);
export const getQuestionByIdAsync = createAsyncThunk(
  "admin/getQuestionById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getQuestionById/${payload}`, [], toolkit);
  }
);
export const updateQuestionAsync = createAsyncThunk(
  "admin/updateQuestionBankId",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateQuestionBankId`, payload, toolkit);
  }
);
export const deleteQuestionAsync = createAsyncThunk(
  "admin/deleteQuestionById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteQuestionById/${payload}`,
      [],
      toolkit
    );
  }
);
export const getChapterByMultipleSubjectIdAsync = createAsyncThunk(
  "admin/getChapterByMultipleSubjectId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getChapterByMultipleSubjectId`,
      payload,
      toolkit
    );
  }
);
export const getAllBulkFilesAsync = createAsyncThunk(
  "admin/getAllBulkFiles",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBulkFiles?page=${payload.page}&limit=${payload.limit}&fileType=question`,
      [],
      toolkit
    );
  }
);

// get question for scholarship test
export const getQuestionScholarshipTestAsync = createAsyncThunk(
  "admin/getQuestionScholarshipTestAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getScholarshipQuestions`,
      payload,
      toolkit
    );
  }
);
