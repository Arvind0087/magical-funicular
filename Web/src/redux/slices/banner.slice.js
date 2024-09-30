import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createBannerAsync,
  getAllBannerAsync,
  getBannerByIdAsync,
  updateBannerAsync,
} from "../async.api";

const initialState = {
  bannerLoader: false,
  banner: [],
  banneradd: [],
  bannerById: [],
  bannerupdate: [],
};

export const bannerSlice = createSlice({
  name: "banner",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllBannerAsync.pending,
        createBannerAsync.pending,
        getBannerByIdAsync.pending,
        updateBannerAsync.pending
      ),
      (state) => {
        state.bannerLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllBannerAsync.fulfilled),
      (state, action) => {
        state.bannerLoader = false;
        state.banner = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(createBannerAsync.fulfilled),
      (state, action) => {
        state.bannerLoader = false;
        state.banneradd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getBannerByIdAsync.fulfilled),
      (state, action) => {
        state.bannerLoader = false;
        state.bannerById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateBannerAsync.fulfilled),
      (state, action) => {
        state.bannerLoader = false;
        state.bannerupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllBannerAsync.rejected,
        createBannerAsync.rejected,
        getBannerByIdAsync.rejected,
        updateBannerAsync.rejected
      ),
      (state, action) => {
        state.bannerLoader = false;
      }
    );
  },
  reducers: {
    emptybanner: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptybanner } = bannerSlice.actions;

export default bannerSlice.reducer;
