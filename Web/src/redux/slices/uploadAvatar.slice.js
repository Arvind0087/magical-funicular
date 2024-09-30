import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { uploadAvatarAsync } from "../async.api";
const initialState = {
    uploadAvatarLoader: false,
    uploadAvatarbyUser: [],
};

export const UploadAvatarSlice = createSlice({
  name: "uploadAvatar",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(uploadAvatarAsync.pending), (state) => {
      state.uploadAvatarLoader = true;
    });
    builder.addMatcher(
      isAnyOf(uploadAvatarAsync.fulfilled),
      (state, action) => {
        state.uploadAvatarLoader = false;
        state.uploadAvatarbyUser = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(uploadAvatarAsync.rejected),
      (state, action) => {
        state.uploadAvatarLoader = false;
        state.uploadAvatarbyUser= action.payload;
      }
    );
  },
});

export default UploadAvatarSlice.reducer;
