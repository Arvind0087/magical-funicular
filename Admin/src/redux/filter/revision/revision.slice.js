import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getFilterAsync } from "./revision.async";

const initialState = {
revisionLoader: false,
  revisionFilter: []
};

export const revisionFilterSlice = createSlice({
  name: "revision",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getFilterAsync.pending), (state) => {
      state.subjectLoader = true;
    });
    builder.addMatcher(
        isAnyOf(getFilterAsync.fulfilled),
        (state, action) => {
          state.revisionLoader = false;
          state.revisionFilter = action.payload.data;
        }
      );
      builder.addMatcher(
        isAnyOf(
            getFilterAsync.rejected,
        ),
        (state, action) => {
          state.revisionLoader = false;
        }
      );
  },
  reducers: {
    emptyshorts: () => initialState
  }
});

export const { emptyshorts } = revisionFilterSlice.actions;

export default revisionFilterSlice.reducer;
