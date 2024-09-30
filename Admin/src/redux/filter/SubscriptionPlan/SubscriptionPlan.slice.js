import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getSubscriptionPlanFilterAsync } from "./SubscriptionPlan.async";

const initialState = {
  subscriptionFilterLoader: false,
  subscriptionFilter: [],
};

export const SubcriptionPlanFilterSlice = createSlice({
  name: "SubscriptionPlanFilter",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getSubscriptionPlanFilterAsync.pending), (state) => {
      state.subscriptionFilterLoader = true;
    });
    builder.addMatcher(isAnyOf(getSubscriptionPlanFilterAsync.fulfilled), (state, action) => {
      state.subscriptionFilterLoader = false;
      state.subscriptionFilter = action.payload.data;
    });
    builder.addMatcher(isAnyOf(getSubscriptionPlanFilterAsync.rejected), (state, action) => {
      state.subscriptionFilterLoader = false;
    });
  },
  reducers: {
    emptysubscriptionFilter: () => initialState,
  },
});

// export const { emptysubscriptionFilter } = SubcriptionPlanFilterSlice.actions;

export default SubcriptionPlanFilterSlice.reducer;
