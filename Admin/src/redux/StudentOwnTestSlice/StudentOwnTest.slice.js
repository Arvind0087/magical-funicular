import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import {
    getStudentOwnTest,
} from "./StudentOwnTest.async";

const initialState = {
    studentOwnQuestionLoader: false,
    getAllStudentOwnQuestions: [],

};

export const studentOwnTestSlice = createSlice({
    name: "Scholorship",
    initialState,
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(
                getStudentOwnTest.pending,
            ),
            (state) => {
                state.studentOwnQuestionLoader = true;
            }
        );
        builder.addMatcher(
            isAnyOf(getStudentOwnTest.fulfilled),
            (state, action) => {
                state.studentOwnQuestionLoader = false;
                state.getAllStudentOwnQuestions = action.payload;
            }
        );
        builder.addMatcher(
            isAnyOf(
                getStudentOwnTest.rejected,
            ),
            (state, action) => {
                state.studentOwnQuestionLoader = false;
            }
        );
    },

    reducers: {
        emptyStudentOwnQuestion: (state) => {
            return {
                ...initialState,
            };
        },
    },
});

export const { emptyStudentOwnQuestion } = studentOwnTestSlice.actions;

export default studentOwnTestSlice.reducer;
