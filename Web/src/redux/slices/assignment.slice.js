import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllAssignmentBannerAsync,getAssignmentsByStudentIdAsync} from "../async.api";

const initialState = {
  // for all banner in shorts..................
  // AssignmentBannerByTypeLoader: false,
  // AssignmentBannerByType: [],
  AssignmentStatusLoader: false,
  AssignmentStatus: [],
  assignemntError:{}

};

export const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  extraReducers: (builder) => {
    // for getting assignment
    builder.addMatcher(
      isAnyOf(getAssignmentsByStudentIdAsync.pending),(state) => {
        state.AssignmentStatusLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getAssignmentsByStudentIdAsync.fulfilled), (state, action) => {
      state.AssignmentStatusLoader = false;
      state.AssignmentStatus = action.payload;
    });
    builder.addMatcher(isAnyOf(getAssignmentsByStudentIdAsync.rejected), (state, action) => {
      state.AssignmentStatusLoader = false;
      state.AssignmentStatus = action.payload;
    });

  },
});

export default assignmentSlice.reducer;
