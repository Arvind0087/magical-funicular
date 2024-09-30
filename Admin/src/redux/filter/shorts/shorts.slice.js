import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getFilterAsync } from "./shorts.async";

const initialState = {
  shortsLoader: false,
  shortsFilter: []
};

export const shortsFilterSlice = createSlice({
  name: "shorts",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getFilterAsync.pending), (state) => {
      state.subjectLoader = true;
    });
    builder.addMatcher(
        isAnyOf(getFilterAsync.fulfilled),
        (state, action) => {
          state.shortsLoader = false;
          state.shortsFilter = action.payload.data;
        }
      );
      builder.addMatcher(
        isAnyOf(
            getFilterAsync.rejected,
        ),
        (state, action) => {
          state.shortsLoader = false;
        }
      );
  },
  reducers: {
    emptyshorts: () => initialState
  }
});

export const { emptyshorts } = shortsFilterSlice.actions;

export default shortsFilterSlice.reducer;
