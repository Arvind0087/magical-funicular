import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getFreeEventByStudentIdAsync } from "./freeliveClass.async";

const initialState = {
  freeLiveLoader: false,
  freeLive: [],
};

export const freeLiveClassSlice = createSlice({
  name: "freelive",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(getFreeEventByStudentIdAsync.pending),
      (state) => {
        state.freeLiveLoader = true;
        state.freeLive = [];
      }
    );
    builder.addMatcher(
      isAnyOf(getFreeEventByStudentIdAsync.fulfilled),
      (state, action) => {
        state.freeLiveLoader = false;
        state.freeLive = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(getFreeEventByStudentIdAsync.rejected),
      (state, action) => {
        state.freeLiveLoader = false;
        state.freeLive = [];
      }
    );
  },
});

export default freeLiveClassSlice.reducer;
