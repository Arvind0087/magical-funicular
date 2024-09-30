import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addBatchLanguageAsync,
  getAllBatchLanguageAsync,
  getBatchLanguageByIdAsync,
  updateBatchLanguageByIdAsync,
  updateBatchLanguageStatusAsync,
  getBatchLanguageByClassIdAsync,
} from "./language.async";

const initialState = {
  languageLoader: false,
  addLanguage: [],
  allLangLoader: false,
  getAllLanguage: [],
  getLangByIdLoader: false,
  getLanguageById: [],
  updateLoader: false,
  updateLanguage: [],
  statusLoader: false,
  getStatus: [],
  langClassLoader: false,
  getLanByClass: [],
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(addBatchLanguageAsync.pending), (state) => {
      state.languageLoader = true;
    });
    builder.addMatcher(
      isAnyOf(addBatchLanguageAsync.fulfilled),
      (state, action) => {
        state.languageLoader = false;
        state.addLanguage = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(addBatchLanguageAsync.rejected),
      (state, action) => {
        state.languageLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(getAllBatchLanguageAsync.pending), (state) => {
      state.allLangLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllBatchLanguageAsync.fulfilled),
      (state, action) => {
        state.allLangLoader = false;
        state.getAllLanguage = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllBatchLanguageAsync.rejected),
      (state, action) => {
        state.allLangLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(getBatchLanguageByIdAsync.pending), (state) => {
      state.getLangByIdLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getBatchLanguageByIdAsync.fulfilled),
      (state, action) => {
        state.getLangByIdLoader = false;
        state.getLanguageById = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchLanguageByIdAsync.rejected),
      (state, action) => {
        state.getLangByIdLoader = false;
      }
    );

    builder.addMatcher(
      isAnyOf(updateBatchLanguageByIdAsync.pending),
      (state) => {
        state.updateLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(updateBatchLanguageByIdAsync.fulfilled),
      (state, action) => {
        state.updateLoader = false;
        state.updateLanguage = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateBatchLanguageByIdAsync.rejected),
      (state, action) => {
        state.updateLoader = false;
      }
    );

    builder.addMatcher(
      isAnyOf(updateBatchLanguageStatusAsync.pending),
      (state) => {
        state.statusLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(updateBatchLanguageStatusAsync.fulfilled),
      (state, action) => {
        state.statusLoader = false;
        state.getStatus = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateBatchLanguageStatusAsync.rejected),
      (state, action) => {
        state.statusLoader = false;
      }
    );

    builder.addMatcher(
      isAnyOf(getBatchLanguageByClassIdAsync.pending),
      (state) => {
        state.langClassLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchLanguageByClassIdAsync.fulfilled),
      (state, action) => {
        state.langClassLoader = false;
        state.getLanByClass = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getBatchLanguageByClassIdAsync.rejected),
      (state, action) => {
        state.langClassLoader = false;
      }
    );
  },

  reducers: {
    emptylanguage: () => initialState,
  },
});

export const { emptylanguage } = languageSlice.actions;

export default languageSlice.reducer;
