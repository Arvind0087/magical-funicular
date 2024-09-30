import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getyoutubeChatsAsync } from "./livechat.async";

const initialState = {
  chatLoader: false,
  getChatData: [],
};

export const liveChatSlice = createSlice({
  name: "livechat",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getyoutubeChatsAsync.pending), (state) => {
      state.chatLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getyoutubeChatsAsync.fulfilled),
      (state, action) => {
        state.chatLoader = false;
        state.getChatData = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getyoutubeChatsAsync.rejected),
      (state, action) => {
        state.chatLoader = false;
      }
    );
  },
  reducers: {
    emptyliveclass: (state) => initialState,
  },
});

export default liveChatSlice.reducer;
