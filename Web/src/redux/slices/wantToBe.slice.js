import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllWantToBeAsync } from "../async.api";
import { getWantToBeByIdAsync } from "../async.api";
const initialState = {
    getAllWantToBeLoader:false,
    AllWantToBe:[],

    //wan to be by id
    getWantToBeByIdLoader:false,
    WantToBeById:[],
};

export const wantToBeSlice = createSlice({
  name: "wantToBe",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllWantToBeAsync.pending), (state) => {
      state.getAllWantToBeLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllWantToBeAsync.fulfilled),
      (state, action) => {
        state.getAllWantToBeLoader = false;
        state.AllWantToBe = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllWantToBeAsync.rejected),
      (state, action) => {
        state.getAllWantToBeLoader = false;
      }
    );
    builder.addMatcher(isAnyOf(getWantToBeByIdAsync.pending), (state) => {
        state.getWantToBeByIdLoader = true;
      });
      builder.addMatcher(
        isAnyOf(getWantToBeByIdAsync.fulfilled),
        (state, action) => {
          state.getWantToBeByIdLoader = false;
          state.WantToBeById = action.payload.data;
        }
      );
      builder.addMatcher(
        isAnyOf(getWantToBeByIdAsync.rejected),
        (state, action) => {
          state.getWantToBeByIdLoader = false;
        }
      );
  },
});

export default wantToBeSlice.reducer;
