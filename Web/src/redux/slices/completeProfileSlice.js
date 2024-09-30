import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { start } from "nprogress";
import {
  getAllCoursesAsync,
  getAllCoursesForWebAppAsync,
  getBoardsByCourseIdAsync,
  getBoardsByCourseIdForWebAppAsync,
  getClassByBoardIdAsync,
  getClassByBoardIdForWebAppAsync,
  getBatchByCourseBoardClassAsync,
  getBatchTypeByClassIdForWebAppAsync,
  getBatchDateByBatchTypeIdAsync,
  getBatchDateByBatchTypeIdForWebAppAsync,
  getBatchsByLanguageForWebAppAsync,
} from "../async.api";

const initialState = {
  allCoursesLoader: false,
  allCourses: [],
  boardLoader: false,
  allBoard: [],
  classLoader: false,
  allClass: [],
  batchTypeLoader: false,
  allBatchType: [],
  batchDateLoader: false,
  allBatchDate: [],
  classSelectHidden: true,
  batchTypeHidden: true,
  batchStartDateHidden: true,
  submitButtonHidden: true,
  batchLoader: false,
  getAllBatch: [],
};

export const completeProfileSlice = createSlice({
  name: "completeProfile",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(getAllCoursesForWebAppAsync.pending),
      (state) => {
        state.allCoursesLoader = true;
        state.allCourses = [];
      }
    );
    builder.addMatcher(isAnyOf(getAllCoursesAsync.pending), (state) => {
      state.allCoursesLoader = true;
      state.allCourses = [];
    });
    builder.addMatcher(
      isAnyOf(getBoardsByCourseIdAsync.pending),
      (state, action) => {
        state.boardLoader = true;
        state.allBoard = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getBoardsByCourseIdForWebAppAsync.pending),
      (state, action) => {
        state.boardLoader = true;
        state.allBoard = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getClassByBoardIdAsync.pending),
      (state, action) => {
        state.classLoader = true;
        state.allClass = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getClassByBoardIdForWebAppAsync.pending),
      (state, action) => {
        state.classLoader = true;
        state.allClass = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchByCourseBoardClassAsync.pending),
      (state, action) => {
        state.batchTypeLoader = true;
        state.allBatchType = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchTypeByClassIdForWebAppAsync.pending),
      (state, action) => {
        state.batchTypeLoader = true;
        // state.allBatchType = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchDateByBatchTypeIdAsync.pending),
      (state, action) => {
        state.batchDateLoader = true;
        state.allBatchDate = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchDateByBatchTypeIdForWebAppAsync.pending),
      (state, action) => {
        state.batchDateLoader = true;
        state.allBatchDate = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchsByLanguageForWebAppAsync.pending),
      (state, action) => {
        state.batchLoader = true;
      }
    );

    // fulfilled................................................
    builder.addMatcher(
      isAnyOf(getAllCoursesAsync.fulfilled),
      (state, action) => {
        state.allCoursesLoader = false;
        state.allCourses = action.payload.data;
        state.allBoard = []; // reset the value
        state.allClass = [];
        state.allBatchType = [];
        state.allBatchDate = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getAllCoursesForWebAppAsync.fulfilled),
      (state, action) => {
        state.allCoursesLoader = false;
        state.allCourses = action.payload.data;
        state.allBoard = []; // reset the value
        state.allClass = [];
        state.allBatchType = [];
        state.allBatchDate = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getBoardsByCourseIdAsync.fulfilled),
      (state, action) => {
        state.boardLoader = false;
        state.allBoard = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getBoardsByCourseIdForWebAppAsync.fulfilled),
      (state, action) => {
        state.boardLoader = false;
        state.allBoard = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getClassByBoardIdAsync.fulfilled),
      (state, action) => {
        state.classLoader = false;
        state.allClass = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getClassByBoardIdForWebAppAsync.fulfilled),
      (state, action) => {
        state.classLoader = false;
        state.allClass = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchByCourseBoardClassAsync.fulfilled),
      (state, action) => {
        state.batchTypeLoader = false;
        state.allBatchType = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchTypeByClassIdForWebAppAsync.fulfilled),
      (state, action) => {
        state.batchTypeLoader = false;
        state.allBatchType = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchDateByBatchTypeIdAsync.fulfilled),
      (state, action) => {
        state.batchDateLoader = false;
        state.allBatchDate = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchDateByBatchTypeIdForWebAppAsync.fulfilled),
      (state, action) => {
        state.batchDateLoader = false;
        state.allBatchDate = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(getBatchsByLanguageForWebAppAsync.fulfilled),
      (state, action) => {
        state.batchLoader = false;
        state.getAllBatch = action.payload.data;
      }
    );

    //  rejected...............................................................................
    builder.addMatcher(isAnyOf(getAllCoursesAsync.rejected), (state) => {
      state.allCoursesLoader = false;
      state.allCourses = [];
    });
    builder.addMatcher(
      isAnyOf(getAllCoursesForWebAppAsync.rejected),
      (state) => {
        state.allCoursesLoader = false;
        state.allCourses = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getBoardsByCourseIdAsync.rejected),
      (state, action) => {
        state.boardLoader = false;
        state.allBoard = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getBoardsByCourseIdForWebAppAsync.rejected),
      (state, action) => {
        state.boardLoader = false;
        state.allBoard = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getClassByBoardIdAsync.rejected),
      (state, action) => {
        state.classLoader = false;
        state.allClass = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getClassByBoardIdForWebAppAsync.rejected),
      (state, action) => {
        state.classLoader = false;
        state.allClass = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchByCourseBoardClassAsync.rejected),
      (state, action) => {
        state.batchTypeLoader = false;
        state.allBatchType = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchTypeByClassIdForWebAppAsync.rejected),
      (state, action) => {
        state.batchTypeLoader = false;
        // state.allBatchType = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchDateByBatchTypeIdAsync.rejected),
      (state, action) => {
        state.batchDateLoader = false;
        state.allBatchDate = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchDateByBatchTypeIdForWebAppAsync.rejected),
      (state, action) => {
        state.batchDateLoader = false;
        state.allBatchDate = [];
      }
    );

    builder.addMatcher(
      isAnyOf(getBatchsByLanguageForWebAppAsync.rejected),
      (state, action) => {
        state.batchLoader = false;
      }
    );
  },
  reducers: {
    emptycreateProfile: (state) => {
      return {
        ...initialState,
      };
    },
    showHiddenSection: (state, payload) => {
      switch (payload.payload.hiddentype) {
        case "all":
          state.classSelectHidden = true;
          state.batchTypeHidden = true;
          state.batchStartDateHidden = true;
          start.submitButtonHidden = true;
          break;
        case "boardSelect":
          state.classSelectHidden = false;
          state.batchTypeHidden = true;
          state.batchStartDateHidden = true;
          state.submitButtonHidden = true;
          break;
        case "classSelect":
          state.batchTypeHidden = false;
          state.batchStartDateHidden = true;
          state.submitButtonHidden = true;
          break;
        case "batchTypeSelect":
          state.batchStartDateHidden = false;
          state.submitButtonHidden = true;
          break;
        case "batchStartDateHidden":
          state.submitButtonHidden = false;
      }
    },
  },
});

export const { emptycreateProfile, showHiddenSection } =
  completeProfileSlice.actions;

export default completeProfileSlice.reducer;
