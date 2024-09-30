import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getStateAsync,
  createStateAsync,
  getStateByIdAsync,
  updatStateByIdAsync,
  deleteStateByIdAsync,
} from "./states.async";

const initialState = {
  stateLoader: false,
  states: [],
  stateadd: [],
  stateById: [],
  updateStateById: [],
  deleteStateById: [],
};

export const stateSlice = createSlice({
  name: "state",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getStateAsync.pending,
        createStateAsync.pending,
        getStateByIdAsync.pending,
        updatStateByIdAsync.pending,
        deleteStateByIdAsync.pending
      ),
      (state) => {
        state.stateLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getStateAsync.fulfilled), (state, action) => {
      state.stateLoader = false;
      state.states = action.payload;
    });
    builder.addMatcher(isAnyOf(createStateAsync.fulfilled), (state, action) => {
      state.stateLoader = false;
      state.stateadd = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getStateByIdAsync.fulfilled),
      (state, action) => {
        state.stateLoader = false;
        state.stateById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updatStateByIdAsync.fulfilled),
      (state, action) => {
        state.stateLoader = false;
        state.updateStateById = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteStateByIdAsync.fulfilled),
      (state, action) => {
        state.stateLoader = false;
        state.deleteStateById = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getStateAsync.rejected,
        createStateAsync.rejected,
        getStateByIdAsync.rejected,
        updatStateByIdAsync.rejected,
        deleteStateByIdAsync.rejected
      ),
      (state, action) => {
        state.stateLoader = false;
      }
    );
  },
  reducers: {
    emptystate: (state) => initialState,
    emptyById: (state) => {
      state.stateById = [];
    },
  },
});

export const { emptystate,emptyById } = stateSlice.actions;

export default stateSlice.reducer;
