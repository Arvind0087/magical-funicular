import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../AxiosClient";

// export const getAllQuestionAsync = createAsyncThunk(
//   "admin/getAllQuestion",
//   async (payload, toolkit) => {
//     return await AxiosClient(
//       "GET",
//       `/getAllQuestion?page=${payload.page}&limit=${payload.limit}&subject=${
//         payload.subject || "" }&chapter=${payload.chapter || ""}`,
//       [],
//       toolkit
//     );
//   }
// );

export const createIndividualSettingAsync = createAsyncThunk(
  "admin/createInternalSetting",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/createInternalSetting`,
      payload,
      toolkit
    );
  }
);

export const getIndividualSettingByIdAsync = createAsyncThunk(
  "admin/getInternalSettingByUserId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getInternalSettingByUserId?userId=${payload.userId}`,
      [],
      toolkit
    );
  }
);

export const updateIndividualSettingAsync = createAsyncThunk(
  "admin/updateInternalSettingByUserId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PUT",
      `/updateInternalSettingByUserId`,
      payload,
      toolkit
    );
  }
);
