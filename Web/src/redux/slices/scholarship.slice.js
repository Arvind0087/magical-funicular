import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getScholarshipClassByUserIdAsync, applyScholarshipAsync} from "../async.api";
import { getAllHighlightAsync } from "../async.api";
const initialState = {
    //get scholarship class by use id
    ScholarshipClassByUserIdLoader: false,
    ScholarshipClassByUserId: [],

    //getAllHighlight
    getAllHighlightLoader: false,
    AllHighlight: [],

    //applyforscholarship
    applyforscholarshipLoader: false,
    applyforscholarship: [],
};

export const scholarshipTestSlice = createSlice({
  name: "scholarshipTest",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getScholarshipClassByUserIdAsync.pending), (state) => {
      state.ScholarshipClassByUserIdLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getScholarshipClassByUserIdAsync.fulfilled),
      (state, action) => {
        state.ScholarshipClassByUserIdLoader = false;
        state.ScholarshipClassByUserId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getScholarshipClassByUserIdAsync.rejected),
      (state, action) => {
        state.ScholarshipClassByUserIdLoader = false;
      }
    );
    builder.addMatcher(isAnyOf(getAllHighlightAsync.pending), (state) => {
      state.getAllHighlightLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllHighlightAsync.fulfilled),
      (state, action) => {
        state.getAllHighlightLoader = false;
        state.AllHighlight = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllHighlightAsync.rejected),
      (state, action) => {
        state.getAllHighlightLoader = false;
      }
    );
    builder.addMatcher(isAnyOf(applyScholarshipAsync.pending), (state) => {
      state.applyforscholarshipLoader = true;
      state.applyforscholarship=[];
    });
    builder.addMatcher(
      isAnyOf(applyScholarshipAsync.fulfilled),
      (state, action) => {
        state.applyforscholarshipLoader = false;
        state.applyforscholarship = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(applyScholarshipAsync.rejected),
      (state, action) => {
        state.applyforscholarshipLoader = false;
        state.applyforscholarship=[];
      }
    );
  },
});

export default scholarshipTestSlice.reducer;
