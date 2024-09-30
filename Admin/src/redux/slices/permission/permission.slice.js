import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addPermissionByIdAsync,
  getMenuAsync,
  getPermissionByRoleIdAsync,
  getpermissionAsync,
} from "./permission.async";

const initialState = {
  permissionLoader: false,
  menusPermissionLoader: false,
  permissionById: [],
  permissionadd: [],
  menusPermission: [],
  rolepermissions: [],
};

export const permissionSlice = createSlice({
  name: "Permission",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getpermissionAsync.pending,
        addPermissionByIdAsync.pending,
        getPermissionByRoleIdAsync.pending
      ),
      (state) => {
        state.permissionLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getMenuAsync.pending), (state) => {
      state.menusPermissionLoader = true;
    });

    builder.addMatcher(
      isAnyOf(getpermissionAsync.fulfilled),
      (state, action) => {
        state.permissionLoader = false;
        state.permissionById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(addPermissionByIdAsync.fulfilled),
      (state, action) => {
        state.permissionLoader = false;
        state.permissionadd = action.payload;
      }
    );
    builder.addMatcher(isAnyOf(getMenuAsync.fulfilled), (state, action) => {
      state.menusPermissionLoader = false;
      state.menusPermission = action.payload.data;
    });
    builder.addMatcher(
      isAnyOf(getPermissionByRoleIdAsync.fulfilled),
      (state, action) => {
        state.permissionLoader = false;
        state.rolepermissions = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getpermissionAsync.rejected,
        addPermissionByIdAsync.rejected,
        getMenuAsync.rejected,
        getPermissionByRoleIdAsync.rejected
      ),
      (state, action) => {
        state.permissionLoader = false;
      }
    );
  },
  reducers: {
    emptypermission: (state) => {
      return {
        ...initialState,
      };
    },
    emptyMenu: (state) => {
      state.menusPermission = [];
    },
  },
});

export const { emptypermission, emptyMenu } = permissionSlice.actions;

export default permissionSlice.reducer;
