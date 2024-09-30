import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { changeAdminPasswordAsync } from "./changepassword.async";

const initialState = {
  changePasswordLoader: false,
  passwordchange: [],
};

export const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(changeAdminPasswordAsync.pending), (state) => {
      state.changePasswordLoader = true;
    });

    builder.addMatcher(
      isAnyOf(changeAdminPasswordAsync.fulfilled),
      (state, action) => {
        state.changePasswordLoader = false;
        state.passwordchange = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(changeAdminPasswordAsync.rejected),
      (state, action) => {
        state.changePasswordLoader = false;
      }
    );
  },
  reducers: {
    emptychangepassword: (state) => initialState,
  },
});

export const { emptychangepassword } = changePasswordSlice.actions;

export default changePasswordSlice.reducer;
