import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import {
  //------------------------------Scholorship Add Section
  getAllScholorshipAddAsync,
  createScholarshipAddAsync,
  getScholorshipAddByIdAsync,
  updateScholarshipAddAsync,
  deleteScholarshipAddAsync,
  //------------------------------Scholorship Create Section
  getAllScholorshipByClassAsync,
  createScholorshipByClassesAsync,
  getScholorshipClassBasedByIdAsync,
  updateScholarshipClassBAsedAsync,
  deleteClassBasedScholarshipAsync,
  //---------------------------------------------------Others
  getBatchByMultipleClassIddAsync,
  getSubjectByMultipleClassIdAsync,

  // scholarship test section
  getAllScholarshipTestAsync,
  getScholarshipDetailsAsync,
  createScholarshipTestAsync,
  getScholarshipTestByIdAsync
} from "./async.api";

const initialState = {
  scholorshipLoader: false,
  getAllScholorshipAdd: [],
  createScholorshipAdd: [],
  getScholorshipAddById: [],
  updateScholarshipAdd: [],
  deleteScholarshipMaster: [],
  // -----------------------------------------------------------------//
  getAllScholorshipByClass: [],
  createScholorshipByClasses: [],
  getScholorshipOnly: [],
  updateCBScholarship: [],
  deleteClassScholarship: [],
  //----------------------------------------------------Others
  getBatchByMultipleClass: [],
  getSubjectByMultipleClass: [],
  //----------------------------------------------------Scholarship test
  getAllScholarshipTest: [],
  getScholarshipDetails: [],
  createScholarshipTest: [],
  getScholarshipTestById: []
};

export const scholorshipSlice = createSlice({
  name: "Scholorship",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllScholorshipAddAsync.pending,
        createScholarshipAddAsync.pending,
        getScholorshipAddByIdAsync.pending,
        updateScholarshipAddAsync.pending,
        deleteScholarshipAddAsync.pending,
        // ----------------------------------------------------------//
        getAllScholorshipByClassAsync.pending,
        createScholorshipByClassesAsync.pending,
        getScholorshipClassBasedByIdAsync.pending,
        updateScholarshipClassBAsedAsync.pending,
        deleteClassBasedScholarshipAsync.pending,
        // ---------------------------------------------------------//
        getBatchByMultipleClassIddAsync.pending,
        getSubjectByMultipleClassIdAsync.pending,

        // ---------------------------------------------------------//
        getAllScholarshipTestAsync.pending,
        getScholarshipDetailsAsync.pending,
        createScholarshipTestAsync.pending,
        getScholarshipTestByIdAsync.pending
      ),
      (state) => {
        state.scholorshipLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllScholorshipAddAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.getAllScholorshipAdd = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(createScholarshipAddAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.createScholorshipAdd = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getScholorshipAddByIdAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.getScholorshipAddById = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(updateScholarshipAddAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.updateScholarshipAdd = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(deleteScholarshipAddAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.deleteScholarshipMaster = action.payload;
      }
    );
    // -------------------------------------------------Create Scholarship Section Start//

    builder.addMatcher(
      isAnyOf(getAllScholorshipByClassAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.getAllScholorshipByClass = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(createScholorshipByClassesAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.createScholorshipByClasses = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getScholorshipClassBasedByIdAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.getScholorshipOnly = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(updateScholarshipClassBAsedAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.updateCBScholarship = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(deleteClassBasedScholarshipAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.deleteClassScholarship = action.payload;
      }
    );
    // ------------------------------------------------------Others
    builder.addMatcher(
      isAnyOf(getBatchByMultipleClassIddAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.getBatchByMultipleClass = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getSubjectByMultipleClassIdAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.getSubjectByMultipleClass = action.payload;
      }
    );

    // ------------------------------------------------------Scholarship test
    builder.addMatcher(
      isAnyOf(getAllScholarshipTestAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.getAllScholarshipTest = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getScholarshipDetailsAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.getScholarshipDetails = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(createScholarshipTestAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.createScholarshipTest = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getScholarshipTestByIdAsync.fulfilled),
      (state, action) => {
        state.scholorshipLoader = false;
        state.getScholarshipTestById = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAllScholorshipAddAsync.rejected,
        createScholarshipAddAsync.rejected,
        getScholorshipAddByIdAsync.rejected,
        updateScholarshipAddAsync.rejected,
        deleteScholarshipAddAsync.rejected,
        // -------------------------------------------------------------//
        getAllScholorshipByClassAsync.rejected,
        createScholorshipByClassesAsync.rejected,
        getScholorshipClassBasedByIdAsync.rejected,
        updateScholarshipClassBAsedAsync.rejected,
        deleteClassBasedScholarshipAsync.rejected,
        //----------------------------------------------------------//
        getBatchByMultipleClassIddAsync.rejected,
        getSubjectByMultipleClassIdAsync.rejected,
        //----------------------------------------------------------//
        getAllScholarshipTestAsync.rejected,
        getScholarshipDetailsAsync.rejected,
        createScholarshipTestAsync.rejected,
        getScholarshipTestByIdAsync.rejected
      ),
      (state, action) => {
        state.scholorshipLoader = false;
      }
    );
  },

  reducers: {
    emptyScholorship: (state) => initialState
  }
});

export const { emptyScholorship } = scholorshipSlice.actions;

export default scholorshipSlice.reducer;
