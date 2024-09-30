import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllOnlyForYouAsync,
  getOnlyForYouByIdAsync,
  updateOnlyForYouByIdAsync,
  createOnlyForYouAsync,
  deleteOnlyByIdAsync,
  updateOnlyForYouStatusAsync
} from "../async.api";

const initialState = {
  onlyLoader: false,
  only: [],
  onlyadd: [],
  onlyId: [],
  onlyupdateId: [],
  onlydelete: [],
  updateOnlyForYouStatus: [],
};

export const onlySlice = createSlice({
  name: "only",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllOnlyForYouAsync.pending,
        getOnlyForYouByIdAsync.pending,
        updateOnlyForYouByIdAsync.pending,
        createOnlyForYouAsync.pending,
        deleteOnlyByIdAsync.pending,
        updateOnlyForYouStatusAsync.pending,
      ),
      (state) => {
        state.onlyLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllOnlyForYouAsync.fulfilled),
      (state, action) => {
        state.onlyLoader = false;
        state.only = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(createOnlyForYouAsync.fulfilled),
      (state, action) => {
        state.onlyLoader = false;
        state.onlyadd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getOnlyForYouByIdAsync.fulfilled),
      (state, action) => {
        state.onlyLoader = false;
        state.onlyId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateOnlyForYouByIdAsync.fulfilled),
      (state, action) => {
        state.onlyLoader = false;
        state.onlyupdateId = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteOnlyByIdAsync.fulfilled),
      (state, action) => {
        state.onlyLoader = false;
        state.onlydelete = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateOnlyForYouStatusAsync.fulfilled),
      (state, action) => {
        state.onlyLoader = false;
        state.updateOnlyForYouStatus = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllOnlyForYouAsync.rejected,
        getOnlyForYouByIdAsync.rejected,
        updateOnlyForYouByIdAsync.rejected,
        createOnlyForYouAsync.rejected,
        deleteOnlyByIdAsync.rejected,
        updateOnlyForYouStatusAsync.rejected,
      ),
      (state, action) => {
        state.onlyLoader = false;
      }
    );
  },
  reducers: {
    emptyonly: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyonly } = onlySlice.actions;
export default onlySlice.reducer;
