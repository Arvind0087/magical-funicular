import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllQuizAsync,
  getquizByIdAsync,
} from "./quiz.async.api";

const initialState = {
  quizLoader: false,
  quiz: [],
  getQuizById: [],
};

export const quizReportSlice = createSlice({
  name: "quiz",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllQuizAsync.pending,
        getquizByIdAsync.pending
      ),
      (state) => {
        state.quizLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getAllQuizAsync.fulfilled), (state, action) => {
      state.quizLoader = false;
      state.quiz = action.payload;
    });

    builder.addMatcher(isAnyOf(getquizByIdAsync.fulfilled), (state, action) => {
      state.quizLoader = false;
      state.getQuizById = action.payload;
    });
    builder.addMatcher(
      isAnyOf(
        getAllQuizAsync.rejected,
      ),
      (state, action) => {
        state.quizLoader = false;
      }
    );
  },
  reducers: {
    emptyquiz: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyquiz } = quizReportSlice.actions;
export default quizReportSlice.reducer;
