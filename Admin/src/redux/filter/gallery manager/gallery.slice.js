import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getFilterAsync } from "./gallery.async";

const initialState = {
  galleryFilterLoader: false,
  galleryFilter: []
};

export const galleryFilterSlice = createSlice({
  name: "gallery",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getFilterAsync.pending), (state) => {
      state.galleryFilterLoader = true;
    });
    builder.addMatcher(isAnyOf(getFilterAsync.fulfilled), (state, action) => {
      state.galleryFilterLoader = false;
      state.galleryFilter = action.payload.data;
    });
    builder.addMatcher(isAnyOf(getFilterAsync.rejected), (state, action) => {
      state.galleryFilterLoader = false;
    });
  },
  reducers: {
    emptygallery: () => initialState
  }
});

export const { emptyshorts } = galleryFilterSlice.actions;

export default galleryFilterSlice.reducer;
