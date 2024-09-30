import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { uploadStaffBulkAsync,getStaffBulkFiles } from "./StaffBulk.async.api";

const initialState = {
  staffBulkLoader: false,
  staffBulkUpload: [],
  staffBulkFiles: [],
};

export const staffBulkSlice = createSlice({
  name: "staffBulk",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(uploadStaffBulkAsync.pending,getStaffBulkFiles.pending), (state) => {
      state.staffBulkLoader = true;
    });

    builder.addMatcher(
      isAnyOf(uploadStaffBulkAsync.fulfilled),
      (state, action) => {
        state.staffBulkLoader = false;
        state.staffBulkUpload = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getStaffBulkFiles.fulfilled),
      (state, action) => {
        state.staffBulkLoader = false;
        state.staffBulkFiles = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(uploadStaffBulkAsync.rejected),
      (state, action) => {
        state.staffBulkLoader = false;
      }
    );
  },
  reducers: {
    emptystaffBulk: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptystaffBulk } = staffBulkSlice.actions;
export default staffBulkSlice.reducer;
