import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getUserLeaderBoardAsync } from "redux/async.api";
const initialState = {
    userLeaderBoard:{},
    getUserLeaderBoardLoader:false
};

export const userLeaderBoardSlice = createSlice({
  name: "LeaderBoard",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getUserLeaderBoardAsync.pending), (state) => {
      state.getUserLeaderBoardLoader = true;
    });
    builder.addMatcher(isAnyOf(getUserLeaderBoardAsync.fulfilled), (state, action) => {
      state.getUserLeaderBoardLoader = false;
      state.userLeaderBoard = action.payload.data;
    });
    builder.addMatcher(isAnyOf(getUserLeaderBoardAsync.rejected), (state, action) => {
      state.getUserLeaderBoardLoader = false;
    });
  },
});


export default userLeaderBoardSlice.reducer;
