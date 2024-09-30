import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllRoutesAsync } from "./routes.async";

const initialState = {
  routeLoader: false,
  allRoutes: [],
};

export const routeSlice = createSlice({
  name: "route",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllRoutesAsync.pending), (state) => {
      state.routeLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllRoutesAsync.fulfilled),
      (state, action) => {
        state.routeLoader = false;
        state.allRoutes = action.payload.data;
      }
    );
    builder.addMatcher(isAnyOf(getAllRoutesAsync.rejected), (state, action) => {
      state.routeLoader = false;
    });
  },
  reducers: {
    emptyroute: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyroute } = routeSlice.actions;

export default routeSlice.reducer;
