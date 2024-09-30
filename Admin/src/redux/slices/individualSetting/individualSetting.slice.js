import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import {
  createIndividualSettingAsync,
  getIndividualSettingByIdAsync,
  updateIndividualSettingAsync
} from "./individualSetting.async";

const initialState = {
  individualSettingLoader: false,
  createIndividualSetting: [],
  getIndividualSetting: [],
  updateIndividualSetting: [],
  
};

export const individualSettingSlice = createSlice({
  name: "Scholorship",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        createIndividualSettingAsync.pending,
        getIndividualSettingByIdAsync.pending,
        updateIndividualSettingAsync.pending,
      ),
      (state) => {
        state.individualSettingLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(createIndividualSettingAsync.fulfilled),
      (state, action) => {
        state.individualSettingLoader = false;
        state.createIndividualSetting = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getIndividualSettingByIdAsync.fulfilled),
      (state, action) => {
        state.individualSettingLoader = false;
        state.getIndividualSetting = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(updateIndividualSettingAsync.fulfilled),
      (state, action) => {
        state.individualSettingLoader = false;
        state.updateIndividualSetting = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(
        createIndividualSettingAsync.rejected,
        getIndividualSettingByIdAsync.rejected,
        updateIndividualSettingAsync.rejected,
      ),
      (state, action) => {
        state.individualSettingLoader = false;
      }
    );
  },

  reducers: {
    emptyIndividualSetting: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyIndividualSetting } = individualSettingSlice.actions;

export default individualSettingSlice.reducer;
