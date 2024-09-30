import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
    getAllFeedbackAsync,

} from "../async.api";

const initialState = {
  feedbackLoader: false,
  feedback: [],
 
};

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllFeedbackAsync.pending,
       
      ),
      (state) => {
        state.feedbackLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllFeedbackAsync.fulfilled),
      (state, action) => {
        state.feedbackLoader = false;
        state.feedback = action.payload;
      }
    );
   
   
  
    builder.addMatcher(
      isAnyOf(
        getAllFeedbackAsync.rejected,
      
      ),
      (state, action) => {
        state.feedbackLoader = false;
      }
    );
  },
  reducers: {
    emptyfeedback: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyfeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
