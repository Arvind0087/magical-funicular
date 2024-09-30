import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createWantToBeAsync,
  deleteWantToBeByIdAsync,
  getAllWantToBeAsync,
  getWantToBeByIdAsync,
  updateWantToBeByIdAsync,
} from "./wantotbe.async";

const initialState = {
  wantLoader: false,
  wants: [],
  wantById: [],
  wantadd: [],
  wantupdate: [],
  wantdelete: [],
};

export const wantSlice = createSlice({
  name: "wants",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllWantToBeAsync.pending,
        getWantToBeByIdAsync.pending,
        createWantToBeAsync.pending,
        updateWantToBeByIdAsync.pending,
        deleteWantToBeByIdAsync.pending
      ),
      (state) => {
        state.wantLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllWantToBeAsync.fulfilled),
      (state, action) => {
        state.wantLoader = false;
        state.wants = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getWantToBeByIdAsync.fulfilled),
      (state, action) => {
        state.wantLoader = false;
        state.wantById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(createWantToBeAsync.fulfilled),
      (state, action) => {
        state.wantLoader = false;
        state.wantadd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateWantToBeByIdAsync.fulfilled),
      (state, action) => {
        state.wantLoader = false;
        state.wantupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteWantToBeByIdAsync.fulfilled),
      (state, action) => {
        state.wantLoader = false;
        state.wantdelete = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllWantToBeAsync.rejected,
        getWantToBeByIdAsync.rejected,
        createWantToBeAsync.rejected,
        updateWantToBeByIdAsync.rejected,
        deleteWantToBeByIdAsync.rejected
      ),
      (state, action) => {
        state.wantLoader = false;
      }
    );
  },
  reducers: {
    emptywants: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptywants } = wantSlice.actions;
export default wantSlice.reducer;
