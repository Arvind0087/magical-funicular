import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getFilterAsync } from "./staff.async";

const initialState = {
  shortsLoader: false,
  staffFilter: []
};

export const staffFilterSlice = createSlice({
  name: "staff",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getFilterAsync.pending), (state) => {
      state.staffLoader = true;
    });
    builder.addMatcher(
        isAnyOf(getFilterAsync.fulfilled),
        (state, action) => {
          state.shortsLoader = false;
          state.staffFilter = action.payload.data;
        }
      );
  },
  reducers: {
    emptystaff: () => initialState
  }
});

export const { emptyshorts } = staffFilterSlice.actions;

export default staffFilterSlice.reducer;
