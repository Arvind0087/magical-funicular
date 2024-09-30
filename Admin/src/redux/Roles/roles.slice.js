import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getRolesAsync,
  createRolesAsync,
  getRolesByIdAsync,
  updatRolesByIdAsync,
  deleteRolesByIdAsync,
  getRolesWithoutSuperAdminAsync,
} from "./roles.async";

const initialState = {
  rolesLoader: false,
  roles: [],
  rolesadd: [],
  rolesById: [],
  updateRolesById: [],
  deleteRolesById: [],
  rolesWithoutSuperAdmin: [],
};

export const rolesSlice = createSlice({
  name: "state",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getRolesAsync.pending,
        createRolesAsync.pending,
        getRolesByIdAsync.pending,
        updatRolesByIdAsync.pending,
        deleteRolesByIdAsync.pending,
        getRolesWithoutSuperAdminAsync.pending,
      ),
      (state) => {
        state.rolesLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getRolesAsync.fulfilled), (state, action) => {
      state.rolesLoader = false;
      state.roles = action.payload;
    });
    builder.addMatcher(isAnyOf(createRolesAsync.fulfilled), (state, action) => {
      state.rolesLoader = false;
      state.rolesadd = action.payload;
    });
    builder.addMatcher(
      isAnyOf(getRolesByIdAsync.fulfilled),
      (state, action) => {
        state.rolesLoader = false;
        state.rolesById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updatRolesByIdAsync.fulfilled),
      (state, action) => {
        state.rolesLoader = false;
        state.updateRolesById = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteRolesByIdAsync.fulfilled),
      (state, action) => {
        state.rolesLoader = false;
        state.deleteRolesById = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getRolesWithoutSuperAdminAsync.fulfilled),
      (state, action) => {
        state.rolesLoader = false;
        state.rolesWithoutSuperAdmin = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getRolesAsync.rejected,
        createRolesAsync.rejected,
        getRolesByIdAsync.rejected,
        updatRolesByIdAsync.rejected,
        deleteRolesByIdAsync.rejected,
        getRolesWithoutSuperAdminAsync.rejected,
      ),
      (state, action) => {
        state.rolesLoader = false;
      }
    );
  },
  reducers: {
    emptyroles: (state) => initialState,
    emptyById: (state) => {
      state.rolesById = [];
    },
  },
});

export const { emptyroles, emptyById } = rolesSlice.actions;

export default rolesSlice.reducer;
