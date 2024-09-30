import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllInstructionAsync, updateWebByIdAsync } from "./WebAsync.api";

const initialState = {
  instructionLoader: false,
  instruction: [],
  instructionUpdate: [],
};

export const instructionSlice = createSlice({
  name: "instruction",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(getAllInstructionAsync.pending, updateWebByIdAsync.pending),
      (state) => {
        state.instructionLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllInstructionAsync.fulfilled),
      (state, action) => {
        state.instructionLoader = false;
        state.instruction = action.payload.data;
      }
    );

    builder.addMatcher(
      isAnyOf(updateWebByIdAsync.fulfilled),
      (state, action) => {
        state.instructionLoader = false;
        state.instructionUpdate = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(getAllInstructionAsync.rejected, updateWebByIdAsync.rejected),
      (state, action) => {
        state.instructionLoader = false;
      }
    );
  },
  reducers: {
    emptyinstruction: (state) => {
      state.instructionUpdate = [];
    },
  },
});
export const { emptyinstruction } = instructionSlice.actions;
export default instructionSlice.reducer;
