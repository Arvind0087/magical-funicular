import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllBannerByTypeAsync,
  getcountBookmarkAsync,
  getAllOnlyForYouAsync,
} from "../async.api";

const initialState = {
  bannerLoader: false,
  banners: [],
  //only for you
  AllOnlyForYouLoader: false,
  AllOnlyForYou: [],
  //my bookmark
  countBookmarkbyidLoader: false,
  countBookmarkbyid: [],
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllBannerByTypeAsync.pending), (state) => {
      state.bannerLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllBannerByTypeAsync.fulfilled),
      (state, action) => {
        state.bannerLoader = false;
        state.banners = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllBannerByTypeAsync.rejected),
      (state, action) => {
        state.bannerLoader = false;
        state.banners = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(getcountBookmarkAsync.pending), (state) => {
      state.countBookmarkbyidLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getcountBookmarkAsync.fulfilled),
      (state, action) => {
        state.countBookmarkbyidLoader = false;
        state.countBookmarkbyid = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getcountBookmarkAsync.rejected),
      (state, action) => {
        state.countBookmarkbyidLoader = false;
        state.countBookmarkbyid = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(getAllOnlyForYouAsync.pending), (state) => {
      state.AllOnlyForYouLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllOnlyForYouAsync.fulfilled),
      (state, action) => {
        state.AllOnlyForYouLoader = false;
        state.AllOnlyForYou = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllOnlyForYouAsync.rejected),
      (state, action) => {
        state.AllOnlyForYouLoader = false;
      }
    );
  },
});

export default dashboardSlice.reducer;
