import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { adminsignupAsync } from "../async.api";

const initialState = {
  signupLoader: false,
  signup: [],
};

export const signupSlice = createSlice({
  name: "signup",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(adminsignupAsync.pending), (state) => {
      state.signupLoader = true;
    });
    builder.addMatcher(isAnyOf(adminsignupAsync.fulfilled), (state, action) => {
      state.signupLoader = false;
      state.signup = action.payload;
    });
    builder.addMatcher(isAnyOf(adminsignupAsync.rejected), (state, action) => {
      state.signupLoader = false;
    });
  },
  reducers: {
    emptysignup: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptysignup } = signupSlice.actions;

export default signupSlice.reducer;
