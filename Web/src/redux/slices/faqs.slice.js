import { createSlice,isAnyOf } from "@reduxjs/toolkit";
import { getAllFaqsAsync,getFaqByIdAsync  } from "../async.api";

const initialState={
    faqLoader:false,
    faqs:[],
    faqsById: []
};

export const faqsSlice = createSlice({
  name: "faqs",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(getAllFaqsAsync.pending, getFaqByIdAsync.pending),
      (state) => {
        state.faqLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getAllFaqsAsync.fulfilled), (state, action) => {
      state.faqLoader = false;
      state.faqs = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getFaqByIdAsync.fulfilled),
      (state, action) => {
        state.faqLoader = false;
        state.faqsById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllFaqsAsync.rejected, getFaqByIdAsync.rejected),
      (state, action) => {
        state.faqLoader = false;
      }
    );
  },
});

export default faqsSlice.reducer;
