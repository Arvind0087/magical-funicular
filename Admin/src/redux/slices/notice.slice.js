import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllNoticeAsync,
  createNoticeAsync,
  deleteNoticeAsync,
} from "../async.api";

const initialState = {
  noticeLoader: false,
  notices: [],
  sendNotice: [],
  deleteNotice: [],
};

export const noticeSlice = createSlice({
  name: "Notice",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllNoticeAsync.pending,
        createNoticeAsync.pending,
        deleteNoticeAsync.pending
      ),
      (state) => {
        state.noticeLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllNoticeAsync.fulfilled),
      (state, action) => {
        state.noticeLoader = false;
        state.notices = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(createNoticeAsync.fulfilled),
      (state, action) => {
        state.noticeLoader = false;
        state.sendNotice = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteNoticeAsync.fulfilled),
      (state, action) => {
        state.noticeLoader = false;
        state.deleteNotice = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllNoticeAsync.rejected,
        createNoticeAsync.rejected,
        deleteNoticeAsync.rejected
      ),
      (state, action) => {
        state.noticeLoader = false;
      }
    );
  },
  reducers: {
    emptynotice: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptynotice } = noticeSlice.actions;

export default noticeSlice.reducer;
