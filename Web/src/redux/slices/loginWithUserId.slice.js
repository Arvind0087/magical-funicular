import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { loginWithUserIdAsync } from "../async.api";

const initialState = {
  loginWithUserIdLoader: false,
  // loginError: "",
  loginWithUserId: [],
};

export const loginwithUserIdSlice = createSlice({
  name: "loginWithUserId",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(loginWithUserIdAsync.pending), (state) => {
      state.loginWithUserIdLoader = true;
    });
    builder.addMatcher(isAnyOf(loginWithUserIdAsync.fulfilled), (state, action) => {
      state.loginWithUserIdLoader = false;
      state.login = action.payload;
    });
    builder.addMatcher(isAnyOf(loginWithUserIdAsync.rejected), (state, action) => {
      state.loginWithUserIdLoader = false;
      state.loginError = action.payload;
    });
  },
  reducers: {
    emptylogin: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptylogin } = loginwithUserIdSlice.actions;

export default loginwithUserIdSlice.reducer;
