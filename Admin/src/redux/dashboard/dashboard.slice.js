import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getDashboardAsync,
  salesDashboardAsync,
  packageDashboardAsync,
  registrationDashboardAsync,
} from "./dashboard.async";

const initialState = {
  dashboardLoader: false,
  dashboard: [],
  sellLoader: false,
  sellData: [],
  packageLoader: false,
  packageData: [],
  registerLoader: false,
  registerData: [],
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(registrationDashboardAsync.pending), (state) => {
      state.registerLoader = true;
    });
    builder.addMatcher(
      isAnyOf(registrationDashboardAsync.fulfilled),
      (state, action) => {
        state.registerLoader = false;
        state.registerData = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(registrationDashboardAsync.rejected),
      (state, action) => {
        state.registerLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(packageDashboardAsync.pending), (state) => {
      state.packageLoader = true;
    });
    builder.addMatcher(
      isAnyOf(packageDashboardAsync.fulfilled),
      (state, action) => {
        state.packageLoader = false;
        state.packageData = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(packageDashboardAsync.rejected),
      (state, action) => {
        state.packageLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(salesDashboardAsync.pending), (state) => {
      state.sellLoader = true;
    });
    builder.addMatcher(
      isAnyOf(salesDashboardAsync.fulfilled),
      (state, action) => {
        state.sellLoader = false;
        state.sellData = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(salesDashboardAsync.rejected),
      (state, action) => {
        state.sellLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(getDashboardAsync.pending), (state) => {
      state.dashboardLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getDashboardAsync.fulfilled),
      (state, action) => {
        state.dashboardLoader = false;
        state.dashboard = action.payload.data;
      }
    );

    builder.addMatcher(isAnyOf(getDashboardAsync.rejected), (state, action) => {
      state.dashboardLoader = false;
    });
  },
  reducers: {
    emptydashboard: (state) => initialState,
  },
});

export const { emptydashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;
