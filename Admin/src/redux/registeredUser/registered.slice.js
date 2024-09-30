import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getRegisteredAsync } from "./registered.async";

const initialState = {
  registeredLoader: false,
  registeredUser: [],
};

export const registeredSlice = createSlice({
  name: "registeredUser",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getRegisteredAsync.pending), (state) => {
      state.registeredLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getRegisteredAsync.fulfilled),
      (state, action) => {
        state.registeredLoader = false;
        state.registeredUser = action.payload.data;
      }
    );
    builder.addMatcher(isAnyOf(getRegisteredAsync.rejected), (state, action) => {
      state.registeredLoader = false;
    });
  },
  reducers: {
    emptyregistered: (state) => initialState,
  },
});

export const { emptyregistered } = registeredSlice.actions;

export default registeredSlice.reducer;
