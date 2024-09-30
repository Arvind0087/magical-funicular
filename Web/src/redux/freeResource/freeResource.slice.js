import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { modalPaperUserIdAsync, userAllPyqsAsync } from "./freeResource.async";

const initialState = {
  freeModalLoader: false,
  freeModal: [],
  freePyqsLoader: false,
  freePyqs: [],
};

export const freeResourceSlice = createSlice({
  name: "freeresource",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(modalPaperUserIdAsync.pending), (state) => {
      state.freeModalLoader = true;
      state.freeModal = [];
    });
    builder.addMatcher(
      isAnyOf(modalPaperUserIdAsync.fulfilled),
      (state, action) => {
        state.freeModalLoader = false;
        state.freeModal = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(modalPaperUserIdAsync.rejected),
      (state, action) => {
        state.freeModalLoader = false;
        state.freeModal = [];
      }
    );

    builder.addMatcher(isAnyOf(userAllPyqsAsync.pending), (state) => {
      state.freePyqsLoader = true;
      state.freePyqs = [];
    });
    builder.addMatcher(isAnyOf(userAllPyqsAsync.fulfilled), (state, action) => {
      state.freePyqsLoader = false;
      state.freePyqs = action.payload.data;
    });
    builder.addMatcher(isAnyOf(userAllPyqsAsync.rejected), (state, action) => {
      state.freePyqsLoader = false;
      state.freePyqs = [];
    });
  },
});

export default freeResourceSlice.reducer;
