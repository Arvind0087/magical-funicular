import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllHelpsAsync,
  createHelpsAsync,
  getHelpsByIdAsync,
  updateHelpsByIdAsync,
  deleteHelpAsync,
} from "./helps.async";

const initialState = {
  helpsLoader: false,
  helps: [],
  helpsadd: [],
  helpsId: [],
  helpsupdateId: [],
  helpsdelete: [],
};

export const helpsSlice = createSlice({
  name: "helps",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllHelpsAsync.pending,
        createHelpsAsync.pending,
        getHelpsByIdAsync.pending,
        updateHelpsByIdAsync.pending,
        deleteHelpAsync.pending
      ),
      (state) => {
        state.helpsLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getAllHelpsAsync.fulfilled), (state, action) => {
      state.helpsLoader = false;
      state.helps = action.payload;
    });
    builder.addMatcher(isAnyOf(createHelpsAsync.fulfilled), (state, action) => {
      state.helpsLoader = false;
      state.helpsadd = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getHelpsByIdAsync.fulfilled),
      (state, action) => {
        state.helpsLoader = false;
        state.helpsId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateHelpsByIdAsync.fulfilled),
      (state, action) => {
        state.helpsLoader = false;
        state.helpsupdateId = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(deleteHelpAsync.fulfilled), (state, action) => {
      state.helpsLoader = false;
      state.helpsdelete = action.payload;
    });

    builder.addMatcher(
      isAnyOf(
        getAllHelpsAsync.rejected,
        createHelpsAsync.rejected,
        getHelpsByIdAsync.rejected,
        updateHelpsByIdAsync.rejected,
        deleteHelpAsync.rejected
      ),
      (state, action) => {
        state.helpsLoader = false;
      }
    );
  },
  reducers: {
    emptyHelps: (state) => initialState,
  },
});
export const { emptyHelps } = helpsSlice.actions;
export default helpsSlice.reducer;
