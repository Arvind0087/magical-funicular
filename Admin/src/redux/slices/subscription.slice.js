import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllSubscriptionsAsync,
  createSubscriptionsAsync,
  getSubscriptionsByIdAsync,
  updateSubscriptionByIdAsync,
} from "../async.api";

const initialState = {
  subscriptionLoader: false,
  subscription: [],
  subscriptionadd: [],
  subscriptionId: [],
  subscriptionupdateId: [],
};

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllSubscriptionsAsync.pending,
        createSubscriptionsAsync.pending,
        getSubscriptionsByIdAsync.pending,
        updateSubscriptionByIdAsync.pending
      ),
      (state) => {
        state.subscriptionLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllSubscriptionsAsync.fulfilled),
      (state, action) => {
        state.subscriptionLoader = false;
        state.subscription = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(createSubscriptionsAsync.fulfilled),
      (state, action) => {
        state.subscriptionLoader = false;
        state.subscriptionadd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getSubscriptionsByIdAsync.fulfilled),
      (state, action) => {
        state.subscriptionLoader = false;
        state.subscriptionId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateSubscriptionByIdAsync.fulfilled),
      (state, action) => {
        state.subscriptionLoader = false;
        state.subscriptionupdateId = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllSubscriptionsAsync.rejected,
        createSubscriptionsAsync.rejected,
        getSubscriptionsByIdAsync.rejected,
        updateSubscriptionByIdAsync.rejected
      ),
      (state, action) => {
        state.subscriptionLoader = false;
      }
    );
  },

  reducers: {
    emptysubscriptions: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptysubscriptions } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

// reducers: {
//   emptypackage: (state) => {
//     return {
//       ...initialState
//     };
//   }
// }
// });

// export const { emptypackage } = masterSlice.actions;

// export default masterSlice.reducer;
