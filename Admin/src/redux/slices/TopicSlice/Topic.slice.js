import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getTopicBySubjecIdAsync } from "./Topic.async";

const initialState = {
  TopicLoader: false,
  TopicBySubjecId: []
};

export const TopicSlice = createSlice({
  name: "topic",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getTopicBySubjecIdAsync.pending), (state) => {
      state.TopicLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getTopicBySubjecIdAsync.fulfilled),
      (state, action) => {
        state.TopicLoader = false;
        state.TopicBySubjecId = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getTopicBySubjecIdAsync.rejected),
      (state, action) => {
        state.TopicLoader = false;
      }
    );
  },
  reducers: {
    emptyTopic: (state) => {
      return {
        ...initialState
      };
    }
  }
});
export const { emptyTopic } = TopicSlice.actions;
export default TopicSlice.reducer;
