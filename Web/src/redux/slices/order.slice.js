import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getStudentAllOrderBytIdAsync } from "../async.api";
const initialState = {
    getStudentAllOrderBytIdLoader: false,
    getStudentAllOrderBytIdData: [],
};

export const OrderDetailSlice = createSlice({
  name: "orderDetail",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getStudentAllOrderBytIdAsync.pending), (state) => {
      state.getStudentAllOrderBytIdLoader = true;
      state.getStudentAllOrderBytIdData = [];
    });
    builder.addMatcher(
      isAnyOf(getStudentAllOrderBytIdAsync.fulfilled),
      (state, action) => {
        state.getStudentAllOrderBytIdLoader = false;
        state.getStudentAllOrderBytIdData = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(getStudentAllOrderBytIdAsync.rejected),
      (state, action) => {
        state.getStudentAllOrderBytIdLoader = false;
        state.getStudentAllOrderBytIdData = [];
      }
    );
  },
});

export default OrderDetailSlice.reducer;
