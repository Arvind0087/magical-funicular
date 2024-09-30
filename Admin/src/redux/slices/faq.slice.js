import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllFaqAsync,
  createFaqAsync,
  updateFaqByIdAsync,
  getFaqByIdAsync,
} from "../async.api";

const initialState = {
  faqLoader: false,
  faq: [],
  faqId: [],
  faqadd: [],
  faqupdate: [],
};

export const faqSlice = createSlice({
  name: "faq",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllFaqAsync.pending,
        createFaqAsync.pending,
        updateFaqByIdAsync.pending,
        getFaqByIdAsync.pending,
      ),
      (state) => {
        state.faqLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getAllFaqAsync.fulfilled), (state, action) => {
      state.faqLoader = false;
      state.faq = action.payload;
    });
    builder.addMatcher(isAnyOf(createFaqAsync.fulfilled), (state, action) => {
      state.faqLoader = false;
      state.faqadd = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getFaqByIdAsync.fulfilled),
      (state, action) => {
        state.faqLoader = false;
        state.faqId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateFaqByIdAsync.fulfilled),
      (state, action) => {
        state.faqLoader = false;
        state.faqupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllFaqAsync.rejected,
        createFaqAsync.rejected,
        updateFaqByIdAsync.rejected,
        getFaqByIdAsync.rejected,
      ),
      (state, action) => {
        state.faqLoader = false;
      }
    );
  },
  reducers: {
    emptyfaq: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyfaq } = faqSlice.actions;
export default faqSlice.reducer;
