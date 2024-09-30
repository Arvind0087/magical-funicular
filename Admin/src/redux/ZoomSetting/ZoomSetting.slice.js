import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
    getAllCredentialAsync,
    createZoomCredentialAsync,
    getZoomCredentialByTeacherIdAsync,
    deleteCredentialByTeacherIdAsync,
    updateCredentialByIdAsync
} from "./ZoomSetting.async";

const initialState = {
  zoomSettingLoader: false,
  zoomSetting: [],
  zoomSettingadd: [],
  zoomSettingbyid: [],
  zoomSettingupdate:[],
  zoomSettingdelete: [],
};

export const zoomSettingSlice = createSlice({
  name: "zooSetting",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllCredentialAsync.pending,
        createZoomCredentialAsync.pending,
        getZoomCredentialByTeacherIdAsync.pending,
        deleteCredentialByTeacherIdAsync.pending,
        updateCredentialByIdAsync.pending
      ),
      (state) => {
        state.zoomSettingLoader = true;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllCredentialAsync.fulfilled),
      (state, action) => {
        state.zoomSettingLoader = false;
        state.zoomSetting = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(createZoomCredentialAsync.fulfilled), (state, action) => {
      state.zoomSettingLoader = false;
      state.zoomSettingadd = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getZoomCredentialByTeacherIdAsync.fulfilled),
      (state, action) => {
        state.zoomSettingLoader = false;
        state.zoomSettingbyid = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(updateCredentialByIdAsync.fulfilled),
      (state, action) => {
        state.zoomSettingLoader = false;
        state.zoomSettingupdate = action.payload;
      }
    );
   
    builder.addMatcher(isAnyOf(deleteCredentialByTeacherIdAsync.fulfilled), (state, action) => {
      state.zoomSettingLoader = false;
      state.zoomSettingdelete = action.payload;
    });

    builder.addMatcher(
      isAnyOf(
        getAllCredentialAsync.rejected,
        createZoomCredentialAsync.rejected,
        getZoomCredentialByTeacherIdAsync.rejected,
        deleteCredentialByTeacherIdAsync.rejected,
        updateCredentialByIdAsync.rejected
        
      ),
      (state, action) => {
        state.zoomSettingLoader = false;
      }
    );
  },
  reducers: {
    emptyzoomSetting: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyzoomSetting } = zoomSettingSlice.actions;

export default zoomSettingSlice.reducer;
