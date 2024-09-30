import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllCoursesAsync,
  getProductByIdAsync,
  getClassByBatchIdAsync,
  getBatchTypeByClassIdAsync,
  getBatchStartDateByBatchTypeIdAsync,
  getFinalPackagePriceByAllIdAsync,
  getPackageByUserIdAsync,
} from "../async.api";

const initialState = {
  subscriptionLoader: false,
  allCoursesList: [],
  productDetails: [],
  allDropdownData: [],
  allPackageLoader: false,
  getAllPackage: {},
};

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllCoursesAsync.pending,
        getProductByIdAsync.pending,
        getClassByBatchIdAsync.pending,
        getBatchTypeByClassIdAsync.pending,
        getBatchStartDateByBatchTypeIdAsync.pending,
        getFinalPackagePriceByAllIdAsync.pending
      ),
      (state) => {
        state.subscriptionLoader = true;
      }
    );

    builder.addMatcher(isAnyOf(getPackageByUserIdAsync.pending), (state) => {
      state.allPackageLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getPackageByUserIdAsync.fulfilled),
      (state, action) => {
        state.allPackageLoader = false;
        state.getAllPackage = action.payload?.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getPackageByUserIdAsync.rejected),
      (state, action) => {
        state.allPackageLoader = false;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllCoursesAsync.fulfilled),
      (state, action) => {
        state.subscriptionLoader = false;
        state.allCoursesList = action.payload?.data;
      }
    );

    builder.addMatcher(
      isAnyOf(getProductByIdAsync.fulfilled),
      (state, action) => {
        state.subscriptionLoader = false;
        state.productDetails = action.payload?.data;
      }
    );

    builder.addMatcher(
      isAnyOf(getClassByBatchIdAsync.fulfilled),
      (state, action) => {
        state.subscriptionLoader = false;
        const payloadIs = {
          class: action.payload.data,
          batchType: [], // reset other dropdown field
          batchStartDate: [],
          packageData: [],
        };
        state.allDropdownData[action.meta?.arg?.index] = payloadIs;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchTypeByClassIdAsync.fulfilled),
      (state, action) => {
        state.subscriptionLoader = false;
        const payloadIs = {
          class: state.allDropdownData[action.meta?.arg?.index].class,
          batchType: action.payload.data,
          batchStartDate: [],
          packageData: [],
        };
        state.allDropdownData[action.meta?.arg?.index] = payloadIs;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchStartDateByBatchTypeIdAsync.fulfilled),
      (state, action) => {
        state.subscriptionLoader = false;
        const payloadIs = {
          class: state.allDropdownData[action.meta?.arg?.index].class,
          batchType: state.allDropdownData[action.meta?.arg?.index].batchType,
          batchStartDate: action.payload.data,
          packageData: [],
        };
        state.allDropdownData[action.meta?.arg?.index] = payloadIs;
      }
    );
    builder.addMatcher(
      isAnyOf(getFinalPackagePriceByAllIdAsync.fulfilled),
      (state, action) => {
        state.subscriptionLoader = false;
        const payloadIs = {
          class: state.allDropdownData[action.meta?.arg?.index].class,
          batchType: state.allDropdownData[action.meta?.arg?.index].batchType,
          batchStartDate:
            state.allDropdownData[action.meta?.arg?.index].batchStartDate,
          packageData: action.payload.data,
        };
        state.allDropdownData[action.meta?.arg?.index] = payloadIs;
      }
    );
    builder.addMatcher(
      isAnyOf(getProductByIdAsync.rejected),
      (state, action) => {
        state.subscriptionLoader = false;
        state.productDetails = [];
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllCoursesAsync.rejected,
        getClassByBatchIdAsync.rejected,
        getBatchTypeByClassIdAsync.rejected,
        getBatchStartDateByBatchTypeIdAsync.rejected,
        getFinalPackagePriceByAllIdAsync.rejected
      ),
      (state, action) => {
        state.subscriptionLoader = false;
      }
    );
  },
  reducers: {
    emptysubscription: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptysubscription } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
