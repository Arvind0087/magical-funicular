import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
    getstudentAttandenceReportAsync
} from "./studentStrenghtbarChart.async";

const initialState = {
    studentAttendanceLoader: false,
    studentAttendance: []
};

export const studentAttendanceGraphSlice = createSlice({
    name: "studentAttendance",
    initialState,
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(
                getstudentAttandenceReportAsync.pending,
            ),
            (state) => {
                state.studentAttendanceLoader = true;
            }
        );
        builder.addMatcher(
            isAnyOf(getstudentAttandenceReportAsync.fulfilled),
            (state, action) => {
                state.studentAttendanceLoader = false;
                state.studentAttendance = action.payload?.data;
            }
        );

        builder.addMatcher(
            isAnyOf(
                getstudentAttandenceReportAsync.rejected,
            ),
            (state, action) => {
                state.studentAttendanceLoader = false;
            }
        );
    },
    reducers: {
        emptyStudentAttendance: (state) => initialState,
    },
});
export const { emptyStudentAttendance } = studentAttendanceGraphSlice.actions;

export default studentAttendanceGraphSlice.reducer;
