import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllWhyYouNeedAsync,
  getWhyYouNeedByIdAsync,
  updateWhyYouNeedByIdAsync,
  createWhyYouNeedAsync,
  deleteWhyYouNeedAsync,
} from "./youNeed.async";

const initialState = {
  youNeedLoader: false,
  youneed: [],
  youneedadd: [],
  youneedId: [],
  youneedupdateId: [],
  youneeddelete: [],
};

export const youneedSlice = createSlice({
  name: "youneed",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllWhyYouNeedAsync.pending,
        getWhyYouNeedByIdAsync.pending,
        updateWhyYouNeedByIdAsync.pending,
        createWhyYouNeedAsync.pending,
        createWhyYouNeedAsync.pending
      ),
      (state) => {
        state.youNeedLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllWhyYouNeedAsync.fulfilled),
      (state, action) => {
        state.youNeedLoader = false;
        state.youneed = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(createWhyYouNeedAsync.fulfilled),
      (state, action) => {
        state.youNeedLoader = false;
        state.youneedadd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getWhyYouNeedByIdAsync.fulfilled),
      (state, action) => {
        state.youNeedLoader = false;
        state.youneedId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateWhyYouNeedByIdAsync.fulfilled),
      (state, action) => {
        state.youNeedLoader = false;
        state.youneedupdateId = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteWhyYouNeedAsync.fulfilled),
      (state, action) => {
        state.youNeedLoader = false;
        state.youneeddelete = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAllWhyYouNeedAsync.rejected,
        getWhyYouNeedByIdAsync.rejected,
        updateWhyYouNeedByIdAsync.rejected,
        createWhyYouNeedAsync.rejected,
        deleteWhyYouNeedAsync.rejected
      ),
      (state, action) => {
        state.youNeedLoader = false;
      }
    );
  },
  reducers: {
    emptyYouneed: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyYouneed } = youneedSlice.actions;
export default youneedSlice.reducer;
