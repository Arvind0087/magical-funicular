import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addSyllabusAsync,
  getAllSyllabusAsync,
  getSyllausByIdAsync,
  updateSyllabusAsync,
} from "../async.api";

const initialState = {
  syllabusLoader: false,
  syllabus: [],
  syllabusadd: [],
  syllabusbyid: [],
  syllabusupdate: [],
};

export const syllabusSlice = createSlice({
  name: "syllabus",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        addSyllabusAsync.pending,
        getAllSyllabusAsync.pending,
        getSyllausByIdAsync.pending,
        updateSyllabusAsync.pending
      ),
      (state) => {
        state.syllabusLoader = true;
      }
    );
   
    builder.addMatcher(
      isAnyOf(getAllSyllabusAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.syllabus = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(addSyllabusAsync.fulfilled), (state, action) => {
      state.syllabusLoader = false;
      state.syllabusadd = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getSyllausByIdAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.syllabusbyid = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateSyllabusAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.syllabusupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        addSyllabusAsync.rejected,
        getAllSyllabusAsync.rejected,
        updateSyllabusAsync.rejected,
        getSyllausByIdAsync.rejected
      ),
      (state, action) => {
        state.syllabusLoader = false;
      }
    );
  },
  reducers: {
    emptysyllabus: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptysyllabus } = syllabusSlice.actions;

export default syllabusSlice.reducer;
