import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllShortsAsync,
  addShortsAsync,
  getShortsByIdAsync,
  updateShortsAsync,
  deleteShortAsync,
} from "../async.api";

const initialState = {
  shortsLoader: false,
  shorts: [],
  shortsadd: [],
  shortsbyid: [],
  shortsupdate: [],
  shortsdelete: [],
};

export const shortsSlice = createSlice({
  name: "shorts",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllShortsAsync.pending,
        addShortsAsync.pending,
        getShortsByIdAsync.pending,
        updateShortsAsync.pending,
        deleteShortAsync.pending,
      ),
      (state) => {
        state.shortsLoader = true;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllShortsAsync.fulfilled),
      (state, action) => {
        state.shortsLoader = false;
        state.shorts = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(addShortsAsync.fulfilled), (state, action) => {
      state.shortsLoader = false;
      state.shortsadd = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getShortsByIdAsync.fulfilled),
      (state, action) => {
        state.shortsLoader = false;
        state.shortsbyid = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateShortsAsync.fulfilled),
      (state, action) => {
        state.shortsLoader = false;
        state.shortsupdate = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(deleteShortAsync.fulfilled), (state, action) => {
      state.shortsLoader = false;
      state.shortsdelete = action.payload;
    });

    builder.addMatcher(
      isAnyOf(
        getAllShortsAsync.rejected,
        addShortsAsync.rejected,
        getShortsByIdAsync.rejected,
        deleteShortAsync.rejected,
        updateShortsAsync.rejected,
      ),
      (state, action) => {
        state.shortsLoader = false;
      }
    );
  },
  reducers: {
    emptyshorts: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyshorts } = shortsSlice.actions;

export default shortsSlice.reducer;
