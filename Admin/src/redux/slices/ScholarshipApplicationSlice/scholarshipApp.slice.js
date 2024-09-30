import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
    getAllScholarshipAppAsync,

} from "./scholarshipApp.async.api";

const initialState = {
    scholarshipAppLoader: false,
    scholarshipApp: [],
 
};

export const scholarshipAppSlice = createSlice({
  name: "scholarshipApp",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllScholarshipAppAsync.pending,
       
      ),
      (state) => {
        state.scholarshipAppLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllScholarshipAppAsync.fulfilled),
      (state, action) => {
        state.scholarshipAppLoader = false;
        state.scholarshipApp = action.payload;
      }
    );
   
   
  
    builder.addMatcher(
      isAnyOf(
        getAllScholarshipAppAsync.rejected,
      
      ),
      (state, action) => {
        state.feedbackLoader = false;
      }
    );
  },
  reducers: {
    emptyscholarshipApp: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyscholarshipApp } = scholarshipAppSlice.actions;
export default scholarshipAppSlice.reducer;
