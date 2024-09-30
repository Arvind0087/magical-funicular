import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createBoardAsync,
  getBoardByIdAsync,
  getBoardsByCourseIdAsync,
  getboardAsync,
  updatBoardByIdAsync,
  getClassBatchSubjectByBoardIdAsync,
  getBoardStatus
} from "./board.async";

const initialState = {
  boardLoader: false,
  boards: [],
  boardadd: [],
  boardId: [],
  updateId: [],
  boardByCourse: [],
  getClassBatchSubjectByBoardId: [],
  boardStatus: [],
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
        getBoardsByCourseIdAsync.pending,
        getClassBatchSubjectByBoardIdAsync.pending,
        getBoardStatus.pending,
      ),
      (state) => {
        state.boardLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getboardAsync.fulfilled), (state, action) => {
      state.boardLoader = false;
      state.boards = action.payload;
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
      isAnyOf(getClassBatchSubjectByBoardIdAsync.fulfilled),
      (state, action) => {
        state.boardLoader = false;
        state.getClassBatchSubjectByBoardId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getBoardStatus.fulfilled),
      (state, action) => {
        state.boardLoader = false;
        state.boardStatus = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getboardAsync.rejected,
        createBoardAsync.rejected,
        getBoardByIdAsync.rejected,
        updatBoardByIdAsync.rejected,
        getBoardsByCourseIdAsync.rejected,
        getClassBatchSubjectByBoardIdAsync.rejected,
        getBoardStatus.rejected,
      ),
      (state, action) => {
        state.boardLoader = false;
      }
    );
  },
  reducers: {
    emptyboard: (state) => initialState,
  },
});

export const { emptyboard } = boardsSlice.actions;

export default boardsSlice.reducer;
