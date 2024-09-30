import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createBannerAsync,
  getAllBannerAsync,
  getBannerByIdAsync,
  updateBannerAsync,
  deleteBannerByIdAsync
} from "./banner.async";

const initialState = {
  bannerLoader: false,
  banner: [],
  banneradd: [],
  bannerById: [],
  bannerupdate: [],
  deleteBannerById: [],
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
        updateBannerAsync.pending,
        deleteBannerByIdAsync.pending,
      ),
      (state) => {
        state.bannerLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllBannerAsync.fulfilled),
      (state, action) => {
        state.bannerLoader = false;
        state.banner = action.payload;
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
      isAnyOf(deleteBannerByIdAsync.fulfilled),
      (state, action) => {
        state.bannerLoader = false;
        state.deleteBannerById = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllBannerAsync.rejected,
        createBannerAsync.rejected,
        getBannerByIdAsync.rejected,
        updateBannerAsync.rejected,
        deleteBannerByIdAsync.rejected,
      ),
      (state, action) => {
        state.bannerLoader = false;
      }
    );
  },
  reducers: {
    emptybanner: () => initialState,
  },
});
export const { emptybanner } = bannerSlice.actions;

export default bannerSlice.reducer;
