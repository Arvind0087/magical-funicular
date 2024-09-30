import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getloginAsync } from "../async.api";

const initialState = {
  loginLoader: false,
  // loginError: "",
  login: [],
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getloginAsync.pending), (state) => {
      state.loginLoader = true;
    });
    builder.addMatcher(isAnyOf(getloginAsync.fulfilled), (state, action) => {
      state.loginLoader = false;
      state.login = action.payload;
    });
    builder.addMatcher(isAnyOf(getloginAsync.rejected), (state, action) => {
      state.loginLoader = false;
      // state.loginError = action.payload;
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

export const { emptylogin } = loginSlice.actions;

export default loginSlice.reducer;
