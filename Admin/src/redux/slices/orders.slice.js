import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllordersAsync } from "../async.api";

const initialState = {
  orderLoader: false,
  orders: [],
};

export const orderSlice = createSlice({
  name: "orders",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllordersAsync.pending), (state) => {
      state.orderLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllordersAsync.fulfilled),
      (state, action) => {
        state.orderLoader = false;
        state.orders = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(getAllordersAsync.rejected), (state, action) => {
      state.orderLoader = false;
    });
  },
  reducers: {
    emptyorders: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyorders } = orderSlice.actions;

export default orderSlice.reducer;
