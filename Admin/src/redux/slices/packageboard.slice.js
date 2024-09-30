import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllPackagesForBoardAsync,
  addMultipleClassAsync,
  updateIndivisualPackageAsync,
  getClassDetailsByIdAsync,
  getSubscriptionByPackageIdAsync,
} from "../async.api";

const initialState = {
  packageboardLoader: false,
  packageboard: [],
  packageboardadd: [],
  classDetailsById: [],
  packageboardupdateId: [],
  getsubscriptionbypackageId: [],
  updateIndivisualPackageId: [],
};

export const packageboardSlice = createSlice({
  name: "packageboard",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllPackagesForBoardAsync.pending,
        addMultipleClassAsync.pending,
        getClassDetailsByIdAsync.pending,
        updateIndivisualPackageAsync.pending,
        getSubscriptionByPackageIdAsync.pending
      ),
      (state) => {
        state.packageboardLoader = true;
      }
    );

    builder.addMatcher(
      isAnyOf(addMultipleClassAsync.fulfilled),
      (state, action) => {
        state.packageboardLoader = false;
        state.packageboardadd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateIndivisualPackageAsync.fulfilled),
      (state, action) => {
        state.packageboardLoader = false;
        state.updateIndivisualPackageId = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllPackagesForBoardAsync.fulfilled),
      (state, action) => {
        state.packageboardLoader = false;
        state.packageboard = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getClassDetailsByIdAsync.fulfilled),
      (state, action) => {
        state.packageboardLoader = false;
        state.classDetailsById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getSubscriptionByPackageIdAsync.fulfilled),
      (state, action) => {
        state.packageboardLoader = false;
        state.getsubscriptionbypackageId = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAllPackagesForBoardAsync.rejected,
        addMultipleClassAsync.rejected,
        updateIndivisualPackageAsync.rejected,
        getClassDetailsByIdAsync.rejected,
        getSubscriptionByPackageIdAsync.rejected
      ),
      (state, action) => {
        state.packageboardLoader = false;
      }
    );
  },
  reducers: {
    emptypackageboard: (state) => initialState,
  },
});
export const { emptypackageboard } = packageboardSlice.actions;
export default packageboardSlice.reducer;
