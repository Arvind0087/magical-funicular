import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllSubjectSelectAsync } from "./subject.slice";

const initialState = {
  subjectsLoader: false,
  subjectSelect: [],
};

export const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllSubjectSelectAsync.pending), (state) => {
      state.subjectsLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllSubjectSelectAsync.fulfilled),
      (state, action) => {
        state.subjectsLoader = false;
        state.subjectSelect = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllSubjectSelectAsync.rejected),
      (state, action) => {
        state.subjectsLoader = false;
      }
    );
  },
  reducers: {
    emptySubjectSelect: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptySubjectSelect } = subjectsSlice.actions;

export default subjectsSlice.reducer;
