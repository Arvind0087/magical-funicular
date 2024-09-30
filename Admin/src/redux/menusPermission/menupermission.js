import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  permissionMenu: [],
  routepermission: [],
  modulePermit: {},
};

export const menupermissionSlice = createSlice({
  name: "Menu Permission",
  initialState,
  reducers: {
    storepermission: (state, action) => {
      state.permissionMenu = action.payload;
    },
    storeroutepermission: (state, action) => {
      state.routepermission = action.payload;
    },
    storemodulepermit: (state, action) => {
      state.modulePermit = action.payload;
    },
  },
});

export const { storepermission, storeroutepermission, storemodulepermit } =
  menupermissionSlice.actions;

export default menupermissionSlice.reducer;
