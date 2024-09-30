import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  sendMessageAsync,
  getyoutubeChatsAsync,
} from "../../redux/livechat/livechat.async";

const initialState = {
  chatLoader: false,
  sendChatData: [],
  getChatData: [],
};

export const liveChatSlice = createSlice({
  name: "chats",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(sendMessageAsync.pending), (state) => {
      state.chatLoader = true;
    });
    builder.addMatcher(isAnyOf(sendMessageAsync.fulfilled), (state, action) => {
      state.chatLoader = false;
      state.sendChatData = action.payload;
    });
    builder.addMatcher(isAnyOf(sendMessageAsync.rejected), (state, action) => {
      state.chatLoader = false;
    });

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
});

export default liveChatSlice.reducer;
