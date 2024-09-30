import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllScholorshipsAsync,
  getScholorshipsByIdAsync,
  addScholorshipsAsync,
  updateScholorshipsByIdAsync,
  deleteScholorshipsByIdAsync,
} from "../async.api";

const initialState = {
  scholorshipsLoader: false,
  scholorships: [],
  scholorshipsadd: [],
  scholorshipsbyid: [],
  scholorshipsupdateId: [],
  scholorshipsdelete: [],
};

export const scholorshipsSlice = createSlice({
  name: "scholorships",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllScholorshipsAsync.pending,
        getScholorshipsByIdAsync.pending,
        addScholorshipsAsync.pending,
        updateScholorshipsByIdAsync.pending,
        deleteScholorshipsByIdAsync.pending
      ),
      (state) => {
        state.scholorshipsLoader = true;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllScholorshipsAsync.fulfilled),
      (state, action) => {
        state.scholorshipsLoader = false;
        state.scholorships = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getScholorshipsByIdAsync.fulfilled),
      (state, action) => {
        state.scholorshipsLoader = false;
        state.scholorshipsbyid = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(addScholorshipsAsync.fulfilled),
      (state, action) => {
        state.scholorshipsLoader = false;
        state.scholorshipsadd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateScholorshipsByIdAsync.fulfilled),
      (state, action) => {
        state.scholorshipsLoader = false;
        state.scholorshipsupdateId = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteScholorshipsByIdAsync.fulfilled),
      (state, action) => {
        state.scholorshipsLoader = false;
        state.scholorshipsdelete = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAllScholorshipsAsync.rejected,
        getScholorshipsByIdAsync.rejected,
        addScholorshipsAsync.rejected,
        updateScholorshipsByIdAsync.rejected,
        deleteScholorshipsByIdAsync.rejected
      ),
      (state, action) => {
        state.scholorshipsLoader = false;
      }
    );
  },
  reducers: {
    emptyscholorships: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyscholorships } = scholorshipsSlice.actions;

export default scholorshipsSlice.reducer;
