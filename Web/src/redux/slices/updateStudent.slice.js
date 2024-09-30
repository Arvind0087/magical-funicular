import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { updateStudentByIdAsync} from "../async.api";
const initialState = {
    updateStudentByIdLoader: false,
    updateStudentById: [],
};

export const updateStudentSlice = createSlice({
  name: "updateStudent",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(updateStudentByIdAsync.pending), (state) => {
      state.updateStudentByIdLoader = true;
    });
    builder.addMatcher(
      isAnyOf(updateStudentByIdAsync.fulfilled),
      (state, action) => {
        state.updateStudentByIdLoader = false;
        state.updateStudentById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateStudentByIdAsync.rejected),
      (state, action) => {
        state.updateStudentByIdLoader = false;
        state.uploadAvatarbyUser= action.payload;
      }
    );
  },
});

export default updateStudentSlice.reducer;
