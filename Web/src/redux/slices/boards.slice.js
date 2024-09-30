import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createBoardAsync,
  getBoardByIdAsync,
  getBoardsByCourseIdAsync,
  getboardAsync,
  updatBoardByIdAsync,
} from "../async.api";

const initialState = {
  boardLoader: false,
  boards: [],
  boardadd: [],
  boardId: [],
  updateId: [],
  boardByCourse: [],
};

export const boardsSlice = createSlice({
  name: "boards",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getboardAsync.pending,
        createBoardAsync.pending,
        getBoardByIdAsync.pending,
        updatBoardByIdAsync.pending,
        getBoardsByCourseIdAsync.pending
      ),
      (state) => {
        state.boardLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getboardAsync.fulfilled), (state, action) => {
      state.boardLoader = false;
      state.boards = action.payload.data;
    });
    builder.addMatcher(isAnyOf(createBoardAsync.fulfilled), (state, action) => {
      state.boardLoader = false;
      state.boardadd = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getBoardByIdAsync.fulfilled),
      (state, action) => {
        state.boardLoader = false;
        state.boardId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updatBoardByIdAsync.fulfilled),
      (state, action) => {
        state.boardLoader = false;
        state.updateId = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getBoardsByCourseIdAsync.fulfilled),
      (state, action) => {
        state.boardLoader = false;
        state.boardByCourse = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getboardAsync.rejected,
        createBoardAsync.rejected,
        getBoardByIdAsync.rejected,
        updatBoardByIdAsync.rejected,
        getBoardsByCourseIdAsync.rejected
      ),
      (state, action) => {
        state.boardLoader = false;
      }
    );
  },
  reducers: {
    emptyboard: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyboard } = boardsSlice.actions;

export default boardsSlice.reducer;
