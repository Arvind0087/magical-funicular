import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getFilterAsync } from "./student.async";

const initialState = {
  studentFilterLoader: false,
  studentFilter: [],
};

export const studentFilterSlice = createSlice({
  name: "student",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getFilterAsync.pending), (state) => {
      state.studentFilterLoader = true;
    });
    builder.addMatcher(isAnyOf(getFilterAsync.fulfilled), (state, action) => {
      state.studentFilterLoader = false;
      state.studentFilter = action.payload.data;
    });
    builder.addMatcher(isAnyOf(getFilterAsync.rejected), (state, action) => {
      state.studentFilterLoader = false;
    });
  },
  reducers: {
    emptyStudent: () => initialState,
  },
});

export const { emptyStudent } = studentFilterSlice.actions;

export default studentFilterSlice.reducer;
