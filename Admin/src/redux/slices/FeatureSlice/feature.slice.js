import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllFeatureAsync,
  createFeatureAsync,
  getFeatureByIdAsync,
  updateFeatureByIdAsync,
  deletefeaturesAsync,
} from "./feature.async";

const initialState = {
  featureLoader: false,
  feature: [],
  featureadd: [],
  featurgetById: [],
  featureupdate: [],
  featuredelete: [],
};

export const featureSlice = createSlice({
  name: "feature",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllFeatureAsync.pending,
        createFeatureAsync.pending,
        getFeatureByIdAsync.pending,
        updateFeatureByIdAsync.pending,
        deletefeaturesAsync.pending
      ),
      (state) => {
        state.featureLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllFeatureAsync.fulfilled),
      (state, action) => {
        state.featureLoader = false;
        state.feature = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateFeatureByIdAsync.fulfilled),
      (state, action) => {
        state.featureLoader = false;
        state.featureupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(createFeatureAsync.fulfilled),
      (state, action) => {
        state.featureLoader = false;
        state.featureadd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getFeatureByIdAsync.fulfilled),
      (state, action) => {
        state.featureLoader = false;
        state.featurgetById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(deletefeaturesAsync.fulfilled),
      (state, action) => {
        state.featureLoader = false;
        state.featuredelete = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAllFeatureAsync.rejected,
        createFeatureAsync.rejected,
        getFeatureByIdAsync.rejected,
        updateFeatureByIdAsync.rejected,
        deletefeaturesAsync.rejected
      ),
      (state, action) => {
        state.featureLoader = false;
      }
    );
  },
  reducers: {
    emptyfeature: (state) => initialState,
  },
});

export const { emptyfeature } = featureSlice.actions;

export default featureSlice.reducer;
