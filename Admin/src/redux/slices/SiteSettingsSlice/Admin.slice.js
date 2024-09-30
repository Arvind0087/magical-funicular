import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import {
  getAllAdminAsync,
  updateWebByIdAsync,
  getSettingForAdminAsync,
  getAllBookmarkImagesAsync
} from "./WebAsync.api";

const initialState = {
  adminLoader: false,
  admin: [],
  updateadmin: [],
  adminSetting: [],
  getAllBookmarkImages: []
};

export const AdminSlice = createSlice({
  name: "admin",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllAdminAsync.pending,
        updateWebByIdAsync.pending,
        getSettingForAdminAsync.pending,
        getAllBookmarkImagesAsync.pending,
      ),
      (state) => {
        state.adminLoader = true;
      }
    );

    builder.addMatcher(isAnyOf(getAllAdminAsync.fulfilled), (state, action) => {
      state.adminLoader = false;
      state.admin = action.payload.data;
    });

    builder.addMatcher(
      isAnyOf(getSettingForAdminAsync.fulfilled),
      (state, action) => {
        state.adminLoader = false;
        state.adminSetting = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(updateWebByIdAsync.fulfilled),
      (state, action) => {
        state.adminLoader = false;
        state.updateadmin = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllBookmarkImagesAsync.fulfilled),
      (state, action) => {
        state.adminLoader = false;
        state.getAllBookmarkImages = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAllAdminAsync.rejected,
        updateWebByIdAsync.rejected,
        getSettingForAdminAsync.rejected,
        getAllBookmarkImagesAsync.rejected,
      ),
      (state, action) => {
        state.adminLoader = false;
      }
    );
  },
  reducers: {
    emptyadmin: (state) => {
      state.updateadmin = [];
    }
  }
});

export const { emptyadmin } = AdminSlice.actions;

export default AdminSlice.reducer;
