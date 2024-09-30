import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { generateOtpAsync } from "../async.api";

const initialState = {
  generateOtpLoader: false,
  phone: [],
};

export const generateOtpSlice = createSlice({
  name: "generateOtp",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(generateOtpAsync.pending), (state) => {
      state.generateOtpLoader = true;
    });
    builder.addMatcher(isAnyOf(generateOtpAsync.fulfilled), (state, action) => {
      state.generateOtpLoader = false;
      state.phone = action.payload;
    });
    builder.addMatcher(isAnyOf(generateOtpAsync.rejected), (state, action) => {
      state.generateOtpLoader = false;
    });
  },
  reducers: {
    emptyotp: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyotp } = generateOtpSlice.actions;

export default generateOtpSlice.reducer;
