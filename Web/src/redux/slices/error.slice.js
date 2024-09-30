import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  error: "",
};

export const errorSlice = createSlice({
  name: "Error",
  initialState,
  reducers: {
    errorMessage: (state, action) => {
      state.error = action.payload;
    },
    emptyErrorMessage: (state, action) => {
      state.error = "";
    },
  },
});

export const { errorMessage, emptyErrorMessage } = errorSlice.actions;

export default errorSlice.reducer;
