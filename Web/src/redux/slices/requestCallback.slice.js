import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { createRequestCallAsync } from "../async.api";

const initialState = {
    createRequestLoader:false,
    createRequest:[],
};

export const RequestCallbackSlice = createSlice({
  name: "bookmarked",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(createRequestCallAsync.pending), (state) => {
      state.createRequestLoader = true;
    });
    builder.addMatcher(
      isAnyOf(createRequestCallAsync.fulfilled),
      (state, action) => {
        state.createRequestLoader = false;
        state.createRequest = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(createRequestCallAsync.rejected),
      (state, action) => {
        state.createRequestLoader = false;
      }
    );
  },
  reducers: {
    emptyRequestCallback: (state) => {
        return {
            ...initialState,
        };
    },
  },
});



export const { emptyRequestCallback} = RequestCallbackSlice.actions;


export default RequestCallbackSlice.reducer;
