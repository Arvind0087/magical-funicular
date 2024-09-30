import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getFilterAsync } from "./scholarship.async";

const initialState = {
  scholarshipLoader: false,
  scholarshipFilter: []
};

export const ScholarshipFilterSlice = createSlice({
  name: "gallery",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getFilterAsync.pending), (state) => {
      state.scholarshipLoader = true;
    });
    builder.addMatcher(isAnyOf(getFilterAsync.fulfilled), (state, action) => {
      state.scholarshipLoader = false;
      state.scholarshipFilter = action.payload.data;
    });
    builder.addMatcher(isAnyOf(getFilterAsync.rejected), (state, action) => {
      state.scholarshipLoader = false;
    });
  },
  reducers: {
    emptyScholarship: () => initialState
  }
});

export const { emptyScholarship } = ScholarshipFilterSlice.actions;

export default ScholarshipFilterSlice.reducer;
