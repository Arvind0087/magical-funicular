import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../AxiosClient";

export const getContentsByTopicIdAsync = createAsyncThunk(
  "web/getContentsByTopicId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getSyllabusContentByTopicId?topicId=${payload.topicId}`,
      payload,
      toolkit
    );
  }
);

export const getSyllabusContentByIdAsync = createAsyncThunk(
  "web/getSyllabusContentById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getSyllabusContentById/${payload}`,
      [],
      toolkit
    );
  }
);

export const chapterNotesAsync = createAsyncThunk(
  "web/chapterNotes",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/chapterNotes?chapterId=${payload?.chapterId}`,
      [],
      toolkit
    );
  }
);

export const getLearningContentByIdAsync = createAsyncThunk(
  "web/getLearningContentById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getLearningContentById`,
      payload,
      toolkit
    );
  }
);

export const addMarkAsReadAsync = createAsyncThunk(
  "web/addMarkAsRead",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addMarkAsRead`, payload, toolkit);
  }
);

//resumeLearning
export const resumeLearningAsync = createAsyncThunk(
  "user/resumeLearning",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/resumeLearning?subjectId=${payload.subjectId}&chapterId=${payload.chapterId}`,
      payload,
      toolkit
    );
  }
);

//voucherByUserId
export const voucherByUserIdAsync = createAsyncThunk(
  "user/voucherByUserId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/voucherByUserId?packageId=${payload?.packageId}&search=${payload?.searchVoucher}`,
      payload,
      toolkit
    );
  }
);

// addRecentActivity
export const addRecentActivityAsync = createAsyncThunk(
  "user/addRecentActivity",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addRecentActivity`, payload, toolkit);
  }
);

// display content
export const userChapterBySubjectIdAsync = createAsyncThunk(
  "user/userChapterBySubjectId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/userChapterBySubjectId`,
      payload,
      toolkit
    );
  }
);

export const coursePackagesByStudentAsync = createAsyncThunk(
  "web/coursePackagesByStudent",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/coursePackagesByStudent?batchTypeId=${payload.batchTypeId}&type=${payload.type}`,
      [],
      toolkit
    );
  }
);

export const userAllBatchesAsync = createAsyncThunk(
  "user/allBatches",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/userAllBatches`, payload, toolkit);
  }
);

export const userCoursePackageBypackageIdAsync = createAsyncThunk(
  "web/userCoursePackageBypackageId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/userCoursePackageBypackageId?packageId=${payload?.packageId}`,
      [],
      toolkit
    );
  }
);

export const getEducatorsAsync = createAsyncThunk(
  "web/getEducators",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getEducators?packageId=${payload.packageId}`,
      [],
      toolkit
    );
  }
);
