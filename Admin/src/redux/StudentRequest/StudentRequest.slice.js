import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllStudentRequestAsync } from "./StudentRequest.async";

const initialState = {
  studentRequestLoader: false,
  studentRequest: [],
};

export const studentRequestSlice = createSlice({
  name: "StudentRequest",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllStudentRequestAsync.pending), (state) => {
      state.studentRequestLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllStudentRequestAsync.fulfilled),
      (state, action) => {
        state.studentRequestLoader = false;
        state.studentRequest = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllStudentRequestAsync.rejected),
      (state, action) => {
        state.studentRequestLoader = false;
      }
    );
  },
  reducers: {
    emptyStudentRequest: (state) => {
      return {
        ...initialState,
      };
    },
  },
});
export const { emptyStudentRequest } = studentRequestSlice.actions;
export default studentRequestSlice.reducer;
