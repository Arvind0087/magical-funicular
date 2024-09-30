import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllEnquiryAsync } from "./enquery.async";

const initialState = {
  enquiryLoader: false,
  Enquiry: [],
};

export const enquirySlice = createSlice({
  name: "enquiry",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllEnquiryAsync.pending), (state) => {
      state.enquiryLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllEnquiryAsync.fulfilled),
      (state, action) => {
        state.enquiryLoader = false;
        state.Enquiry = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllEnquiryAsync.rejected),
      (state, action) => {
        state.feedbackLoader = false;
      }
    );
  },
  reducers: {
    emptyenquiry: (state) => initialState,
  },
});
export const { emptyenquiry } = enquirySlice.actions;
export default enquirySlice.reducer;
