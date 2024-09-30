import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userinfoloader: false,
  userinfo: {},
};

export const userinfoSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setUserInfoRedux: (state, action) => {
      state.userinfo = action.payload;
    },
    emptyuserinfo: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const { emptyuserinfo, setUserInfoRedux } = userinfoSlice.actions;

export default userinfoSlice.reducer;
