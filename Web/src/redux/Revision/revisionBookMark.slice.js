import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addRevisionBookmarkAsync,
  getAllRevisionBookmarkAsync,
} from "./revisionBookMark.async";
const initialState = {
  revisionBookmarkLoader: false,
  revisionBookmarkBy: {},
  //get all book marked
  getrevisionBookmarkLoader: false,
  getrevisionBookmarkBy: [],
};
export const revisionBookmarkSlice = createSlice({
  name: "RevisionBookmark",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(addRevisionBookmarkAsync.pending), (state) => {
      state.revisionBookmarkLoader = true;
    });
    builder.addMatcher(
      isAnyOf(addRevisionBookmarkAsync.fulfilled),
      (state, action) => {
        state.revisionBookmarkLoader = false;
        state.revisionBookmarkBy = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(addRevisionBookmarkAsync.rejected),
      (state, action) => {
        state.revisionBookmarkLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllRevisionBookmarkAsync.pending),
      (state) => {
        state.getrevisionBookmarkLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllRevisionBookmarkAsync.fulfilled),
      (state, action) => {
        state.getrevisionBookmarkLoader = false;
        state.getrevisionBookmarkBy = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllRevisionBookmarkAsync.rejected),
      (state, action) => {
        state.getrevisionBookmarkLoader = false;
      }
    );
  },
  reducers: {
    emptyrevisionBookmark: (state) => {
      state.revisionBookmarkBy = {};
    },
  },
});

export const { emptyrevisionBookmark } = revisionBookmarkSlice.actions;

export default revisionBookmarkSlice.reducer;
