import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createCoursePackageAsync,
  updateCoursePackageByIdAsync,
  allCoursePackagesAsync,
  coursePackageByIdAsync,
  updateCoursePackageStatusAsync,
  getCoursePackagesAsync,
} from "./productPackage.async";

const initialState = {
  createPackageLoader: false,
  packagePostData: [],
  getPackageLoader: false,
  getAllPackage: [],
  updatePackageLoader: false,
  updatePackage: [],
  getPackByIdLoader: false,
  getPackByIdData: [],
  packageStatusLoader: false,
  packageStatus: [],
  allPackagesLoader: false,
  allPackages: [],
};

export const productPackageSlice = createSlice({
  name: "Product",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getCoursePackagesAsync.pending), (state) => {
      state.allPackagesLoader = true;
    });

    builder.addMatcher(
      isAnyOf(getCoursePackagesAsync.fulfilled),
      (state, action) => {
        state.allPackagesLoader = false;
        state.allPackages = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getCoursePackagesAsync.rejected),
      (state, action) => {
        state.allPackagesLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(createCoursePackageAsync.pending), (state) => {
      state.createPackageLoader = true;
    });

    builder.addMatcher(
      isAnyOf(createCoursePackageAsync.fulfilled),
      (state, action) => {
        state.createPackageLoader = false;
        state.packagePostData = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(createCoursePackageAsync.rejected),
      (state, action) => {
        state.createPackageLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(allCoursePackagesAsync.pending), (state) => {
      state.getPackageLoader = true;
    });

    builder.addMatcher(
      isAnyOf(allCoursePackagesAsync.fulfilled),
      (state, action) => {
        state.getPackageLoader = false;
        state.getAllPackage = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(allCoursePackagesAsync.rejected),
      (state, action) => {
        state.getPackageLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(coursePackageByIdAsync.pending), (state) => {
      state.getPackByIdLoader = true;
    });

    builder.addMatcher(
      isAnyOf(coursePackageByIdAsync.fulfilled),
      (state, action) => {
        state.getPackByIdLoader = false;
        state.getPackByIdData = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(coursePackageByIdAsync.rejected),
      (state, action) => {
        state.getPackByIdLoader = false;
      }
    );

    builder.addMatcher(
      isAnyOf(updateCoursePackageStatusAsync.pending),
      (state) => {
        state.packageStatusLoader = true;
      }
    );

    builder.addMatcher(
      isAnyOf(updateCoursePackageStatusAsync.fulfilled),
      (state, action) => {
        state.packageStatusLoader = false;
        state.packageStatus = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(updateCoursePackageStatusAsync.rejected),
      (state, action) => {
        state.packageStatusLoader = false;
      }
    );

    builder.addMatcher(
      isAnyOf(updateCoursePackageByIdAsync.pending),
      (state) => {
        state.updatePackageLoader = true;
      }
    );

    builder.addMatcher(
      isAnyOf(updateCoursePackageByIdAsync.fulfilled),
      (state, action) => {
        state.updatePackageLoader = false;
        state.updatePackage = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(updateCoursePackageByIdAsync.rejected),
      (state, action) => {
        state.updatePackageLoader = false;
      }
    );
  },
});

export default productPackageSlice.reducer;
