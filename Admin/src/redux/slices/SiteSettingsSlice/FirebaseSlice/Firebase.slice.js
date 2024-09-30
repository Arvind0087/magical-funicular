import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllFirebaseSettingsAsync,
  updateFirebaseByIdAsync
} from "./FirebaseAsync.api";

const initialState = {
  firebaseSettingsLoader: false,
  firebaseSettings: [],
  updateFirebaseSettings: []
};

export const FirebaseSettingsSlice = createSlice({
  name: "PaymentSettings",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllFirebaseSettingsAsync.pending,
        updateFirebaseByIdAsync.pending
      ),
      (state) => {
        state.firebaseSettingsLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllFirebaseSettingsAsync.fulfilled),
      (state, action) => {
        state.firebaseSettingsLoader = false;
        state.firebaseSettings = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(updateFirebaseByIdAsync.fulfilled),
      (state, action) => {
        state.firebaseSettingsLoader = false;
        state.updateFirebaseSettings = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAllFirebaseSettingsAsync.rejected,
        updateFirebaseByIdAsync.rejected
      ),
      (state, action) => {
        state.firebaseSettingsLoader = false;
      }
    );
  },
  reducers: {
    emptyfirebaseSettings: (state) => {
      state.updateFirebaseSettings = [];
    }
  }
});
export const { emptyfirebaseSettings } = FirebaseSettingsSlice.actions;
export default FirebaseSettingsSlice.reducer;
