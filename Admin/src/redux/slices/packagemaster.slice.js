import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllPackagesAsync,
  addPackageAsync,
  updatePackageByIdAsync,
  getpackageByIdAsync,
  getPackagesMonthAsync
} from "../async.api";

const initialState = {
  masterLoader: false,
  master: [],
  packageadd: [],
  packageupdateId: [],
  packageId: [],
  getPackagesMonth: [],
};

export const masterSlice = createSlice({
  name: "master",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllPackagesAsync.pending,
        updatePackageByIdAsync.pending,
        addPackageAsync.pending,
        getpackageByIdAsync.pending,
        getPackagesMonthAsync.pending
      ),
      (state) => {
        state.masterLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllPackagesAsync.fulfilled),
      (state, action) => {
        state.masterLoader = false;
        state.master = action.payload;
      }
    );

    builder.addMatcher(isAnyOf(addPackageAsync.fulfilled), (state, action) => {
      state.masterLoader = false;
      state.packageadd = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getpackageByIdAsync.fulfilled),
      (state, action) => {
        state.masterLoader = false;
        state.packageId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updatePackageByIdAsync.fulfilled),
      (state, action) => {
        state.masterLoader = false;
        state.packageupdateId = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getPackagesMonthAsync.fulfilled),
      (state, action) => {
        state.masterLoader = false;
        state.getPackagesMonth = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAllPackagesAsync.rejected,
        addPackageAsync.rejected,
        updatePackageByIdAsync.rejected,
        getPackagesMonthAsync.rejected,
      ),
      (state, action) => {
        state.masterLoader = false;
        state.packageadd = action.payload;
      }
    );
  },

  reducers: {
    emptypackage: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptypackage } = masterSlice.actions;

export default masterSlice.reducer;
