import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
    getStudentStrengthByBatchTypeAsync,
    userRegisteredAsync
} from "./studentStrenghtbarChart.async";

const initialState = {
    studentStrengthLoader: false,
    studentStrength: [],
    userRegistered:[]
};

export const studentStrengthGraphSlice = createSlice({
    name: "studentStrength",
    initialState,
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(
                getStudentStrengthByBatchTypeAsync.pending,
                userRegisteredAsync.pending
            ),
            (state) => {
                state.studentStrengthLoader = true;
            }
        );
        builder.addMatcher(
            isAnyOf(getStudentStrengthByBatchTypeAsync.fulfilled),
            (state, action) => {
                state.studentStrengthLoader = false;
                state.studentStrength = action.payload?.data;
            }
        );

        builder.addMatcher(
            isAnyOf(userRegisteredAsync.fulfilled),
            (state, action) => {
                state.studentStrengthLoader = false;
                state.userRegistered = action.payload?.data;
            }
        );
        builder.addMatcher(
            isAnyOf(
                getStudentStrengthByBatchTypeAsync.rejected,
                userRegisteredAsync.rejected
            ),
            (state, action) => {
                state.studentStrengthLoader = false;
            }
        );
    },
    reducers: {
        emptyStudentStrength: (state) => initialState,
    },
});
export const { emptyStudentStrength } = studentStrengthGraphSlice.actions;

export default studentStrengthGraphSlice.reducer;
