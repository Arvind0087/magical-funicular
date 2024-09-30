import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getPackageFilterAsync } from "./packageMaster.async";

const initialState = {
  packageFilterLoader: false,
  packageFilter: [],
};

export const PackageFilterSlice = createSlice({
  name: "PackageFilter",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getPackageFilterAsync.pending), (state) => {
      state.packageFilterLoader = true;
    });
    builder.addMatcher(isAnyOf(getPackageFilterAsync.fulfilled), (state, action) => {
      state.packageFilterLoader = false;
      state.packageFilter = action.payload.data;
    });
    builder.addMatcher(isAnyOf(getPackageFilterAsync.rejected), (state, action) => {
      state.packageFilterLoader = false;
    });
  },
  reducers: {
    emptyStudent: () => initialState,
  },
});

// export const { emptypackageFilter } = PackageFilterSlice.actions;

export default PackageFilterSlice.reducer;
