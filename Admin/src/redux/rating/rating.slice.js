import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllRatingAsync } from "./rating.async";

const initialState = {
  ratingLoader: false,
  rating: [],
};

export const ratingSlice = createSlice({
  name: "rating",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllRatingAsync.pending), (state) => {
      state.ratingLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllRatingAsync.fulfilled),
      (state, action) => {
        state.ratingLoader = false;
        state.rating = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(getAllRatingAsync.rejected), (state, action) => {
      state.ratingLoader = false;
    });
  },
  reducers: {
    emptyrating: (state) => initialState,
  },
});
export const { emptyrating } = ratingSlice.actions;
export default ratingSlice.reducer;
